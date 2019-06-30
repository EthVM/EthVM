import { BlockSummary } from '@app/graphql/schema'
import { BlockHeaderEntity } from '@app/orm/entities/block-header.entity'
import { TransactionTraceEntity } from '@app/orm/entities/transaction-trace.entity'
import { TransactionEntity } from '@app/orm/entities/transaction.entity'
import { UncleEntity } from '@app/orm/entities/uncle.entity'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import BigNumber from 'bignumber.js'
import { EntityManager, FindConditions, In, LessThanOrEqual, ObjectLiteral, Repository } from 'typeorm'
import { TraceService } from './trace.service'
import { PartialReadException } from '@app/shared/errors/partial-read-exception'
import { setEquals } from '@app/shared/utils'
import { ConfigService } from '@app/shared/config.service'
import { CanonicalCount } from '@app/orm/entities/row-counts.entity'
import { DbConnection } from '@app/orm/config'

@Injectable()
export class BlockService {
  constructor(
    @InjectRepository(BlockHeaderEntity, DbConnection.Principal) private readonly blockHeaderRepository: Repository<BlockHeaderEntity>,
    @InjectRepository(TransactionEntity, DbConnection.Principal) private readonly transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(TransactionTraceEntity, DbConnection.Principal) private readonly transactionTraceRepository: Repository<TransactionTraceEntity>,
    @InjectRepository(UncleEntity, DbConnection.Principal) private readonly uncleRepository: Repository<UncleEntity>,
    @InjectEntityManager(DbConnection.Principal) private readonly entityManager: EntityManager,
    private readonly traceService: TraceService,
    private readonly configService: ConfigService,
  ) {
  }

  async calculateHashRate(): Promise<BigNumber | null> {

    // use up to the last 20 blocks which equates to about 5 mins at the current production rate
    const blocks = await this.blockHeaderRepository
      .find({
        select: ['number', 'difficulty', 'blockTime'],
        order: { number: 'DESC' },
        take: 20,
        cache: true,
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

    return this.entityManager
      .transaction(
        'READ COMMITTED',
        async (txn): Promise<[BlockSummary[], number]> => {

          const where = fromBlock ? { number: LessThanOrEqual(fromBlock) } : {}

          const [{ count }] = await txn.find(CanonicalCount, {
            select: ['count'],
            where: {
              entity: 'block_header',
            },
            cache: true,
          })

          const headersWithRewards = await txn.find(BlockHeaderEntity, {
            select: ['number', 'hash', 'author', 'transactionHashes', 'uncleHashes', 'difficulty', 'timestamp'],
            where,
            relations: ['rewards'],
            order: { number: 'DESC' },
            skip: offset,
            take: limit,
            cache: true,
          })

          return [
            await this.summarise(txn, headersWithRewards),
            count,
          ]

        })

  }

  async findSummariesByAuthor(author: string, offset: number = 0, limit: number = 20): Promise<[BlockSummary[], number]> {

    const [headersWithRewards, count] = await this.blockHeaderRepository
      .findAndCount({
        select: ['number', 'hash', 'author', 'transactionHashes', 'uncleHashes', 'difficulty', 'timestamp'],
        where: { author },
        relations: ['rewards'],
        order: { number: 'DESC' },
        skip: offset,
        take: limit,
        cache: true,
      })

    if (count === 0) return [[], count]

    return [
      await this.summarise(this.entityManager, headersWithRewards),
      count,
    ]

  }

  async findSummariesByBlockHash(blockHashes: string[]): Promise<BlockSummary[]> {

    const headersWithRewards = await this.blockHeaderRepository.find({
      select: ['number', 'hash', 'author', 'transactionHashes', 'uncleHashes', 'difficulty', 'timestamp'],
      where: { hash: In(blockHashes) },
      relations: ['rewards'],
      order: { number: 'DESC' },
      cache: true,
    })

    return this.summarise(this.entityManager, headersWithRewards)

  }

  private async summarise(tx: EntityManager, headersWithRewards: BlockHeaderEntity[]): Promise<BlockSummary[]> {

    const blockHashes = headersWithRewards.map(h => h.hash)
    const txStatuses = await this.traceService.findTxStatusByBlockHash(tx, blockHashes)

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
        reward: rewardsByBlock.get(hash) || 0,
      } as BlockSummary

    })

  }

  async findByHash(hash: string): Promise<BlockHeaderEntity | undefined> {

    const { instaMining } = this.configService

    const blockHeader = await this.blockHeaderRepository.findOne({
      where: { hash },
      relations: ['uncles', 'rewards'],
      cache: true,
    })

    if (!blockHeader) return undefined

    // partial read checks

    // look for block reward
    if (!instaMining && !(blockHeader.rewards && blockHeader.rewards.length)) {
      throw new PartialReadException(`Rewards missing, block hash = ${blockHeader.hash}`)
    }

    // check uncle hashes
    const expectedUncleHashes = new Set<string>(JSON.parse(blockHeader.uncleHashes))
    const retrievedUncleHashes = new Set<string>(blockHeader.uncles ? blockHeader.uncles.map(u => u.hash) : null)

    if (!setEquals(expectedUncleHashes, retrievedUncleHashes)) {
      throw new PartialReadException(`Uncles did not match, block hash = ${blockHeader.hash}`)
    }

    return blockHeader
  }

  async findByNumber(number: BigNumber): Promise<BlockHeaderEntity | undefined> {

    const lookup = await this.blockHeaderRepository
      .findOne({
        select: ['hash'],
        where: { number },
      })

    if (lookup) {
      return this.findByHash(lookup.hash)
    } else {
      return undefined
    }
  }
}
