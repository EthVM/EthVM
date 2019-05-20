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
import { PartialReadException } from '@app/shared/errors/partial-read-exception'
import { setEquals } from '@app/shared/utils'
import { ConfigService } from '@app/shared/config.service'

@Injectable()
export class BlockService {
  constructor(
    @InjectRepository(BlockHeaderEntity) private readonly blockHeaderRepository: Repository<BlockHeaderEntity>,
    @InjectRepository(TransactionEntity) private readonly transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(TransactionTraceEntity) private readonly transactionTraceRepository: Repository<TransactionTraceEntity>,
    @InjectRepository(UncleEntity) private readonly uncleRepository: Repository<UncleEntity>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly traceService: TraceService,
    private readonly configService: ConfigService
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

  async findSummariesByAuthor(author: string, offset: number = 0, limit: number = 20): Promise<[BlockSummary[], number]> {

    const [headersWithRewards, count] = await this.blockHeaderRepository
      .findAndCount({
        select: ['number', 'hash', 'author', 'transactionHashes', 'uncleHashes', 'difficulty', 'timestamp'],
        where: { author },
        relations: ['rewards'],
        order: { number: 'DESC' },
        skip: offset,
        take: limit
      })

    if (count === 0) return [[], count]

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

    const txHashesByBlock = new Map<string, Set<string>>()

    txStatuses.forEach(status => {

      const { blockHash, transactionHash, successful } = status

      // keep track of returned tx hashes for verification later
      let txHashes = txHashesByBlock.get(blockHash)
      if (!txHashes) {
        txHashes = new Set<string>()
        txHashesByBlock.set(blockHash, txHashes)
      }
      txHashes.add(transactionHash)

      // add to successful or failed count
      if (successful) {
        const current = successfulCountByBlock.get(blockHash) || 0
        successfulCountByBlock.set(blockHash, current + 1)
      } else {
        const current = failedCountByBlock.get(blockHash) || 0
        failedCountByBlock.set(blockHash, current + 1)
      }
    })

    return headersWithRewards.map(header => {

      const { instaMining } = this.configService
      const { number, hash, author, uncleHashes, transactionHashes, difficulty, timestamp } = header

      // partial read checks

      // look for block reward
      if (!instaMining && !(header.rewards && header.rewards.length)) {
        throw new PartialReadException(`Rewards missing, block hash = ${header.hash}`)
      }

      // check transaction hashes
      const expectedTxHashes = new Set<string>(JSON.parse(transactionHashes))
      const retrievedTxHashes = txHashesByBlock.get(hash) || new Set<string>()

      if (!setEquals(expectedTxHashes, retrievedTxHashes)) {
        throw new PartialReadException(`Transactions did not match, block hash = ${header.hash}`)
      }

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

  async findBlockByNumber(number: BigNumber): Promise<BlockHeaderEntity | undefined> {
    return this.blockHeaderRepository.findOne({
      where: { number },
      relations: ['uncles', 'rewards']
    })
  }

  async findTotalNumberOfBlocks(): Promise<BigNumber> {
    return new BigNumber(await this.blockHeaderRepository.count())
  }
}
