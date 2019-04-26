import { TransactionEntity } from '@app/orm/entities/transaction.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BigNumber from 'bignumber.js';
import { FindManyOptions, In, LessThanOrEqual, Repository } from 'typeorm';
import { ReceiptService } from './receipt.service';
import { TraceService } from './trace.service';

@Injectable()
export class TxService {

  constructor(
    private readonly receiptService: ReceiptService,
    private readonly traceService: TraceService,
    @InjectRepository(TransactionEntity) private readonly transactionRepository: Repository<TransactionEntity>,
  ) { }

  async findOneByHash(hash: string): Promise<TransactionEntity | undefined> {
    const txs = await this.findByHash(hash)
    return txs.length === 1 ? txs[0] : undefined
  }

  async findByHash(...hashes: string[]): Promise<TransactionEntity[]> {
    const txs = await this.transactionRepository.find({ where: { hash: In(hashes) }, relations: ['receipt'] })
    return this.findAndMapTraces(txs)
  }

  async find(take: number = 10, page: number = 0, fromBlock: BigNumber = new BigNumber(-1)): Promise<TransactionEntity[]> {

    const skip = page * take
    const where = fromBlock.toNumber() !== -1 ? { blockNumber: LessThanOrEqual(fromBlock.toNumber()) } : {}

    const findOptions: FindManyOptions = {
      where,
      order: { blockNumber: 'DESC', transactionIndex: 'DESC', timestamp: 'DESC' },
      take,
      skip,
      relations: ['receipt']
    }

    let txs = await this.transactionRepository.find(findOptions)
    if (!txs.length) return []

    return this.findAndMapTraces(txs)
  }

  async findByAddress(address: string, filter?: string, take: number = 10, page: number = 0): Promise<TransactionEntity[]> {
    const skip = page * take
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
    const txs = await this.transactionRepository.find({ where, take, skip, relations: ['receipt'] })

    return txs.length === 0 ? [] : this.findAndMapTraces(txs)
  }

  private async findAndMapTraces(txs: TransactionEntity[]): Promise<TransactionEntity[]> {

    const traces = await this.traceService.findByTxHash.apply(txs.map(tx => tx.hash))

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

  async countTransactions(): Promise<number> {
    return this.transactionRepository.count()
  }
}
