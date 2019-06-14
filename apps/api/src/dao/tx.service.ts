import { TransactionEntity } from '@app/orm/entities/transaction.entity'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import BigNumber from 'bignumber.js'
import { EntityManager, FindManyOptions, In, LessThanOrEqual, MoreThan, Repository } from 'typeorm'
import { ReceiptService } from './receipt.service'
import { TraceService } from './trace.service'
import { FilterEnum, Order, TransactionSummary, TxSortField } from '@app/graphql/schema'
import { ContractService } from '@app/dao/contract.service'
import { ContractEntity } from '@app/orm/entities/contract.entity'
import { PartialReadException } from '@app/shared/errors/partial-read-exception'
import { RowCount } from '@app/orm/entities/row-counts.entity'
import { EthService } from '@app/shared/eth.service'
import { search } from '../../../explorer/src/core/api/apollo/types/search'

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
    private readonly entityManager: EntityManager,
    private readonly ethService: EthService,
  ) {
  }

  async findOneByHash(hash: string): Promise<TransactionEntity | undefined> {
    const txs = await this.findByHash(hash)

    if (txs.length !== 1) return undefined

    const tx = txs[0]

    // Partial read checks

    // Receipt
    if (!tx.receipt) {
      throw new PartialReadException(`Receipt not found, tx hash = ${tx.transactionHash}`)
    }

    // Partial read check
    if (!tx.trace) {
      throw new PartialReadException(`Traces not found, tx hash = ${tx.transactionHash}`)
    }

    return tx
  }

  async findByHash(...hashes: string[]): Promise<TransactionEntity[]> {
    const txs = await this.transactionRepository.find({
      where: { transactionHash: In(hashes) },
      relations: ['receipt'],
      cache: true,
    })
    return this.findAndMapTraces(txs)
  }

  async findSummariesByBlockNumber(number: BigNumber, offset: number, limit: number): Promise<[TransactionSummary[], number]> {

    return this.entityManager.transaction(
      'READ COMMITTED',
      async (txn): Promise<[TransactionSummary[], number]> => {

        const where = {blockNumber: number}

        const { count } = await txn
          .createQueryBuilder()
          .select('COUNT(transaction_hash)', 'count')
          .from(TransactionEntity, 't')
          .where('block_number = :number')
          .cache(true)
          .setParameters({ number })
          .getRawOne() as { count: number }

        if (count === 0) return [[], count]

        const findOptions: FindManyOptions = {
          select: ['transactionHash'],
          where,
          order: {
            blockNumber: 'DESC',
            transactionIndex: 'DESC',
          },
          skip: offset,
          take: limit,
          cache: true
        }

        const txs = await txn.find(TransactionEntity, findOptions)

        const summaries = await this.findSummariesByHash(txs.map(t => t.transactionHash), txn)
        return [summaries, count]
      },
    )

  }

  async findSummariesByBlockHash(hash: string, offset: number, limit: number): Promise<[TransactionSummary[], number]> {

    return this.entityManager.transaction(
      'READ COMMITTED',
      async (txn): Promise<[TransactionSummary[], number]> => {

        const where = {blockHash: hash}

        const { count } = await txn
          .createQueryBuilder()
          .select('COUNT(transaction_hash)', 'count')
          .from(TransactionEntity, 't')
          .where('block_hash = :hash')
          .cache(true)
          .setParameters({ hash })
          .getRawOne() as { count: number }

        if (count === 0) return [[], count]

        const txs = await txn.find(TransactionEntity, {
          select: ['transactionHash'],
          where,
          skip: offset,
          take: limit,
          order: {
            blockNumber: 'DESC',
            transactionIndex: 'DESC',
          },
          cache: true,
        } as FindManyOptions)

        const summaries = await this.findSummariesByHash(txs.map(t => t.transactionHash), txn)
        return [summaries, count]
      },
    )

  }

  async findSummariesByAddress(
    address: string,
    filter?: FilterEnum,
    searchHash?: string,
    sortField: TxSortField = TxSortField.timestamp,
    order: Order = Order.desc,
    offset: number = 0,
    limit: number = 20,
  ): Promise<[TransactionSummary[], number]> {

    return this.entityManager.transaction(
      'READ COMMITTED',
      async (txn): Promise<[TransactionSummary[], number]> => {

        const countQueryBuilder = txn.createQueryBuilder()
          .select('count(transaction_hash)', 'count')
          .from(TransactionEntity, 't')

        let where

        const counterpartAddress = !!searchHash && this.ethService.isValidAddress(searchHash) ? searchHash : null

    switch (filter) {
      case FilterEnum.in:
        const to = address;

        if (counterpartAddress) {
          const from = counterpartAddress
          where = { to, from }

          countQueryBuilder
            .where('"to" = :to')
            .andWhere('"from" = :from')
            .setParameters({ to, from })

        } else if (searchHash) {
          const transactionHash = searchHash
          where = { to, transactionHash }

          countQueryBuilder
            .where('"to" = :to')
            .andWhere('"transaction_hash" = :transactionHash')
            .setParameters({ to, transactionHash })

        } else {
          where = {to: address}

          countQueryBuilder
            .where('"to" = :to')
            .setParameters({ to })
        }
        break

      case FilterEnum.out:
        const from = address

        if (counterpartAddress) {
          const to = counterpartAddress
          where = { from, to }

          countQueryBuilder
            .where('"from" = :from')
            .andWhere('"to" = :to')
            .setParameters({ from, to })

        } else if (searchHash) {
          const transactionHash = searchHash
          where = { from, transactionHash }

          countQueryBuilder
            .where('"from" = :from')
            .andWhere('"transactionHash" = :transactionHash')
            .setParameters({ from, transactionHash })

        } else {
          where = { from }
          countQueryBuilder
            .where('"from" = :from')
            .setParameters({ from })
        }
        break
      default:

        if (counterpartAddress) {
          where = [{from: address, to: counterpartAddress}, {to: address, from: counterpartAddress}]

          countQueryBuilder
            .where(new Brackets(qb => {
              qb.where('"from" = :address')
              qb.andWhere('"to" = :counterpartAddress')
            }))
            .orWhere(new Brackets(qb => {
              qb.where('"from" = :counterpartAddress')
              qb.andWhere('"to" = :address')
            }))
            .setParameters({ address, counterpartAddress })
        } else if (searchHash) {
          where = [{from: address, transactionHash: searchHash}, {to: address, transactionHash: searchHash}]

          countQueryBuilder
            .where(new Brackets(qb => {
              qb.where('"from" = :address')
              qb.andWhere('"transaction_hash" = :transactionHash')
            }))
            .orWhere(new Brackets(qb => {
              qb.where('"transaction_hash" = :transactionHash')
              qb.andWhere('"to" = :address')
            }))
            .setParameters({ address, transactionHash: searchHash })
        } else {
          where = [{from: address}, {to: address}]

          countQueryBuilder
            .where('"from" = :address')
            .orWhere('"to" = :address')
            .setParameters({ address })
        }
        break
    }

        const { count } = await countQueryBuilder.cache(true).getRawOne() as { count: number }

        if (count === 0) return [[], count]

        const txs = await txn.find(TransactionEntity, {
          select: ['transactionHash'],
          where,
          skip: offset,
          take: limit,
          cache: true,
        })

        const summaries = await this.findSummariesByHash(txs.map(t => t.transactionHash), txn, sortField, order)
        return [summaries, count]
      },
    )

  }

  async findSummaries(offset: number, limit: number, fromBlock?: BigNumber): Promise<[TransactionSummary[], number]> {

    const where = fromBlock ? {blockNumber: LessThanOrEqual(fromBlock)} : {}

    return this.entityManager.transaction(
      'READ COMMITTED',
      async (entityManager): Promise<[TransactionSummary[], number]> => {

        let [{count: totalCount}] = await entityManager.find(RowCount, {
          select: ['count'],
          where: {
            relation: 'transaction',
          },
          cache: true,
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
          select: [
            'blockNumber',
            'blockHash',
            'transactionHash',
            'transactionIndex',
            'timestamp',
            'gasPrice',
            'from',
            'to',
            'creates',
            'value',
            'successful',
            'fee',
          ],
          where,
          order: {
            blockNumber: 'DESC',
            transactionIndex: 'DESC',
          },
          skip: offset,
          take: limit,
          cache: true
        } as FindManyOptions)

        return this.summarise(entityManager, txs, totalCount)
      },
    )

  }

  async findSummariesByHash(
    hashes: string[],
    entityManager: EntityManager = this.entityManager,
    sortField?: TxSortField,
    order: Order = Order.desc,
  ): Promise<TransactionSummary[]> {

    if (!(hashes && hashes.length)) return []

    const manager = entityManager || this.entityManager

    const orderObject = sortField ?
      {[sortField]: order.toUpperCase()} :
      {
        blockNumber: 'DESC',
        transactionIndex: 'DESC',
      }

    const txs = await manager
      .find(TransactionEntity, {
        select: [
          'blockNumber',
          'blockHash',
          'transactionHash',
          'transactionIndex',
          'timestamp',
          'gasPrice',
          'from',
          'to',
          'creates',
          'value',
          'successful',
          'fee',
        ],
        where: {transactionHash: In(hashes)},
        order: orderObject,
        cache: true,
      } as FindManyOptions)

    const [summaries, count] = await this.summarise(manager, txs, txs.length)
    return summaries
  }

  private async summarise(entityManager: EntityManager, txs: TransactionEntity[], count: number): Promise<[TransactionSummary[], number]> {

    if (!txs.length) return [[], 0]

    const {contractService} = this

    const contractAddresses: string[] = []

    txs.forEach(tx => {
      if (tx.creates && tx.creates !== '') contractAddresses.push(tx.creates)
    })

    const contractsPromise = contractService.findAllByAddress(entityManager, contractAddresses)

    const contracts = await contractsPromise

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

      // Fee
      if (!tx.fee) {
        throw new PartialReadException(`Fee missing, tx hash = ${tx.transactionHash}`)
      }

      // Status
      if (tx.successful === null) {
        throw new PartialReadException(`Status missing, tx hash = ${tx.transactionHash}`)
      }

      return {
        transactionHash: tx.transactionHash,
        blockNumber: tx.blockNumber,
        transactionIndex: tx.transactionIndex,
        from: tx.from,
        to: tx.to,
        creates: tx.creates,
        contractName,
        contractSymbol,
        value: tx.value,
        fee: tx.fee,
        successful: tx.successful,
        timestamp: tx.timestamp,
      } as TransactionSummary
    })

    return [summaries, count]
  }

  private async findAndMapTraces(txs: TransactionEntity[]): Promise<TransactionEntity[]> {

    const traces = await this.traceService.findByTxHash(txs.map(tx => tx.transactionHash))

    const txsByHash = txs.reduce((memo, next) => {
      memo.set(next.transactionHash, next)
      return memo
    }, new Map<string, TransactionEntity>())

    traces.forEach(trace => {
      const tx = txsByHash.get(trace.transactionHash!)!
      tx.trace = trace
    })

    return Array.from(txsByHash.values())
  }

}
