import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StatisticService } from '@app/modules/statistics/statistic.service'
import { StatisticResolvers } from '@app/modules/statistics/statistic.resolvers'
import { AggregateBlockMetricEntity } from '@app/orm/entities/aggregate-block-metric.entity'

@Module({
  imports: [TypeOrmModule.forFeature([AggregateBlockMetricEntity])],
  providers: [StatisticService, StatisticResolvers]
})
export class StatisticModule {}
