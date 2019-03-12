import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BlockMetricEntity } from '@app/orm/entities/block-metric.entity'
import { BlockMetricService } from '@app/modules/block-metrics/block-metric.service'
import { BlockMetricResolvers } from '@app/modules/block-metrics/block-metric.resolvers'

@Module({
  imports: [ TypeOrmModule.forFeature([BlockMetricEntity]) ],
  providers: [ BlockMetricService, BlockMetricResolvers ],
  exports: []

})
export class BlockMetricModule {}
