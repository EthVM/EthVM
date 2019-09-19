import {forwardRef, Inject, Injectable} from '@nestjs/common'
import {InjectEntityManager, InjectRepository} from '@nestjs/typeorm'
import BigNumber from 'bignumber.js'
import {Brackets, EntityManager, Equal, FindOneOptions, In, LessThanOrEqual, Repository} from 'typeorm'
import {ReceiptService} from './receipt.service'
import {TraceService, TransactionStatus} from './trace.service'
import {FilterEnum, TransactionSummary} from '@app/graphql/schema'
import {ContractService} from '@app/dao/contract.service'
import {TransactionEntity} from '@app/orm/entities/transaction.entity'
import {BlockHeaderEntity} from '@app/orm/entities/block-header.entity'
import {AddressTransactionCountEntity} from '@app/orm/entities/address-transaction-count.entity'
import {CanonicalCountEntity} from '@app/orm/entities/canonical-count.entity'
import {TransactionReceiptEntity} from '@app/orm/entities/transaction-receipt.entity'
import {ContractEntity} from '@app/orm/entities/contract.entity'

@Injectable()
export class TxService {

  private zeroBI = new BigNumber(0)

  constructor(
    private readonly receiptService: ReceiptService,
    private readonly traceService: TraceService,
    @Inject(forwardRef(() => ContractService))
    private readonly contractService: ContractService,
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
  }

  /**
   * Find a transaction entity by its hash.
   * @param {string} hash - The transaction hash.
   * @param {BigNumber} blockNumber - Transactions after this block number will be ignored.
   * @returns {Promise<TransactionEntity | undefined>}
   */
  async findOneByHash(hash: string, blockNumber: BigNumber): Promise<TransactionEntity | undefined> {
    const txs = await this.findByHash([hash], blockNumber)

    if (txs.length !== 1) return undefined

    return txs[0]
  }

  /**
   * Find many transaction entities by an array of hashes.
   * @param {string} hashes - The array of transaction hashes.
   * @param {BigNumber} blockNumber - Transactions after this block number will be ignored.
   * @returns {Promise<TransactionEntity[]>}
   */
  async findByHash(hashes: string[], blockNumber: BigNumber): Promise<TransactionEntity[]> {
    const txs = await this.transactionRepository.find({
      where: { hash: In(hashes), blockNumber: LessThanOrEqual(blockNumber) },
      relations: ['receipt'],
      cache: true,
    })
    if (!txs.length) { // User may be searching by hash which does not exist as a tx by this block number.
      return []
    }
    return this.findAndMapTraces(txs)
  }

  /**
   * Find and summarise a page of transaction entities for a given block number.
   * @param {BigNumber} number - The block number of the transactions.
   * @param {number} [offset=0] - The number of items to skip.
   * @param {number} [limit=20] - The page size.
   * @param {BigNumber} blockNumber - Transactions after this block will be ignored.
   * @returns {Promise<TransactionSummary[], BigNumber>} An array of summarised transactions and the total number of transactions with this block number.
   */
  async findSummariesByBlockNumber(
    number: BigNumber,
    offset: number = 0,
    limit: number = 20,
    blockNumber: BigNumber,
  ): Promise<[TransactionSummary[], BigNumber]> {

    return this.entityManager.transaction(
      'READ COMMITTED',
      async (txn): Promise<[TransactionSummary[], BigNumber]> => {

        if (number.isGreaterThan(blockNumber)) {
          return [[], this.zeroBI] // This block has not been synced yet, return an empty array.
        }

        // Retrieve the total count of txs from the block header entity.
        const header = await txn.findOne(BlockHeaderEntity, { where: { number: Equal(number) }, select: ['transactionCount'], cache: true })
        const count = header ? header.transactionCount : 0

        if (count === 0) return [[], this.zeroBI] // Return an empty array if the tx count is 0.

        // Select only the hash field from the tx entities.
        const txs = await txn.find(TransactionEntity, {
          select: ['hash'],
          where: { blockNumber: Equal(number) },
          skip: offset,
          take: limit,
          cache: true,
        })

        // Use the hashes to create summaries of the txs before returning.
        const summaries = await this.findSummariesByHash(txs.map(t => t.hash), txn)
        return [summaries, new BigNumber(count)]
      },
    )
  }

