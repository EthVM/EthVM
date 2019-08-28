import { UncleEntity } from '@app/orm/entities/uncle.entity'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import BigNumber from 'bignumber.js'
import { EntityManager, LessThanOrEqual, Repository } from 'typeorm'
import { CanonicalCount } from '@app/orm/entities/row-counts.entity'
import { DbConnection } from '@app/orm/config'
import { FungibleBalanceDeltaEntity } from '@app/orm/entities/fungible-balance-delta.entity'

@Injectable()
export class UncleService {
  constructor(@InjectRepository(UncleEntity, DbConnection.Principal)
              private readonly uncleRepository: Repository<UncleEntity>,
              @InjectEntityManager(DbConnection.Principal)
              private readonly entityManager: EntityManager) {
  }

  async findUncleByHash(hash: string): Promise<UncleEntity | undefined> {
    return this.entityManager.transaction(
      'READ COMMITTED',
      async (entityManager): Promise<UncleEntity | undefined> => {
        const uncle = await entityManager.findOne(UncleEntity, { where: { hash }, cache: true })
        if (!uncle) return undefined

        const [reward] = await this.findRewards(entityManager, [uncle.nephewHash], [uncle.author])
        uncle.reward = reward
        return uncle
      })
  }

  async findUncles(offset: number = 0, limit: number = 20, fromUncle?: BigNumber): Promise<[UncleEntity[], number]> {

    return this.entityManager.transaction(
      'READ COMMITTED',
      async (entityManager): Promise<[UncleEntity[], number]> => {

        const [{ count: totalCount }] = await entityManager.find(CanonicalCount, {
          select: ['count'],
          where: {
            entity: 'uncle',
          },
          cache: true,
        })

        if (totalCount === 0) return [[], totalCount]

        const where = fromUncle ? { number: LessThanOrEqual(fromUncle) } : {}

        const uncles = await entityManager.find(UncleEntity, {
          where,
          order: { height: 'DESC' },
          skip: offset,
          take: limit,
          cache: true,
        })

        const nephewHashes = uncles.map(u => u.nephewHash)
        const authors = uncles.map(u => u.author)

        const rewards = await this.findRewards(entityManager, nephewHashes, authors)

        // Map rewards to uncles

        const rewardsByBlockHash = rewards.reduce((memo, next) => {
          if (!memo[next.traceLocationBlockHash]) {
            memo[next.traceLocationBlockHash] = []
          }
          memo[next.traceLocationBlockHash].push(next)
          return memo
        }, {})

        uncles.forEach(u => {
          const rewardsForHash = rewardsByBlockHash[u.nephewHash]
          u.reward = rewardsForHash && rewardsForHash.length ? rewardsForHash.find(r => r.address === u.author) : undefined
        })

        return [uncles, totalCount]

      })

  }

  private async findRewards(entityManager: EntityManager, blockHashes: string[], addresses: string[]): Promise<FungibleBalanceDeltaEntity[]> {

    return await entityManager.createQueryBuilder(FungibleBalanceDeltaEntity, 'bd')
      .select(['bd.address', 'bd.traceLocationBlockHash', 'bd.amount'])
      .where('bd.delta_type = :deltaType', { deltaType: 'UNCLE_REWARD' })
      .andWhere('bd.trace_location_block_hash IN (:...blockHashes)', { blockHashes })
      .andWhere('bd.address IN (:...addresses)', { addresses })
      .cache(true)
      .getMany()

  }

  async findLatestUncleBlockNumber(): Promise<BigNumber> {
    const latest = await this.uncleRepository.findOne({ order: { height: 'DESC' }, select: ['height'], cache: true })
    return latest  ? latest.height : new BigNumber('0')
  }
}
