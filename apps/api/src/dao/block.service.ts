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

  /**
   * @constant
   * @type {BigNumber}
   * @default
   */
  private zeroBI = new BigNumber(0)

  constructor(
    @InjectRepository(BlockHeaderEntity) private readonly blockHeaderRepository: Repository<BlockHeaderEntity>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly traceService: TraceService,
    private readonly blockMetricsService: BlockMetricsService,
  ) {
  }

  /**
   * Calculate the latest hash rate.
   * @param {boolean} [cache=true] - Whether to use the cache when calculating the hash rate.
   * @param {BigNumber} blockNumber - Blocks after this block number will be ignored.
   * @returns {Promise<BigNumber | undefined>}
   */
  async calculateHashRate(cache: boolean = true, blockNumber: BigNumber): Promise<BigNumber | undefined> {

    // Use up to the last 20 blocks which equates to about 5 mins at the current production rate.
    const blocks = await this.blockHeaderRepository.createQueryBuilder('b')
      .select(['b.number', 'b.difficulty', 'b.blockTime'])
      .where('b.number <= :blockNumber', { blockNumber: blockNumber.toNumber() })
      .orderBy('b.number', 'DESC')
      .limit(20)
      .cache(cache)
      .getMany()

    if (blocks.length === 0) return undefined

    // Sum all block times.
    const totalBlockTime = blocks
      .map(b => b.blockTime || 0)
      .reduceRight((memo, next) => memo.plus(next || 0), this.zeroBI)

    // Find average block time.
    const avgBlockTime = totalBlockTime.gt(this.zeroBI) ? totalBlockTime.dividedBy(blocks.length) : totalBlockTime

    if (avgBlockTime.eq(0)) return this.zeroBI

    // Divide the latest block difficulty by the avg block time and round to an integer before returning.
    return blocks[0].difficulty
      .dividedBy(avgBlockTime)
      .integerValue()
  }

  /**
   * Find and summarize blocks in descending order.
   * @param {BigNumber} blockNumber - Blocks after this block number will be ignored.
   * @param {number} [offset=0] - The number of items to skip.
   * @param {number} [limit=10] - The page size.
   * @returns {Promise<[BlockSummary[], BigNumber]>} An array of block summaries and the total number of blocks.
   */
  async findSummaries(blockNumber: BigNumber, offset: number = 0, limit: number = 20): Promise<[BlockSummary[], BigNumber]> {

    return this.entityManager
      .transaction(
        'READ COMMITTED',
        async (txn): Promise<[BlockSummary[], BigNumber]> => {

          // The total count of blocks will be equal to the block number param plus one as blocks start at 0
          const count = blockNumber.plus(1)

          // Due to "exactly one" relationship between blocks and blockNumber, we can use this to make querying more efficient and remove the need for
          // offset-style paging.
          const maxBlockNumber = blockNumber.minus(offset).toNumber()

          // Retrieve blocks along with their rewards
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

  /**
   * Find and summarize blocks for a given author in descending order.
   * @param {string} author - The address hash of the miner to filter by.
   * @param {BigNumber} blockNumber - Blocks after this block number will be ignored.
   * @param {number} [offset=0] - The number of items to skip.
   * @param {number} [limit=10] - The page size.
   * @returns {Promise<[BlockSummary[], BigNumber]>} An array of block summaries and the total number of blocks mined by this author.
   */
  async findSummariesByAuthor(author: string, blockNumber: BigNumber, offset: number = 0, limit: number = 20): Promise<[BlockSummary[], BigNumber]> {

    return this.entityManager
      .transaction(
        'READ COMMITTED',
        async (txn): Promise<[BlockSummary[], BigNumber]> => {

          // Get the total number of blocks mined by this author.
          const minedBlocksCount = await txn.findOne(MinerBlockCountEntity, {
            where: { author, blockNumber: LessThanOrEqual(blockNumber) },
            order: { blockNumber: 'DESC' },
          })

          if (!minedBlocksCount) { // This address has not mined any blocks.
            return [[], this.zeroBI]
          }

          // Retrieve block headers along with their rewards.
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

  /**
   * Find and summarize blocks matching an array of block hashes.
   * @param {string[]} blockHashes - The array of block hashes.
   * @param {boolean} [cache=true] - Whether to use the cache.
   * @returns {Promise<BlockSummary[]>}
   */
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

  /**
   * Summarise an array of block headers with rewards.
   * @private
   * @param {EntityManager} tx - The txn within which to perform the query.
   * @param {BlockHeaderEntity[]} headersWithRewards - The block headers to summarise.
   * @param {boolean} [cache=true] - Whether to use the cache.
   * @returns {Promise<BlockSummary[]>}
   */
  private async summarise(tx: EntityManager, headersWithRewards: BlockHeaderEntity[], cache: boolean = true): Promise<BlockSummary[]> {

    if (!headersWithRewards.length) return []

    const blockHashes = headersWithRewards.map(h => h.hash)

    // Initialise min and max timestamps for optimising block metrics traces query
    let maxTimestamp: Date = headersWithRewards[0].timestamp
    let minTimestamp: Date = headersWithRewards[0].timestamp

    // Find the earliest and latest block timestamps and override min and max as appropriate.

    headersWithRewards
      .forEach(h => {

        const millis = h.timestamp.getTime();

        maxTimestamp = maxTimestamp || h.timestamp
        minTimestamp = minTimestamp || h.timestamp

        if (millis < minTimestamp.getTime()) {
          minTimestamp = h.timestamp
        }

        if (millis > maxTimestamp.getTime()) {
          maxTimestamp = h.timestamp
        }

      })

    // Find the tx statuses for the given block hashes.
    const txStatuses = await this.blockMetricsService.findBlockMetricsTraces(blockHashes, maxTimestamp, minTimestamp, tx)

    // Summarise the blocks by combining data from the header, rewards and tx statuses.

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

  /**
   * Find a block header by its hash.
   * @param {string} hash - The block hash.
   * @param {BigNumber} blockNumber - Blocks after this block number will be ignored.
   * @returns {Promise<BlockHeaderEntity | undefined>}
   */
  async findByHash(hash: string, blockNumber: BigNumber): Promise<BlockHeaderEntity | undefined> {

    return await this.blockHeaderRepository.createQueryBuilder('b')
      .leftJoinAndSelect('b.rewards', 'br')
      .leftJoinAndSelect('b.uncles', 'u')
      .where('b.hash = :hash', { hash })
      .andWhere('b.number <= :blockNumber', { blockNumber: blockNumber.toNumber() })
      .cache(true)
      .getOne()
  }

  /**
   * Find a block header by its number.
   * @param {BigNumber} number - The block number.
   * @param {BigNumber} blockNumber - Blocks after this block number will be ignored.
   * @returns {Promise<BlockHeaderEntity | undefined>}
   */
  async findByNumber(number: BigNumber, blockNumber: BigNumber): Promise<BlockHeaderEntity | undefined> {

    if (blockNumber.lt(number)) {
      return undefined // This block has not been mined yet.
    }

    // Select only the hash and number of the block if it exists.
    const lookup = await this.blockHeaderRepository
      .findOne({
        select: ['hash', 'number'],
        where: { number: Equal(number) },
      })

    // Use the hash to find the block.
    if (lookup) {
      return this.findByHash(lookup.hash, blockNumber)
    } else {
      return undefined
    }
  }
}