  /**
   * Find a page of tx summaries for a given block hash.
   * @param {string} hash -  The block hash.
   * @param {number} [offset=0] - The number of items to skip.
   * @param {number} [limit=20] - The page size.
   * @param {BigNumber} blockNumber - Transactions after this block will be ignored.
   * @returns {Promise<TransactionSummary[], BigNumber>} An array of summarised transactions and the total number of transactions with this block hash.
   */
  async findSummariesByBlockHash(hash: string, offset: number = 0, limit: number = 20, blockNumber: BigNumber): Promise<[TransactionSummary[], BigNumber]> {

    return this.entityManager.transaction(
      'READ COMMITTED',
      async (txn): Promise<[TransactionSummary[], BigNumber]> => {

        // Retrieve the total count of txs from the block header entity.
        const header = await txn.findOne(BlockHeaderEntity, {
          where: { hash, number: LessThanOrEqual(blockNumber) },
          select: ['transactionCount'] ,
          cache: true,
        })
        const count = header ? header.transactionCount : 0

        if (count === 0) return [[], this.zeroBI] // Return an empty array if the tx count is 0.

        // Select only the hash field from the tx entities.
        const txs = await txn.find(TransactionEntity, {
          select: ['hash'],
          where: { blockHash: hash },
          skip: offset,
          take: limit,
          cache: true,
        })

        // Use the hashes to create summaries of the txs before returning.
        const summaries = await this.findSummariesByHash(txs.map(t => t.hash), txn)
        return [summaries, new BigNumber(count)]
      },
    )
  }

  /**
   * Find a page of tx summaries for a given address.
   * @param {string} address - The address hash.
   * @param {FilterEnum} [filter="all"] - A directional filter (in, out or all).
   * @param {number} [offset=0] - The number of items to skip.
   * @param {number} [limit=20] - The page size.
   * @param {BigNumber} blockNumber - Transactions after this block will be ignored.
   * @returns {Promise<TransactionSummary[], BigNumber>} An array of summarised transactions and the total number of transactions for this address and filter.
   */
  async findSummariesByAddress(
    address: string,
    filter: FilterEnum = FilterEnum.all,
    offset: number = 0,
    limit: number = 20,
    blockNumber: BigNumber,
  ): Promise<[TransactionSummary[], BigNumber]> {

    return this.entityManager.transaction(
      'READ COMMITTED',
      async (txn): Promise<[TransactionSummary[], BigNumber]> => {

        // Use address_transaction_count table to retrieve count as it's far more efficient than performing count against transaction table.

        const transactionCount = await txn.findOne(AddressTransactionCountEntity, {
          where: { address, blockNumber: LessThanOrEqual(blockNumber) },
          order: { blockNumber: 'DESC' },
          cache: true,
        })

        if (!transactionCount) {
          return [[], this.zeroBI] // Return an empty array if a count entry is not found for this address.
        }

        // Determine the total count based on the filter.

        let totalCount

        switch (filter) {
          case FilterEnum.in:
            totalCount = transactionCount.totalIn
            break
          case FilterEnum.out:
            totalCount = transactionCount.totalOut
            break
          default:
            totalCount = transactionCount.total
        }

        if (totalCount === 0) return [[], totalCount] // Return an empty array if the total count is zero.

        // Build the query.

        const qb = txn.createQueryBuilder(TransactionEntity, 't')
          .select(['hash'])
          .where('t.block_number <= :blockNumber')

        switch (filter) {
          case 'in':
            qb.andWhere('t.to = :address')
            break
          case 'out':
            qb.andWhere('t.from = :address')
            break
          default:
            qb.andWhere(new Brackets(sqb => {
              sqb.where('t.from = :address')
                .orWhere('t.to = :address')
            }))
            break
        }

        // Select only the hash field of the transaction entities.
        const txs = await qb
          .setParameters({ address, blockNumber: blockNumber.toNumber() })
          .select(['t.hash'])
          .skip(offset)
          .take(limit)
          .orderBy('block_number', 'DESC')
          .addOrderBy('transaction_index', 'DESC')
          .cache(true)
          .getMany()

        // Use the hashes to create summaries of the txs before returning.
        const summaries = await this.findSummariesByHash(txs.map(t => t.hash), txn)
        return [summaries, totalCount]
      },
    )

  }

