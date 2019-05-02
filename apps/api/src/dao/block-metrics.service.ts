import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {In, Repository} from 'typeorm'
import {BlockMetricEntity} from '@app/orm/entities/block-metric.entity'
import BigNumber from 'bignumber.js'


@Injectable()
export class BlockMetricsService {

  constructor(@InjectRepository(BlockMetricEntity)
              private readonly blockMetricsRepository: Repository<BlockMetricEntity>) {
  }

  async findByBlockHash(blockHashes: string[]): Promise<BlockMetricEntity[]> {
    return this.blockMetricsRepository
      .find({
        where: {
          blockHash: In(blockHashes),
        },
      })
  }

  async find(offset: number, limit: number): Promise<[BlockMetricEntity[], number]> {
    return this.blockMetricsRepository
      .findAndCount({
        order: {number: 'DESC'},
        skip: offset,
        take: limit,
      })
  }


}
