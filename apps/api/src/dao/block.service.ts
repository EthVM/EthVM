import {BlockSummary} from '@app/graphql/schema'
import {Injectable} from '@nestjs/common'
import {InjectEntityManager, InjectRepository} from '@nestjs/typeorm'
import BigNumber from 'bignumber.js'
import {EntityManager, Equal, In, LessThanOrEqual, Repository} from 'typeorm'
import {TraceService} from './trace.service'
import {BlockHeaderEntity} from '@app/orm/entities/block-header.entity'
import {MinerBlockCountEntity} from '@app/orm/entities/miner-block-count.entity'
import {BlockMetricsService} from '@app/dao/block-metrics.service'
import {BlockMetricsTraceEntity} from '@app/orm/entities/block-metrics-trace.entity'

@Injectable()
export class BlockService {

  private zeroBI = new BigNumber(0)

  constructor(
    @InjectRepository(BlockHeaderEntity) private readonly blockHeaderRepository: Repository<BlockHeaderEntity>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly traceService: TraceService,
    private readonly blockMetricsService: BlockMetricsService,
  ) {
  }

  async calculateHashRate(cache: boolean = true, blockNumber: BigNumber): Promise<BigNumber | undefined> {

    // use up to the last 20 blocks which equates to about 5 mins at the current production rate
    const blocks = await this.blockHeaderRepository.createQueryBuilder('b')
      .select(['b.number', 'b.difficulty', 'b.blockTime'])
      .where('b.number <= :blockNumber', { blockNumber: blockNumber.toNumber() })
      .orderBy('b.number', 'DESC')
      .limit(20)
      .cache(cache)
      .getMany()

    if (blocks.length === 0) return undefined

    const totalBlockTime = blocks
      .map(b => b.blockTime || 0)
      .reduceRight((memo, next) => memo.plus(next || 0), this.zeroBI)

    const avgBlockTime = totalBlockTime.gt(this.zeroBI) ? totalBlockTime.dividedBy(blocks.length) : totalBlockTime

    if (avgBlockTime.eq(0)) return this.zeroBI

    return blocks[0].difficulty
      .dividedBy(avgBlockTime)
      .integerValue()
  }

  async findSummaries(blockNumber: BigNumber, offset: number = 0, limit: number = 20): Promise<[BlockSummary[], BigNumber]> {

    return this.entityManager
      .transaction(
        'READ COMMITTED',
        async (txn): Promise<[BlockSummary[], BigNumber]> => {

          const count = blockNumber.plus(1)

          // Due to "exactly one" relationship between blocks and blockNumber, we can use this to make querying more efficient and remove the need for
          // offset-style paging
          const maxBlockNumber = blockNumber.minus(offset).toNumber()

          const headersWithRewards = await txn.createQueryBuilder(BlockHeaderEntity, 'b')
            .leftJoinAndSelect('b.rewards', 'br')
            .where('b.number <= :blockNumber', { blockNumber: maxBlockNumber })
            .select([
              'b.number',
              'b.hash',
              'b.author',
              'b.transactionHashes',
              'b.uncleHashes',
              'b.difficulty',
              'b.timestamp',
              'br.deltaType',
              'br.blockHash',
              'br.amount',
            ])
            .orderBy('b.number', 'DESC')
            .limit(limit)
            .cache(true)
            .getMany()

          return [
            await this.summarise(txn, headersWithRewards),
            count,
          ]

        })

  }

