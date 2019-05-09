import { BlockSummary } from '@app/graphql/schema'
import { BlockHeaderEntity } from '@app/orm/entities/block-header.entity'
import { TransactionTraceEntity } from '@app/orm/entities/transaction-trace.entity'
import { TransactionEntity } from '@app/orm/entities/transaction.entity'
import { UncleEntity } from '@app/orm/entities/uncle.entity'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import BigNumber from 'bignumber.js'
import { EntityManager, In, LessThan, LessThanOrEqual, Repository } from 'typeorm'
import { TraceService } from './trace.service'

@Injectable()
export class BlockService {
  constructor(
    @InjectRepository(BlockHeaderEntity) private readonly blockHeaderRepository: Repository<BlockHeaderEntity>,
    @InjectRepository(TransactionEntity) private readonly transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(TransactionTraceEntity) private readonly transactionTraceRepository: Repository<TransactionTraceEntity>,
    @InjectRepository(UncleEntity) private readonly uncleRepository: Repository<UncleEntity>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly traceService: TraceService
  ) {
  }

  async calculateHashRate(): Promise<BigNumber | null> {

    // use up to the last 20 blocks which equates to about 5 mins at the current production rate
    const blocks = await this.blockHeaderRepository
      .find({
        select: ['number', 'difficulty', 'blockTime'],
        order: { number: 'DESC' },
        take: 20
      })

    if (blocks.length === 0) return null

    const avgBlockTime = blocks
      .map(b => b.blockTime)
      .reduceRight((memo, next) => memo.plus(next || 0), new BigNumber(0))
      .dividedBy(blocks.length)

    return blocks[0].difficulty
      .dividedBy(avgBlockTime)
      .integerValue()
  }

  async findSummaries(offset: number, limit: number, fromBlock?: BigNumber): Promise<[BlockSummary[], number]> {

    const where = fromBlock ? { number: LessThanOrEqual(fromBlock) } : {}

    const [headersWithRewards, count] = await this.blockHeaderRepository
      .findAndCount({
        select: ['number', 'hash', 'author', 'transactionHashes', 'uncleHashes', 'difficulty', 'timestamp'],
        where,
        relations: ['rewards'],
        order: { number: 'DESC' },
        skip: offset,
        take: limit
      })

    return [
      await this.summarise(headersWithRewards),
      count
    ]

  }

  async findSummariesByBlockHash(blockHashes: string[]): Promise<BlockSummary[]> {

    const headersWithRewards = await this.blockHeaderRepository.find({
      select: ['number', 'hash', 'author', 'transactionHashes', 'uncleHashes', 'difficulty', 'timestamp'],
      where: { hash: In(blockHashes) },
      relations: ['rewards'],
      order: { number: 'DESC' }
    })

    return this.summarise(headersWithRewards)

  }

  private async summarise(headersWithRewards: BlockHeaderEntity[]): Promise<BlockSummary[]> {

    const blockHashes = headersWithRewards.map(h => h.hash)
    const txStatuses = await this.traceService.findTxStatusByBlockHash(blockHashes)

    const successfulCountByBlock = new Map<string, number>()
    const failedCountByBlock = new Map<string, number>()

    txStatuses.forEach(status => {
      const { blockHash, successful } = status
      if (successful) {
        const current = successfulCountByBlock.get(blockHash) || 0
        successfulCountByBlock.set(blockHash, current + 1)
      } else {
        const current = failedCountByBlock.get(blockHash) || 0
        failedCountByBlock.set(blockHash, current + 1)
      }
    })

    return headersWithRewards.map(header => {

      const { number, hash, author, uncleHashes, transactionHashes, difficulty, timestamp } = header

      const rewardsByBlock = new Map<string, BigNumber>()

      header.rewards!
        .filter(r => r.deltaType === 'BLOCK_REWARD')
        .map(r => rewardsByBlock.set(r.blockHash, r.amount))

      return {
        number, hash, author, difficulty, timestamp,
        uncleHashes: JSON.parse(uncleHashes),
        transactionHashes: JSON.parse(transactionHashes),
        numTxs: transactionHashes.length,
        numSuccessfulTxs: successfulCountByBlock.get(hash) || 0,
        numFailedTxs: failedCountByBlock.get(hash) || 0,
        reward: rewardsByBlock.get(hash) || 0
      } as BlockSummary

    })

  }

  async findBlockByHash(hash: string): Promise<BlockHeaderEntity | undefined> {
    return this.blockHeaderRepository.findOne({ where: { hash }, relations: ['uncles', 'rewards'] })
  }

  async findBlocks(limit: number = 10, page: number = 0, fromBlock?: BigNumber): Promise<BlockHeaderEntity[]> {
    const where = fromBlock ? { number: LessThanOrEqual(fromBlock) } : {}
    const skip = page * limit
    return await this.blockHeaderRepository.find({
      where,
      take: limit,
      skip,
      order: { number: 'DESC' },
      relations: ['rewards']
    })
  }

  private async findAndMapTxsAndUncles(blocks: BlockHeaderEntity[]): Promise<BlockHeaderEntity[]> {

    const blockHashes = blocks.map(b => b.hash)
    const txs = await this.transactionRepository.find({ where: { blockHash: In(blockHashes) }, relations: ['receipt'] })
    const uncles = await this.uncleRepository.find({ where: { nephewHash: In(blockHashes) } })

    const blocksByHash = blocks.reduce((memo, next) => {
      next.txs = []
      next.uncles = []
      memo[next.hash] = next
      return memo
    }, {})

    txs.forEach(tx => {
      blocksByHash[tx.blockHash].txs.push(tx)
    })
    uncles.forEach(uncle => {
      blocksByHash[uncle.nephewHash].uncles.push(uncle)
    })

    return Object.values(blocksByHash)

  }

  async findBlockByNumber(number: BigNumber): Promise<BlockHeaderEntity | undefined> {
    return this.blockHeaderRepository.findOne({
      where: { number: number.toString() },
      relations: ['uncles', 'rewards']
    })
  }

  async findMinedBlocksByAddress(address: string, limit: number = 10, page: number = 0): Promise<[BlockHeaderEntity[], number]> {
    const skip = page * limit
    const result = await this.blockHeaderRepository.findAndCount({
      where: { author: address },
      take: limit,
      skip,
      order: { number: 'DESC' },
      relations: ['rewards']
    })
    result[0] = await this.findAndMapTxsAndUncles(result[0])
    return result
  }

  async findTotalNumberOfBlocks(): Promise<BigNumber> {
    return new BigNumber(await this.blockHeaderRepository.count())
  }
}
