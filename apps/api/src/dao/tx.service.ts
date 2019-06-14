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
import { RowCount } from '@app/orm/entities/row-counts.entity'
import { add } from 'winston'

@Injectable()
export class TxService {

  constructor(
    private readonly receiptService: ReceiptService,
    private readonly traceService: TraceService,
    @Inject(forwardRef(() => ContractService))
    private readonly contractService: ContractService,
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager
  ) {
  }

  async findOneByHash(hash: string): Promise<TransactionEntity | undefined> {
    const txs = await this.findByHash(hash)

    if (txs.length !== 1) return undefined

    const tx = txs[0]

    // Partial read checks

    // Receipt
    if (!tx.receipt) {
      throw new PartialReadException(`Receipt not found, tx hash = ${tx.hash}`)
    }

    // Partial read check
    if (!tx.trace) {
      throw new PartialReadException(`Traces not found, tx hash = ${tx.hash}`)
    }

    return tx
  }

  async findByHash(...hashes: string[]): Promise<TransactionEntity[]> {
    const txs = await this.transactionRepository.find({
      where: { hash: In(hashes) },
      relations: ['receipt'],
      cache: true
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
          .where('block_number = :number')
          .cache(true)
          .setParameters({ number })
          .getRawOne() as { count: number }

        if (count === 0) return [[], count]

        const txs = await txn.find(TransactionEntity, {
          select: ['hash'],
          where,
          skip: offset,
          take: limit,
          cache: true
        })

        const summaries = await this.findSummariesByHash(txs.map(t => t.hash), txn)
        return [summaries, count]
      }
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
          cache: true
        })

        const summaries = await this.findSummariesByHash(txs.map(t => t.hash), txn)
        return [summaries, count]
      }
    )

  }

  async findSummariesByAddress(address: string, filter?: string, offset: number = 0, limit: number = 20): Promise<[TransactionSummary[], number]> {

    return this.entityManager.transaction(
      'READ COMMITTED',
      async (txn): Promise<[TransactionSummary[], number]> => {

        const countQueryBuilder = txn.createQueryBuilder()
          .select('count(hash)', 'count')
          .from(TransactionEntity, 't')

        let where

        switch (filter) {
          case 'in':
            where = { to: address }

            countQueryBuilder
              .where('"to" = :to')
              .setParameter('to', address)

            break
          case 'out':
            where = { from: address }

            countQueryBuilder
              .where('"from" = :from')
              .setParameter('from', address)

            break
          default:
            where = [{ from: address }, { to: address }]

            countQueryBuilder
              .where('"to" = :to or "from" = :from')
              .setParameters({ to: address, from: address })

            break
        }


        const { count } = await countQueryBuilder.cache(true).getRawOne() as { count: number }

        if (count === 0) return [[], count]

        const txs = await txn.find(TransactionEntity, {
          select: ['hash'],
          where,
          skip: offset,
          take: limit,
          cache: true
        })

        const summaries = await this.findSummariesByHash(txs.map(t => t.hash), txn)
        return [summaries, count]
      }
    )

  }

  async findSummaries(offset: number, limit: number, fromBlock?: BigNumber): Promise<[TransactionSummary[], number]> {

    const where = fromBlock ? { blockNumber: LessThanOrEqual(fromBlock) } : {}

    return this.entityManager.transaction(
      'READ COMMITTED',
      async (entityManager): Promise<[TransactionSummary[], number]> => {

        let [{ count: totalCount }] = await entityManager.find(RowCount, {
          select: ['count'],
          where: {
            relation: 'transaction'
          },
          cache: true
        })

        if (totalCount === 0) return [[], totalCount]

        if (fromBlock) {
          // we count all txs in blocks greater than the from block and deduct from total
          // this is much faster way of determining the count

          const { count: filterCount } = await entityManager.createQueryBuilder()
            .select('count(hash)', 'count')
            .from(TransactionEntity, 't')
            .where({ blockNumber: MoreThan(fromBlock) })
            .cache(true)
            .getRawOne() as { count: number }

          totalCount = totalCount - filterCount

        }

        const txs = await entityManager.find(TransactionEntity, {
          select: ['blockNumber', 'blockHash', 'hash', 'transactionIndex', 'timestamp', 'gasPrice', 'from', 'to', 'creates', 'value'],
          where,
          order: {
            blockNumber: 'DESC',
            transactionIndex: 'DESC'
          },
          skip: offset,
          take: limit,
          cache: true
        })

        const receipts = await this.receiptService
          .findByTxHash(entityManager, txs.map(tx => tx.hash), ['transactionHash', 'gasUsed'])

        const receiptsByTxHash = receipts
          .reduceRight(
            (memo, next) => memo.set(next.transactionHash, next),
            new Map<string, TransactionReceiptEntity>()
          )

        const txsWithReceipts = txs.map(tx => {
          const receipt = receiptsByTxHash.get(tx.hash)
          return new TransactionEntity({ ...tx, receipt })
        })
        return this.summarise(entityManager, txsWithReceipts, totalCount)
      }
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
          transactionIndex: 'DESC'
        },
        cache: true
      })

    const receipts = await this.receiptService
      .findByTxHash(manager, txs.map(tx => tx.hash), ['transactionHash', 'gasUsed'])

    const receiptsByTxHash = receipts
      .reduceRight(
        (memo, next) => memo.set(next.transactionHash, next),
        new Map<string, TransactionReceiptEntity>()
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

      // Root trace
      if (!txStatus) {
        throw new PartialReadException(`Root trace missing, tx hash = ${tx.hash}`)
      }
      // Receipt
      if (!receipt) {
        throw new PartialReadException(`Receipt missing, tx hash = ${tx.hash}`)
      }

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
        fee: tx.gasPrice.multipliedBy(receipt.gasUsed),
        successful: txStatus.successful,
        timestamp: tx.timestamp
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
