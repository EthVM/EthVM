import { UncleEntity } from '@app/orm/entities/uncle.entity'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import BigNumber from 'bignumber.js'
import { EntityManager, In, LessThanOrEqual, MoreThan, Repository } from 'typeorm'
import { CanonicalCount } from '@app/orm/entities/row-counts.entity'
import { DbConnection } from '@app/orm/config'
import { UncleRewardEntity } from '@app/orm/entities/uncle-reward.entity'
import { TransactionEntity } from '@app/orm/entities/transaction.entity'

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

        const where = { blockHash: uncle.nephewHash, address: uncle.author }
        uncle.reward = await entityManager.findOne(UncleRewardEntity, { where, cache: true })
        return uncle
      })
  }

  async findUncles(offset: number = 0, limit: number = 20, fromUncle?: BigNumber): Promise<[UncleEntity[], number]> {

    return this.entityManager.transaction(
      'READ COMMITTED',
      async (entityManager): Promise<[UncleEntity[], number]> => {

        let [{ count: totalCount }] = await entityManager.find(CanonicalCount, {
          select: ['count'],
          where: {
            entity: 'uncle',
          },
          cache: true,
        })

        if (totalCount === 0) return [[], totalCount]

        if (fromUncle) {
          // we count all uncles greater than the from uncle and deduct from totalcache: true
          // this is much faster way of determining the count

          const { count: filterCount } = await entityManager.createQueryBuilder()
            .select('count(hash)', 'count')
            .from(UncleEntity, 't')
            .where({ number: MoreThan(fromUncle) })
            .cache(true)
            .getRawOne() as { count: number }

          totalCount = totalCount - filterCount
        }

        const where = fromUncle ? { number: LessThanOrEqual(fromUncle) } : {}

        const uncles = await entityManager.find(UncleEntity, {
          where,
          order: { height: 'DESC' },
          skip: offset,
          take: limit,
          cache: true,
        })

        // Cheaper to get all rewards for each block hash and filter to those matching authors manually
        const rewards = await entityManager.find(UncleRewardEntity, {
          where: { blockHash: In(uncles.map(u => u.nephewHash)) },
          cache: true,
        })

        // Map rewards to uncles

        const rewardsByBlockHash = rewards.reduce((memo, next) => {
          if (!memo[next.blockHash]) {
            memo[next.blockHash] = []
          }
          memo[next.blockHash].push(next)
          return memo
        }, {})

        uncles.forEach(u => {
          const rewardsForHash = rewardsByBlockHash[u.nephewHash]
          u.reward = rewardsForHash && rewardsForHash.length ? rewardsForHash.find(r => r.address === u.author) : undefined
        })

        return [uncles, totalCount]

      })

  }

  async findLatestUncleBlockNumber(): Promise<BigNumber> {
    const latest = await this.uncleRepository.findOne({ order: { height: 'DESC' }, select: ['height'], cache: true })
    return latest  ? latest.height : new BigNumber('0')
  }
}
