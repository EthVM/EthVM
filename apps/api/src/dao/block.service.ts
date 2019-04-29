import { BlockSummary } from '@app/graphql/schema';
import { BlockHeaderEntity } from '@app/orm/entities/block-header.entity';
import { TransactionTraceEntity } from '@app/orm/entities/transaction-trace.entity';
import { TransactionEntity } from '@app/orm/entities/transaction.entity';
import { UncleEntity } from '@app/orm/entities/uncle.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BigNumber from 'bignumber.js';
import {In, LessThan, LessThanOrEqual, Repository} from 'typeorm';
import { TraceService } from './trace.service';

@Injectable()
export class BlockService {
  constructor(
    @InjectRepository(BlockHeaderEntity) private readonly blockHeaderRepository: Repository<BlockHeaderEntity>,
    @InjectRepository(TransactionEntity) private readonly transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(TransactionTraceEntity) private readonly transactionTraceRepository: Repository<TransactionTraceEntity>,
    @InjectRepository(UncleEntity) private readonly uncleRepository: Repository<UncleEntity>,
    private readonly traceService: TraceService
  ) { }

  async findBlockSummaries(offset: number, limit: number): Promise<[BlockSummary[], number]> {

    const [headersWithRewards, count] = await this.blockHeaderRepository
      .findAndCount({
        select: ['number', 'hash', 'author', 'transactionHashes', 'uncleHashes'],
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

  async findLatestBlocks(limit: number): Promise<BlockSummary[]> {

    const headersWithRewards = await this.blockHeaderRepository.find({
      select: ['number', 'hash', 'author', 'transactionHashes', 'uncleHashes'],
      relations: ['rewards'],
      order: { number: 'DESC' },
      take: limit,
    })

    return this.summarise(headersWithRewards)
  }

  async findSummariesByBlockHash(blockHashes: string[]): Promise<BlockSummary[]> {

    const headersWithRewards = await this.blockHeaderRepository.find({
      select: ['number', 'hash', 'author', 'transactionHashes', 'uncleHashes'],
      where: { hash: In(blockHashes) },
      relations: ['rewards'],
      order: { number: 'DESC' },
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

      const { number, hash, author, uncleHashes, transactionHashes } = header

      const rewardsByBlock = new Map<string, BigNumber>()

      header.rewards!
        .filter(r => r.deltaType === 'BLOCK_REWARD')
        .map(r => rewardsByBlock.set(r.blockHash, r.amount))


      return {
        number, hash, author,
        uncleHashes: JSON.parse(uncleHashes),
        transactionHashes: JSON.parse(transactionHashes),
        numSuccessfulTxs: successfulCountByBlock.get(hash) || 0,
        numFailedTxs: failedCountByBlock.get(hash) || 0,
        reward: rewardsByBlock.get(hash)
      } as BlockSummary

    })

  }

  async findOneByBlockHash(hash: string): Promise<BlockHeaderEntity | undefined> {
    const blockHeader = await this.blockHeaderRepository.findOne({ where: { hash }, relations: ['uncles', 'rewards'] })
    if (!blockHeader) return undefined

    blockHeader.txs = await this.findTxsByBlockHash(hash)
    return blockHeader
  }

  async findByBlockHash(hashes: string[]): Promise<BlockHeaderEntity[]> {
    const blocks = await this.blockHeaderRepository.find({ hash: In(hashes) })
    return this.findAndMapTxsAndUncles(blocks)
  }

  async findBlocks(limit: number = 10, page: number = 0, fromBlock: number = -1): Promise<BlockHeaderEntity[]> {
    const where = fromBlock !== -1 ? { number: LessThanOrEqual(fromBlock) } : {}
    const skip = page * limit
    const blocks = await this.blockHeaderRepository.find({ where, take: limit, skip, order: { number: 'DESC' }, relations: ['rewards'] })
    return this.findAndMapTxsAndUncles(blocks)
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

    const txs = await this.transactionRepository.find({ where: { blockHash }, relations: ['receipt'] })
    const traces = await this.transactionTraceRepository.find({ where: { blockHash } })

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

  async findMinedBlocksByAddress(address: string, limit: number = 10, page: number = 0): Promise<[BlockHeaderEntity[], number]> {
    const skip = page * limit
    const result = await this.blockHeaderRepository.findAndCount({
      where: { author: address },
      take: limit,
      skip,
      order: { number: 'DESC' },
      relations: ['rewards'],
    })
    result[0] = await this.findAndMapTxsAndUncles(result[0])
    return result
  }

  async findTotalNumberOfBlocks(): Promise<BigNumber> {
    return new BigNumber(await this.blockHeaderRepository.count())
  }
}
