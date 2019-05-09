import { UncleEntity } from '@app/orm/entities/uncle.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import BigNumber from 'bignumber.js'
import { FindManyOptions, LessThanOrEqual, Repository } from 'typeorm'

@Injectable()
export class UncleService {
  constructor(@InjectRepository(UncleEntity) private readonly uncleRepository: Repository<UncleEntity>) {
  }

  async findUncleByHash(hash: string): Promise<UncleEntity | undefined> {
    return this.uncleRepository.findOne({ where: { hash } })
  }

  async findUncles(offset: number = 0, limit: number = 20, fromUncle?: BigNumber): Promise<[UncleEntity[], number]> {

    const where = fromUncle ? { number: LessThanOrEqual(fromUncle) } : {}

    return this.uncleRepository
      .findAndCount({
        where,
        order: { nephewNumber: 'DESC', number: 'DESC' },
        skip: offset,
        take: limit,
      })
  }

  async countUncles(): Promise<BigNumber> {
    return new BigNumber(await this.uncleRepository.count())
  }

  async findLatestUncleBlockNumber(): Promise<BigNumber> {
    const findOptions: FindManyOptions = { order: { nephewNumber: 'DESC', number: 'DESC' }, take: 1 }
    const latest = await this.uncleRepository.find(findOptions)
    return latest && latest.length ? latest[0].height : new BigNumber('0')
  }
}
