import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BlockMetricEntity } from '@app/orm/entities/block-metric.entity'
import { MongoRepository } from 'typeorm'

@Injectable()
export class BlockMetricService {
  constructor(
    @InjectRepository(BlockMetricEntity)
    private readonly blockMetricRepository: MongoRepository<BlockMetricEntity>,
  ) {}

  async findBlockMetricByHash(hash: string): Promise<BlockMetricEntity | null> {
    return this.blockMetricRepository.findOne({ where: { hash } })
  }

  async findBlockMetrics(take: number = 10, page: number = 0): Promise<BlockMetricEntity[]> {
    const skip = page * take
    return this.blockMetricRepository.find({ take, skip, order: { number: -1 } })
  }
}
