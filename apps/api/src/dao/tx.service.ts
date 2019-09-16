import {forwardRef, Inject, Injectable} from '@nestjs/common'
import {InjectEntityManager, InjectRepository} from '@nestjs/typeorm'
import BigNumber from 'bignumber.js'
import {Brackets, EntityManager, Equal, FindOneOptions, In, LessThanOrEqual, Repository} from 'typeorm'
import {ReceiptService} from './receipt.service'
import {TraceService, TransactionStatus} from './trace.service'
import {FilterEnum, TransactionSummary} from '@app/graphql/schema'
import {ContractService} from '@app/dao/contract.service'
import {TransactionEntity} from '@app/orm/entities/transaction.entity';
import {BlockHeaderEntity} from '@app/orm/entities/block-header.entity';
import {AddressTransactionCountEntity} from '@app/orm/entities/address-transaction-count.entity';
import {CanonicalCountEntity} from '@app/orm/entities/canonical-count.entity';
import {TransactionReceiptEntity} from '@app/orm/entities/transaction-receipt.entity';
import {ContractEntity} from '@app/orm/entities/contract.entity';

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

  async findOneByHash(hash: string, blockNumber: BigNumber): Promise<TransactionEntity | undefined> {
    const txs = await this.findByHash([hash], blockNumber)

    if (txs.length !== 1) return undefined

    return txs[0]
  }

  async findByHash(hashes: string[], blockNumber: BigNumber): Promise<TransactionEntity[]> {
    const txs = await this.transactionRepository.find({
      where: { hash: In(hashes), blockNumber: LessThanOrEqual(blockNumber) },
      relations: ['receipt'],
      cache: true,
    })
    if (!txs.length) { // User may be searching by hash which does not exist as a tx
      return []
    }
    return this.findAndMapTraces(txs)
  }

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
          return [[], this.zeroBI] // This block has not been mined/synced yet
        }

        const header = await txn.findOne(BlockHeaderEntity, { where: { number: Equal(number) }, select: ['transactionCount'], cache: true })
        const count = header ? header.transactionCount : 0

        if (count === 0) return [[], this.zeroBI]

        const txs = await txn.find(TransactionEntity, {
          select: ['hash'],
          where: { blockNumber: Equal(number) },
          skip: offset,
          take: limit,
          cache: true,
        })

        const summaries = await this.findSummariesByHash(txs.map(t => t.hash), txn)
        return [summaries, new BigNumber(count)]
      },
    )

  }

  async findSummariesByBlockHash(hash: string, offset: number = 0, limit: number = 20, blockNumber: BigNumber): Promise<[TransactionSummary[], BigNumber]> {

    return this.entityManager.transaction(
      'READ COMMITTED',
      async (txn): Promise<[TransactionSummary[], BigNumber]> => {

        const header = await txn.findOne(BlockHeaderEntity, {
          where: { hash, number: LessThanOrEqual(blockNumber) },
          select: ['transactionCount'] ,
          cache: true,
        })
        const count = header ? header.transactionCount : 0

        if (count === 0) return [[], this.zeroBI]

        const txs = await txn.find(TransactionEntity, {
          select: ['hash'],
          where: { blockHash: hash },
          skip: offset,
          take: limit,
          cache: true,
        })

        const summaries = await this.findSummariesByHash(txs.map(t => t.hash), txn)
        return [summaries, new BigNumber(count)]
      },
    )

  }

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

        // Use address_transaction_count table to retrieve count as far more efficient than performing count against transaction

        const transactionCount = await txn.findOne(AddressTransactionCountEntity, {
          where: { address, blockNumber: LessThanOrEqual(blockNumber) },
          order: { blockNumber: 'DESC' },
          cache: true,
        })

        if (!transactionCount) {
          return [[], this.zeroBI]
        }

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

        if (totalCount === 0) return [[], totalCount]

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

        const txs = await qb
          .setParameters({ address, blockNumber: blockNumber.toNumber() })
          .select(['t.hash'])
          .skip(offset)
          .take(limit)
          .orderBy('block_number', 'DESC')
          .addOrderBy('transaction_index', 'DESC')
          .cache(true)
          .getMany()

        const summaries = await this.findSummariesByHash(txs.map(t => t.hash), txn)
        return [summaries, totalCount]
      },
    )

  }

  async findSummaries(offset: number = 0, limit: number = 20, blockNumber: BigNumber): Promise<[TransactionSummary[], BigNumber]> {

    return this.entityManager.transaction(
      'READ COMMITTED',
      async (entityManager): Promise<[TransactionSummary[], BigNumber]> => {

        const { count: totalCount } = await entityManager.findOne(CanonicalCountEntity, {
          select: ['count'],
          where: {
            entity: 'transactions',
            blockNumber: Equal(blockNumber),
          },
          cache: true,
        } as FindOneOptions)

        if (totalCount.isEqualTo(0)) return [[], totalCount]

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

        const receipts = await this.receiptService
          .findByTxHash(entityManager, txs.map(tx => tx.hash), ['transactionHash', 'gasUsed'])

        const receiptsByTxHash = receipts
          .reduceRight(
            (memo, next) => memo.set(next.transactionHash, next),
            new Map<string, TransactionReceiptEntity>(),
          )

        const txsWithReceipts = txs.map(tx => {
          const receipt = receiptsByTxHash.get(tx.hash)
          return new TransactionEntity({ ...tx, receipt })
        })
        return this.summarise(entityManager, txsWithReceipts, totalCount)
      },
    )

  }

  async findSummariesByHash(hashes: string[], entityManager: EntityManager = this.entityManager): Promise<TransactionSummary[]> {

    if (!(hashes && hashes.length)) return []

    const manager = entityManager || this.entityManager

    const txs = await manager
      .find(TransactionEntity, {
        select: ['blockNumber', 'blockHash', 'hash', 'transactionIndex', 'timestamp', 'gasPrice', 'from', 'to', 'creates', 'value'],
        where: { hash: In(hashes) },
        order: {
          blockNumber: 'DESC',
          transactionIndex: 'DESC',
        },
        cache: true,
      })

    const receipts = await this.receiptService
      .findByTxHash(manager, txs.map(tx => tx.hash), ['transactionHash', 'gasUsed'])

    const receiptsByTxHash = receipts
      .reduceRight(
        (memo, next) => memo.set(next.transactionHash, next),
        new Map<string, TransactionReceiptEntity>(),
      )

    const txsWithReceipts = txs.map(tx => {
      const receipt = receiptsByTxHash.get(tx.hash)
      return new TransactionEntity({ ...tx, receipt })
    })

    const [summaries, count] = await this.summarise(manager, txsWithReceipts, new BigNumber(txsWithReceipts.length))
    return summaries
  }

  private async summarise(entityManager: EntityManager, txs: TransactionEntity[], count: BigNumber): Promise<[TransactionSummary[], BigNumber]> {

    if (!txs.length) return [[], new BigNumber(0)]

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
