import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Between, FindManyOptions, Repository} from "typeorm";
import {BlockMetricsDailyEntity} from "@app/orm/entities/block-metrics-daily.entity";

@Injectable()
export class BlockMetricsService {

  constructor(@InjectRepository(BlockMetricsDailyEntity)
              private readonly blockMetricsDailyRepository: Repository<BlockMetricsDailyEntity>,) {
  }

  async findBlockMetricsDaily(start: Date, end: Date): Promise<BlockMetricsDailyEntity[]> {

    const startSeconds = Math.ceil(start.getTime() / 1000)
    const endSeconds = Math.floor(end.getTime() / 1000)

    const findOptions: FindManyOptions<BlockMetricsDailyEntity> = {
      where: {
        // Timestamps are seconds since epoch
        timestamp: Between(startSeconds, endSeconds)
      },
      order: { timestamp: -1 }
    }

    const result = await this.blockMetricsDailyRepository.find(findOptions)

    // convert seconds since epoch timestamps to milliseconds
    result.forEach((entity) => {
      const timestampMs = +entity.timestamp * 1000
      entity.timestamp = timestampMs.toString()
    })

    // filtering genesis block for now
    return result.filter(r => +r.timestamp > 0)
  }

}
