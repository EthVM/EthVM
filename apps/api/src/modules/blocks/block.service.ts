import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, LessThanOrEqual, Repository } from 'typeorm'
import { BlockHeaderEntity } from '@app/orm/entities/block-header.entity'
import { TransactionEntity } from '@app/orm/entities/transaction.entity'
import { TransactionTraceEntity } from '@app/orm/entities/transaction-trace.entity'
import { UncleEntity } from '@app/orm/entities/uncle.entity'

@Injectable()
export class BlockService {
  constructor(
    @InjectRepository(BlockHeaderEntity) private readonly blockHeaderRepository: Repository<BlockHeaderEntity>,
    @InjectRepository(TransactionEntity) private readonly transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(TransactionTraceEntity) private readonly transactionTraceRepository: Repository<TransactionTraceEntity>,
    @InjectRepository(UncleEntity) private readonly uncleRepository: Repository<UncleEntity>,
  ) {}

  async findBlockByHash(hash: string): Promise<BlockHeaderEntity | undefined> {
    const blockHeader = await this.blockHeaderRepository.findOne({ where: { hash }, relations: ['uncles', 'rewards'] })
    if (!blockHeader) return undefined

    blockHeader.txs = await this.findTxsByBlockHash(hash)
    return blockHeader
  }

  async findBlocks(limit: number = 10, page: number = 0, fromBlock: number = -1): Promise<BlockHeaderEntity[]> {
    const where = fromBlock !== -1 ? {  number: LessThanOrEqual(fromBlock)  } : {}
    const skip = page * limit
    const blocks = await this.blockHeaderRepository.find({ where, take: limit, skip, order: {number: 'DESC'}, relations: ['rewards']})
    return this.findAndMapTxsAndUncles(blocks)
  }

  private async findAndMapTxsAndUncles(blocks: BlockHeaderEntity[]): Promise<BlockHeaderEntity[]> {

    const blockHashes = blocks.map(b => b.hash)
    const txs = await this.transactionRepository.find({ where: { blockHash: In(blockHashes) }, relations: ['receipt'] })
    const uncles = await this.uncleRepository.find({ where: { nephewHash: In(blockHashes) }})

    const blocksByHash = blocks.reduce((memo, next) => {
      next.txs = []
      next.uncles = []
      memo[next.hash] = next
      return memo
    }, {})

    txs.forEach(tx => { blocksByHash[tx.blockHash].txs.push(tx) })
    uncles.forEach(uncle => { blocksByHash[uncle.nephewHash].uncles.push(uncle) })

    return Object.values(blocksByHash)

  }

  async findBlockByNumber(number: number): Promise<BlockHeaderEntity | undefined> {

    const header = await this.blockHeaderRepository.findOne({ where: { number }, relations: ['uncles', 'rewards'] })
    if (!header) return undefined

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
    const skip = page * limit
    const blocks = await this.blockHeaderRepository.find({
      where: { author: address },
      take: limit,
      skip,
      order: { number: 'DESC' },
      relations: ['rewards'],
    })
    return this.findAndMapTxsAndUncles(blocks)
  }

  async findTotalNumberOfBlocks(): Promise<number> {
    return this.blockHeaderRepository.count()
  }
}
