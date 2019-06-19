import { UncleEntity } from '@app/orm/entities/uncle.entity'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import BigNumber from 'bignumber.js'
import { EntityManager, FindManyOptions, LessThanOrEqual, MoreThan, Repository } from 'typeorm'
import { TransactionSummary } from '@app/graphql/schema'
import { CanonicalCount } from '@app/orm/entities/row-counts.entity'
import { TransactionEntity } from '@app/orm/entities/transaction.entity'

@Injectable()
export class UncleService {
  constructor(@InjectRepository(UncleEntity)
              private readonly uncleRepository: Repository<UncleEntity>,
              @InjectEntityManager()
              private readonly entityManager: EntityManager) {
  }

  async findUncleByHash(hash: string): Promise<UncleEntity | undefined> {
    return this.uncleRepository.findOne({ where: { hash } })
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
        })

        if (totalCount === 0) return [[], totalCount]

        if (fromUncle) {
          // we count all uncles greater than the from uncle and deduct from total
          // this is much faster way of determining the count
          const filterCount = await entityManager.count(UncleEntity, {
            where: {
              number: MoreThan(fromUncle),
            },
          })

          totalCount = totalCount - filterCount
        }

        const where = fromUncle ? { number: LessThanOrEqual(fromUncle) } : {}

        const uncles = await entityManager.find(UncleEntity, {
          where,
          order: { nephewNumber: 'DESC', number: 'DESC' },
          skip: offset,
          take: limit,
        })

        return [uncles, totalCount]

      })

  }

  async findLatestUncleBlockNumber(): Promise<BigNumber> {
    const findOptions: FindManyOptions = { order: { nephewNumber: 'DESC', number: 'DESC' }, take: 1 }
    const latest = await this.uncleRepository.find(findOptions)
    return latest && latest.length ? latest[0].height : new BigNumber('0')
  }
}
