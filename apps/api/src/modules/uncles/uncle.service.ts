import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UncleEntity } from '@app/orm/entities-mongo/uncle.entity'
import { MongoRepository } from 'typeorm'

@Injectable()
export class UncleService {
  constructor(@InjectRepository(UncleEntity) private readonly uncleRepository: MongoRepository<UncleEntity>) {}

  async findUncleByHash(hash: string): Promise<UncleEntity | undefined> {
    return this.uncleRepository.findOne({ where: { hash } })
  }

  async findUncles(take: number = 10, page: number = 0, fromUncle?: number): Promise<UncleEntity[]> {
    // Issues to solve:
    //   1) We need to store the count of uncles in processing
    //   2) With that we can proceed with the same process as we're doing with Blocks
    // For now we are resorting to the well known skip, limit calls (but it will cause issues if you go very far)
    const offset = fromUncle && fromUncle !== -1 ? fromUncle : await this.findLatestUncleBlockNumber()
    const skip = page * take
    return this.uncleRepository.find({
      where: { number: { $lte: offset } },
      skip,
      take,
      order: { blockNumber: -1, number: -1 },
    })
  }

  async countUncles(): Promise<number> {
    return this.uncleRepository.count()
  }

  async findLatestUncleBlockNumber(): Promise<number> {
    const latest = await this.uncleRepository.find({ order: { blockNumber: -1, number: -1 }, take: 1 })
    return latest && latest.length ? latest[0].blockNumber : 0
  }
}
