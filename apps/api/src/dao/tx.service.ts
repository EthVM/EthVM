import { TransactionEntity } from '@app/orm/entities/transaction.entity'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import BigNumber from 'bignumber.js'
import { In, LessThanOrEqual, Repository } from 'typeorm'
import { ReceiptService } from './receipt.service'
import { TraceService, TransactionStatus } from './trace.service'
import { TransactionSummary } from '@app/graphql/schema'
import { ContractService } from '@app/dao/contract.service'
import { ContractEntity } from '@app/orm/entities/contract.entity'
import { TransactionReceiptEntity } from '@app/orm/entities/transaction-receipt.entity'
import { PartialReadException } from '@app/shared/errors/partial-read-exception'

@Injectable()
export class TxService {

  constructor(
    private readonly receiptService: ReceiptService,
    private readonly traceService: TraceService,
    @Inject(forwardRef(() => ContractService))
    private readonly contractService: ContractService,
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
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
    if (!(tx.traces && tx.traces.length)) {
      throw new PartialReadException(`Traces not found, tx hash = ${tx.hash}`)
    }

    return tx
  }

  async findByHash(...hashes: string[]): Promise<TransactionEntity[]> {
    const txs = await this.transactionRepository.find({ where: { hash: In(hashes) }, relations: ['receipt'] })
    return this.findAndMapTraces(txs)
  }

  async findSummariesByBlockNumber(number: number, offset: number, limit: number): Promise<[TransactionSummary[], number]> {

    const [txs, count] = await this.transactionRepository
      .findAndCount({
        where: { blockNumber: number },
        select: ['hash'],
        skip: offset,
        take: limit,
      })

    if (count === 0) return [[], count]

    const summaries = await this.findSummariesByHash(txs.map(t => t.hash))
    return [summaries, count]
  }

  async findSummariesByBlockHash(hash: string, offset: number, limit: number): Promise<[TransactionSummary[], number]> {

    const [txs, count] = await this.transactionRepository
      .findAndCount({
        where: { blockHash: hash },
        select: ['hash'],
        skip: offset,
        take: limit,
      })

    if (count === 0) return [[], count]

    const summaries = await this.findSummariesByHash(txs.map(t => t.hash))
    return [summaries, count]
  }

  async findSummariesByAddress(address: string, filter?: string, offset: number = 0, limit: number = 20): Promise<[TransactionSummary[], number]> {
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

    const [txs, count] = await this.transactionRepository
      .findAndCount({
        where,
        select: ['hash'],
        skip: offset,
        take: limit,
      })

    if (count === 0) return [[], count]

    const summaries = await this.findSummariesByHash(txs.map(t => t.hash))
    return [summaries, count]
  }

  async findSummaries(offset: number, limit: number, fromBlock?: BigNumber): Promise<[TransactionSummary[], number]> {

    const { transactionRepository } = this

    const where = fromBlock ? { blockNumber: LessThanOrEqual(fromBlock) } : {}

    const [txs, count] = await transactionRepository
      .findAndCount({
        select: ['blockNumber', 'blockHash', 'hash', 'transactionIndex', 'timestamp', 'gasPrice', 'from', 'to', 'creates', 'value'],
        where,
        order: {
          blockNumber: 'DESC',
          transactionIndex: 'DESC',
        },
        skip: offset,
        take: limit,
      })

    if (count === 0) {
      return [[], 0]
    }

    const receipts = await this.receiptService
      .findByTxHash(txs.map(tx => tx.hash), ['transactionHash', 'gasUsed'])

    const receiptsByTxHash = receipts
      .reduceRight(
        (memo, next) => memo.set(next.transactionHash, next),
        new Map<string, TransactionReceiptEntity>(),
      )

    const txsWithReceipts = txs.map(tx => {
      const receipt = receiptsByTxHash.get(tx.hash)
      return new TransactionEntity({ ...tx, receipt })
    })
    return this.summarise(txsWithReceipts, count)
  }

  async findSummariesByHash(hashes: string[]): Promise<TransactionSummary[]> {

    const { transactionRepository } = this

    const txs = await transactionRepository
      .find({
        select: ['blockNumber', 'blockHash', 'hash', 'transactionIndex', 'timestamp', 'gasPrice', 'from', 'to', 'creates', 'value'],
        where: { hash: In(hashes) },
        order: {
          blockNumber: 'DESC',
          transactionIndex: 'DESC',
        },
      })

    const receipts = await this.receiptService
      .findByTxHash(txs.map(tx => tx.hash), ['transactionHash', 'gasUsed'])

    const receiptsByTxHash = receipts
      .reduceRight(
        (memo, next) => memo.set(next.transactionHash, next),
        new Map<string, TransactionReceiptEntity>(),
      )

    const txsWithReceipts = txs.map(tx => {
      const receipt = receiptsByTxHash.get(tx.hash)
      return new TransactionEntity({ ...tx, receipt })
    })

    const [summaries, count] = await this.summarise(txsWithReceipts, txsWithReceipts.length)
    return summaries
  }

  private async summarise(txs: TransactionEntity[], count: number): Promise<[TransactionSummary[], number]> {

    if (!txs.length) return [[], 0]

    const { traceService, contractService } = this

    const txHashes: string[] = []
    const contractAddresses: string[] = []

    txs.forEach(tx => {
      txHashes.push(tx.hash)
      if (tx.creates && tx.creates !== '') contractAddresses.push(tx.creates)
    })

    const txStatusesPromise = traceService.findTxStatusByTxHash(txHashes)
    const contractsPromise = contractService.findAllByAddress(contractAddresses)

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
        timestamp: tx.timestamp,
      } as TransactionSummary
    })

    return [summaries, count]
  }

  private async findAndMapTraces(txs: TransactionEntity[]): Promise<TransactionEntity[]> {

    const traces = await this.traceService.findByTxHash(txs.map(tx => tx.hash))

    const txsByHash = txs.reduce((memo, next) => {
      next.traces = []
      memo.set(next.hash, next)
      return memo
    }, new Map<string, TransactionEntity>())

    traces.forEach(trace => {
      const tx = txsByHash.get(trace.transactionHash)!
      tx.traces!.push(trace)
    })

    return Array.from(txsByHash.values())
  }

}