  async findSummariesByAuthor(author: string, blockNumber: BigNumber, offset: number = 0, limit: number = 20): Promise<[BlockSummary[], BigNumber]> {

    return this.entityManager
      .transaction(
        'READ COMMITTED',
        async (txn): Promise<[BlockSummary[], BigNumber]> => {

          const minedBlocksCount = await txn.findOne(MinerBlockCountEntity, {
            where: { author, blockNumber: LessThanOrEqual(blockNumber) },
            order: { blockNumber: 'DESC' },
          })

          if (!minedBlocksCount) { // This address has not mined any blocks
            return [[], this.zeroBI]
          }

          const headersWithRewards = await txn.createQueryBuilder(BlockHeaderEntity, 'b')
            .leftJoinAndSelect('b.rewards', 'br')
            .where('b.author = :author', { author })
            .andWhere('b.number <= :blockNumber', { blockNumber: blockNumber.toNumber() })
            .select([
              'b.number',
              'b.hash',
              'b.author',
              'b.transactionHashes',
              'b.uncleHashes',
              'b.difficulty',
              'b.timestamp',
              'br.deltaType',
              'br.blockHash',
              'br.amount',
              // TODO also select txCount and uncleCount?
            ])
            .orderBy('b.number', 'DESC')
            .skip(offset)
            .take(limit)
            .cache(true)
            .getMany()

          return [
            await this.summarise(txn, headersWithRewards),
            minedBlocksCount.count,
          ]
        })

  }

  async findSummariesByBlockHash(blockHashes: string[], cache: boolean = true): Promise<BlockSummary[]> {

    // TODO add blockNumber param?

    if (!blockHashes.length) return []

    const headersWithRewards = await this.blockHeaderRepository.find({
      select: ['number', 'hash', 'author', 'transactionHashes', 'uncleHashes', 'difficulty', 'timestamp'],
      where: { hash: In(blockHashes) },
      relations: ['rewards'],
      order: { number: 'DESC' },
      cache,
    })

    return this.summarise(this.entityManager, headersWithRewards)

  }

  private async summarise(tx: EntityManager, headersWithRewards: BlockHeaderEntity[], cache: boolean = true): Promise<BlockSummary[]> {

    const blockHashes = headersWithRewards.map(h => h.hash)

    const txStatuses = await this.blockMetricsService.findBlockMetricsTraces(blockHashes, tx)

    const txStatusesByHash = new Map<string, BlockMetricsTraceEntity>()
    txStatuses.forEach(status => txStatusesByHash.set(status.hash, status))

    return headersWithRewards.map(header => {

      const { number, hash, author, uncleHashes, transactionHashes, difficulty, timestamp } = header

      const rewardsByBlock = new Map<string, BigNumber>()

      header.rewards!
        .filter(r => r.deltaType === 'BLOCK_REWARD')
        .map(r => rewardsByBlock.set(r.blockHash, r.amount))

      const txStatus = txStatusesByHash.get(hash) || {} as any

      return {
        number, hash, author, difficulty, timestamp,
        uncleHashes: JSON.parse(uncleHashes),
        transactionHashes: JSON.parse(transactionHashes),
        numTxs: txStatus.totalTxs || 0,
        numSuccessfulTxs: txStatus.numSuccessfulTxs || 0,
        numFailedTxs: txStatus.numFailedTxs || 0,
        reward: rewardsByBlock.get(hash) || 0,
      } as BlockSummary

    })

  }

  async findByHash(hash: string, blockNumber: BigNumber): Promise<BlockHeaderEntity | undefined> {

    return await this.blockHeaderRepository.createQueryBuilder('b')
      .leftJoinAndSelect('b.rewards', 'br')
      .leftJoinAndSelect('b.uncles', 'u')
      .where('b.hash = :hash', { hash })
      .andWhere('b.number <= :blockNumber', { blockNumber: blockNumber.toNumber() })
      .cache(true)
      .getOne()
  }

  async findByNumber(number: BigNumber, blockNumber: BigNumber): Promise<BlockHeaderEntity | undefined> {

    if (blockNumber.lte(number)) {
      return undefined // This block has not been mined yet
    }

    const lookup = await this.blockHeaderRepository
      .findOne({
        select: ['hash', 'number'],
        where: { number: Equal(number) },
      })

    if (lookup) {
      return this.findByHash(lookup.hash, blockNumber)
    } else {
      return undefined
    }
  }
}