  /**
   * Find and summarise a page of transaction entities.
   * @param {number} [offset=0] - The number of items to skip.
   * @param {number} [limit=20] - The page size.
   * @param {BigNumber} blockNumber - Transactions after this block will be ignored.
   * @returns {Promise<TransactionSummary[], BigNumber>} An array of summarised transactions and the total number of transactions.
   */
  async findSummaries(offset: number = 0, limit: number = 20, blockNumber: BigNumber): Promise<[TransactionSummary[], BigNumber]> {

    return this.entityManager.transaction(
      'READ COMMITTED',
      async (entityManager): Promise<[TransactionSummary[], BigNumber]> => {

        // Get the total count of txs by the given block number.
        const { count: totalCount } = await entityManager.findOne(CanonicalCountEntity, {
          select: ['count'],
          where: {
            entity: 'transactions',
            blockNumber: Equal(blockNumber),
          },
          cache: true,
        } as FindOneOptions)

        if (totalCount.isEqualTo(0)) return [[], totalCount] // Return an empty array if the total count is zero.

        // Select the necessary fields from the transaction entities for creating tx summaries.
        const txs = await entityManager.find(TransactionEntity, {
          select: ['blockNumber', 'blockHash', 'hash', 'transactionIndex', 'timestamp', 'gasPrice', 'from', 'to', 'creates', 'value'],
          where: { blockNumber: LessThanOrEqual(blockNumber) },
          order: {
            blockNumber: 'DESC',
            transactionIndex: 'DESC',
          },
          skip: offset,
          take: limit,
          cache: true,
        })

        // Retrieve the necessary fields from the receipt entities for these txs. This is performed as a separate query not a join to improve performance.
        const receipts = await this.receiptService
          .findByTxHash(entityManager, txs.map(tx => tx.hash), ['transactionHash', 'gasUsed'])

        // Map the receipts by their tx hashes.
        const receiptsByTxHash = receipts
          .reduceRight(
            (memo, next) => memo.set(next.transactionHash, next),
            new Map<string, TransactionReceiptEntity>(),
          )

        // Map the receipts and txs together.
        const txsWithReceipts = txs.map(tx => {
          const receipt = receiptsByTxHash.get(tx.hash)
          return new TransactionEntity({ ...tx, receipt })
        })
        // Summarise the txs and receipts before returning.
        return this.summarise(entityManager, txsWithReceipts, totalCount)
      },
    )

  }

  /**
   * Find and summarise txs matching an array of tx hashes.
   * @param {string[]} hashes - The array of transactions hashes.
   * @param {EntityManager} [entityManager=this.entityManager] - An optional txn within which to perform the query.
   * @returns {Promise<TransactionSummary[]>}
   */
  async findSummariesByHash(hashes: string[], entityManager: EntityManager = this.entityManager): Promise<TransactionSummary[]> {

    if (!(hashes && hashes.length)) return []

    // Select the necessary fields from the tx entities for creating tx summaries.
    const txs = await entityManager
      .find(TransactionEntity, {
        select: ['blockNumber', 'blockHash', 'hash', 'transactionIndex', 'timestamp', 'gasPrice', 'from', 'to', 'creates', 'value'],
        where: { hash: In(hashes) },
        order: {
          blockNumber: 'DESC',
          transactionIndex: 'DESC',
        },
        cache: true,
      })

    // Retrieve the necessary fields from the receipt entities for these txs. This is performed as a separate query not a join to improve performance.
    const receipts = await this.receiptService
      .findByTxHash(entityManager, txs.map(tx => tx.hash), ['transactionHash', 'gasUsed'])

    // Map the receipts by their tx hashes.
    const receiptsByTxHash = receipts
      .reduceRight(
        (memo, next) => memo.set(next.transactionHash, next),
        new Map<string, TransactionReceiptEntity>(),
      )

    // Map the receipts and txs together.
    const txsWithReceipts = txs.map(tx => {
      const receipt = receiptsByTxHash.get(tx.hash)
      return new TransactionEntity({ ...tx, receipt })
    })

    // Summarise the txs and receipts before returning.
    const [summaries, count] = await this.summarise(entityManager, txsWithReceipts, new BigNumber(txsWithReceipts.length))
    return summaries
  }

