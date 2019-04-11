import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { LessThanOrEqual, Repository } from 'typeorm'
import { BlockHeaderEntity } from '@app/orm/entities/block-header.entity'
import { TransactionEntity } from '@app/orm/entities/transaction.entity'
import { TransactionTraceEntity } from '@app/orm/entities/transaction-trace.entity'

@Injectable()
export class BlockService {
  constructor(
    @InjectRepository(BlockHeaderEntity) private readonly blockHeaderRepository: Repository<BlockHeaderEntity>,
    @InjectRepository(TransactionEntity) private readonly transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(TransactionTraceEntity) private readonly transactionTraceRepository: Repository<TransactionTraceEntity>
  ) {}

  async findBlockByHash(hash: string): Promise<BlockHeaderEntity | undefined> {
    const blockHeader = await this.blockHeaderRepository.findOne({ where: { hash }})
    if (!blockHeader) return undefined

    blockHeader.txs = await this.findTxsByBlockHash(hash)
    return blockHeader
  }

  async findBlocks(limit: number = 10, page: number = 0, fromBlock: number = -1): Promise<BlockHeaderEntity[]> {
    const where = fromBlock !== -1 ? {  number: LessThanOrEqual(fromBlock)  } : {}
    const skip = page * limit
    return this.blockHeaderRepository.find({ where, take: limit, skip, order: {number: 'DESC'}, relations: ['txs'] })
  }

  async findBlockByNumber(number: number): Promise<BlockHeaderEntity | undefined> {

    const header = await this.blockHeaderRepository.findOne({ where: { number }})
    if(!header) return undefined

    header.txs = await this.findTxsByBlockHash(header.hash)
    return header
  }

  private async findTxsByBlockHash(blockHash: string): Promise<TransactionEntity[]> {

    const txs = await this.transactionRepository.find({ where: { blockHash }, relations: ['receipt']})
    const traces = await this.transactionTraceRepository.find({ where: { blockHash }})

    const txsByHash = txs.reduce((memo, next) => {
      next.traces = []
      memo[next.hash] = next
      return memo
    }, {})

    traces.forEach(trace => {
      txsByHash[trace.transactionHash].traces.push(trace)
    })

    return txs

  }

  async findMinedBlocksByAddress(address: string, limit: number = 10, page: number = 0): Promise<BlockHeaderEntity[]> {
    // TODO check order by
    const skip = page * limit
    return this.blockHeaderRepository.find({ where: { author: address }, take: limit, skip })
  }

  async findTotalNumberOfBlocks(): Promise<number> {
    return this.blockHeaderRepository.count()
  }
}
