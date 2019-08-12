import { TransactionEntity } from '@app/orm/entities/transaction.entity'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import BigNumber from 'bignumber.js'
import { EntityManager, In, LessThanOrEqual, MoreThan, Repository } from 'typeorm'
import { ReceiptService } from './receipt.service'
import { TraceService, TransactionStatus } from './trace.service'
import { TransactionSummary } from '@app/graphql/schema'
import { ContractService } from '@app/dao/contract.service'
import { ContractEntity } from '@app/orm/entities/contract.entity'
import { TransactionReceiptEntity } from '@app/orm/entities/transaction-receipt.entity'
import { PartialReadException } from '@app/shared/errors/partial-read-exception'
import { CanonicalCount } from '@app/orm/entities/row-counts.entity'
import { DbConnection } from '@app/orm/config'
import { TransactionCountEntity } from '@app/orm/entities/transaction-count.entity'

@Injectable()
export class TxService {

  constructor(
    private readonly receiptService: ReceiptService,
    private readonly traceService: TraceService,
    @Inject(forwardRef(() => ContractService))
    private readonly contractService: ContractService,
    @InjectRepository(TransactionEntity, DbConnection.Principal)
    private readonly transactionRepository: Repository<TransactionEntity>,
    @InjectEntityManager(DbConnection.Principal)
    private readonly entityManager: EntityManager,
  ) {
  }

  async findOneByHash(hash: string): Promise<TransactionEntity | undefined> {
    const txs = await this.findByHash(hash)

    if (txs.length !== 1) return undefined

    const tx = txs[0]

    // Partial read checks
    if (tx.blockNumber.isGreaterThan(0)) {

      // genesis block has no receipt or traces

      if (!tx.receipt) {
        throw new PartialReadException(`Receipt not found, tx hash = ${tx.hash}`)
      }

      if (!tx.trace) {
        throw new PartialReadException(`Traces not found, tx hash = ${tx.hash}`)
      }

    }

    return tx
  }

  async findByHash(...hashes: string[]): Promise<TransactionEntity[]> {
    const txs = await this.transactionRepository.find({
      where: { hash: In(hashes) },
      relations: ['receipt'],
      cache: true,
    })
    return this.findAndMapTraces(txs)
  }

  async findSummariesByBlockNumber(number: BigNumber, offset: number, limit: number): Promise<[TransactionSummary[], number]> {

    return this.entityManager.transaction(
      'READ COMMITTED',
      async (txn): Promise<[TransactionSummary[], number]> => {

        const where = { blockNumber: number }

        const { count } = await txn
          .createQueryBuilder()
          .select('COUNT(hash)', 'count')
          .from(TransactionEntity, 't')
          .where(`block_number = ${number.toString()}`)
          .cache(true)
          .setParameters({ number })
          .getRawOne() as { count: number }

        if (count === 0) return [[], count]

        const txs = await txn.find(TransactionEntity, {
          select: ['hash'],
          where,
          skip: offset,
          take: limit,
          cache: true,
        })

        const summaries = await this.findSummariesByHash(txs.map(t => t.hash), txn)
        return [summaries, count]
      },
    )

  }

  async findSummariesByBlockHash(hash: string, offset: number, limit: number): Promise<[TransactionSummary[], number]> {

    return this.entityManager.transaction(
      'READ COMMITTED',
      async (txn): Promise<[TransactionSummary[], number]> => {

        const where = { blockHash: hash }

        const { count } = await txn
          .createQueryBuilder()
          .select('COUNT(hash)', 'count')
          .from(TransactionEntity, 't')
          .where('block_hash = :hash')
          .cache(true)
          .setParameters({ hash })
          .getRawOne() as { count: number }

        if (count === 0) return [[], count]

        const txs = await txn.find(TransactionEntity, {
          select: ['hash'],
          where,
          skip: offset,
          take: limit,
          cache: true,
        })

        const summaries = await this.findSummariesByHash(txs.map(t => t.hash), txn)
        return [summaries, count]
      },
    )

  }

  async findSummariesByAddress(address: string, filter?: string, offset: number = 0, limit: number = 20): Promise<[TransactionSummary[], number]> {

    return this.entityManager.transaction(
      'READ COMMITTED',
      async (txn): Promise<[TransactionSummary[], number]> => {

        // Use transaction_count table to retrieve count as far more efficient than performing count against canonical_transaction

        const transactionCount = await txn.findOne(TransactionCountEntity, { where: { address }, cache: true })

        if (!transactionCount) {
          return [[], 0]
        }

        let totalCount

        switch (filter) {
          case 'in':
            totalCount = transactionCount.totalIn
            break
          case 'out':
            totalCount = transactionCount.totalOut
            break
          default:
            totalCount = transactionCount.totalIn + transactionCount.totalOut
        }

        if (totalCount === 0) return [[], totalCount]

        let where

        switch (filter) {
          case 'in':
            where = { to: address }
            break
          case 'out':
            where = { from: address }
            break
          default:
            where = [{ from: address }, { to: address }]
            break
        }

        const txs = await txn.find(TransactionEntity, {
          select: ['hash'],
          where,
          skip: offset,
          take: limit,
          order: {blockNumber: 'DESC', transactionIndex: 'DESC'},
          cache: true,
        })

        const summaries = await this.findSummariesByHash(txs.map(t => t.hash), txn)
        return [summaries, totalCount]
      },
    )

  }

  async findSummaries(offset: number, limit: number, fromBlock?: BigNumber): Promise<[TransactionSummary[], number]> {

    const where = fromBlock ? { blockNumber: LessThanOrEqual(fromBlock) } : {}

    return this.entityManager.transaction(
      'READ COMMITTED',
      async (entityManager): Promise<[TransactionSummary[], number]> => {

        const [{ count: totalCount }] = await entityManager.find(CanonicalCount, {
          select: ['count'],
          where: {
            entity: 'transaction',
          },
          cache: true,
        })

        if (totalCount === 0) return [[], totalCount]

        const txs = await entityManager.find(TransactionEntity, {
          select: ['blockNumber', 'blockHash', 'hash', 'transactionIndex', 'timestamp', 'gasPrice', 'from', 'to', 'creates', 'value'],
          where,
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

    const [summaries, count] = await this.summarise(manager, txsWithReceipts, txsWithReceipts.length)
    return summaries
  }

  private async summarise(entityManager: EntityManager, txs: TransactionEntity[], count: number): Promise<[TransactionSummary[], number]> {

    if (!txs.length) return [[], 0]

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
        (contract && contract.metadata && contract.metadata.name) ||
        (contract && contract.erc20Metadata && contract.erc20Metadata.name) ||
        (contract && contract.erc721Metadata && contract.erc721Metadata.name)

      const contractSymbol =
        (contract && contract.metadata && contract.metadata.symbol) ||
        (contract && contract.erc20Metadata && contract.erc20Metadata.symbol) ||
        (contract && contract.erc721Metadata && contract.erc721Metadata.symbol)

      // Partial read checks

      const txStatus = txStatusByHash.get(tx.hash)
      const { receipt } = tx

      if (tx.blockNumber.isGreaterThan(0)) {

        // genesis block has no trace or receipt

        // Root trace
        if (!txStatus) {
          throw new PartialReadException(`Root trace missing, tx hash = ${tx.hash}`)
        }
        // Receipt
        if (!receipt) {
          throw new PartialReadException(`Receipt missing, tx hash = ${tx.hash}`)
        }

      }

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
