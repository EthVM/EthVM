import {Injectable} from '@nestjs/common'
import {InjectEntityManager, InjectRepository} from '@nestjs/typeorm'
import BigNumber from 'bignumber.js'
import {EntityManager, Equal, FindOneOptions, LessThanOrEqual, Repository} from 'typeorm'
import {UncleEntity} from '@app/orm/entities/uncle.entity';
import {CanonicalCountEntity} from '@app/orm/entities/canonical-count.entity';
import {BalanceDeltaEntity} from '@app/orm/entities/balance-delta.entity';

@Injectable()
export class UncleService {
  constructor(@InjectRepository(UncleEntity)
              private readonly uncleRepository: Repository<UncleEntity>,
              @InjectEntityManager()
              private readonly entityManager: EntityManager) {
  }

  async findUncleByHash(hash: string, blockNumber: BigNumber): Promise<UncleEntity | undefined> {
    return this.entityManager.transaction(
      'READ COMMITTED',
      async (entityManager): Promise<UncleEntity | undefined> => {

        const uncle = await entityManager.findOne(UncleEntity, {
          where: { hash, height: LessThanOrEqual(blockNumber) },
          cache: true,
        })
        if (!uncle) return undefined

        const [reward] = await this.findRewards(entityManager, [uncle.nephewHash], [uncle.author])
        uncle.reward = reward
        return uncle
      })
  }

  async findUncles(offset: number = 0, limit: number = 20, blockNumber: BigNumber): Promise<[UncleEntity[], BigNumber]> {

    return this.entityManager.transaction(
      'READ COMMITTED',
      async (entityManager): Promise<[UncleEntity[], BigNumber]> => {

        const { count: totalCount } = await entityManager.findOne(CanonicalCountEntity, {
          select: ['count'],
          where: {
            entity: 'uncles',
            blockNumber: Equal(blockNumber),
          },
          cache: true,
        } as FindOneOptions)

        if (totalCount.isEqualTo(0)) return [[], totalCount]

        const uncles = await entityManager.find(UncleEntity, {
          where: { height: LessThanOrEqual(blockNumber) },
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
          if (!memo[next.blockHash!]) {
            memo[next.blockHash!] = []
          }
          memo[next.blockHash!].push(next)
          return memo
        }, {})

        uncles.forEach(u => {
          const rewardsForHash = rewardsByBlockHash[u.nephewHash]
          u.reward = rewardsForHash && rewardsForHash.length ? rewardsForHash.find(r => r.address === u.author) : undefined
        })

        return [uncles, totalCount]

      })

  }

  private async findRewards(
    entityManager: EntityManager,
    blockHashes: string[],
    addresses: string[]
  ): Promise<BalanceDeltaEntity[]> {

    return await entityManager.createQueryBuilder(BalanceDeltaEntity, 'bd')
      .select(['bd.address', 'bd.blockHash', 'bd.amount'])
      .where('bd.delta_type = :deltaType', { deltaType: 'UNCLE_REWARD' })
      .andWhere('bd.block_hash IN (:...blockHashes)', { blockHashes })
      .andWhere('bd.address IN (:...addresses)', { addresses })
      .cache(true)
      .getMany()

  }

  async findLatestUncleBlockNumber(blockNumber: BigNumber): Promise<BigNumber> {
    const latest = await this.uncleRepository.findOne({
      where: { height: LessThanOrEqual(blockNumber) },
      order: { height: 'DESC' },
      select: ['height'],
      cache: true,
    })
    return latest  ? latest.height : new BigNumber('0')
  }
}