  /**
   * Summarise an array of transaction entities.
   * @private
   * @param {EntityManager} entityManager - The txn within which to perform queries.
   * @param {TransactionEntity[]} txs - The array of transaction entities with receipts.
   * @param {BigNumber} count - The number of transactions to be summarised.
   * @returns {Promise<[TransactionSummary[], BigNumber]>} An array of tx summaries and the count.
   */
  private async summarise(entityManager: EntityManager, txs: TransactionEntity[], count: BigNumber): Promise<[TransactionSummary[], BigNumber]> {

    if (!txs.length) return [[], new BigNumber(0)]

    // Find and map tx statuses and contracts for each transaction.

    const { traceService, contractService } = this

    const txHashes: string[] = []
    const contractAddresses: string[] = []

    txs.forEach(tx => {
      txHashes.push(tx.hash)
      if (tx.creates && tx.creates !== '') contractAddresses.push(tx.creates)
    })

    const txStatusesPromise = traceService.findTxStatusByTxHash(entityManager, txHashes)
    const contractsPromise = contractService.findAllByAddress(entityManager, contractAddresses)

    const txStatuses = await txStatusesPromise
    const contracts = await contractsPromise

    const txStatusByHash = txStatuses.reduce((memo, next) => {
      memo.set(next.transactionHash, next)
      return memo
    }, new Map<string, TransactionStatus>())

    const contractsByAddress = contracts.reduce((memo, next) => {
      memo.set(next.address, next)
      return memo
    }, new Map<string, ContractEntity>())

    // Build summaries of each transaction.

    const summaries = txs.map(tx => {

      const contract = tx.creates ? contractsByAddress.get(tx.creates) : undefined

      const contractName =
        (contract && contract.ethListContractMetadata && contract.ethListContractMetadata.name) ||
        (contract && contract.contractMetadata && contract.contractMetadata.name)

      const contractSymbol =
        (contract && contract.ethListContractMetadata && contract.ethListContractMetadata.symbol) ||
        (contract && contract.contractMetadata && contract.contractMetadata.symbol)

      const txStatus = txStatusByHash.get(tx.hash)
      const { receipt } = tx

      // default for genesis block
      const successful = txStatus ? txStatus.successful : true
      const gasUsed = receipt ? receipt.gasUsed : new BigNumber(0)

      return {
        hash: tx.hash,
        blockNumber: tx.blockNumber,
        transactionIndex: tx.transactionIndex,
        from: tx.from,
        to: tx.to,
        creates: tx.creates,
        contractName,
        contractSymbol,
        value: tx.value,
        fee: tx.gasPrice.multipliedBy(gasUsed),
        successful,
        timestamp: tx.timestamp,
      } as TransactionSummary
    })

    return [summaries, count]
  }

  /**
   * Find and map together trace entities for an array of transaction entities.
   * @private
   * @param {TransactionEntity[]} txs - The array of transaction entities.
   * @returns {Promise<TransactionEntity[]>} - The inputted array of transaction entities together with their trace entity relations.
   */
  private async findAndMapTraces(txs: TransactionEntity[]): Promise<TransactionEntity[]> {

    const traces = await this.traceService.findByTxHash(txs.map(tx => tx.hash))

    const txsByHash = txs.reduce((memo, next) => {
      memo.set(next.hash, next)
      return memo
    }, new Map<string, TransactionEntity>())

    traces.forEach(trace => {
      const tx = txsByHash.get(trace.transactionHash!)!
      tx.trace = trace
    })

    return Array.from(txsByHash.values())
  }

}
