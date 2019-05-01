import { UncleEntity } from '@app/orm/entities/uncle.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BigNumber from 'bignumber.js';
import { FindManyOptions, LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class UncleService {
  constructor(@InjectRepository(UncleEntity) private readonly uncleRepository: Repository<UncleEntity>) { }

  async findUncleByHash(hash: string): Promise<UncleEntity | undefined> {
    return this.uncleRepository.findOne({ where: { hash } })
  }

  async findUncles(take: number = 10, page: number = 0, fromUncle?: BigNumber): Promise<UncleEntity[]> {
    // Issues to solve:
    //   1) We need to store the count of uncles in processing
    //   2) With that we can proceed with the same process as we're doing with Blocks
    // For now we are resorting to the well known skip, limit calls (but it will cause issues if you go very far)
    const offset = fromUncle && fromUncle !== new BigNumber(-1) ? fromUncle : await this.findLatestUncleBlockNumber()
    const skip = page * take
    const findOptions: FindManyOptions = {
      where: { number: LessThanOrEqual(offset) },
      order: { nephewNumber: 'DESC', number: 'DESC' },
      take,
      skip,
    }
    return this.uncleRepository.find(findOptions)
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
