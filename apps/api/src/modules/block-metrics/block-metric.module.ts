import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BlockMetricEntity } from '@app/orm/entities-mongo/block-metric.entity'
import { BlockMetricService } from '@app/modules/block-metrics/block-metric.service'
import { BlockMetricResolvers } from '@app/modules/block-metrics/block-metric.resolvers'
import { SubscriptionsModule } from '@app/subscriptions/subscriptions.module'

@Module({
  imports: [TypeOrmModule.forFeature([BlockMetricEntity]), SubscriptionsModule],
  providers: [BlockMetricService, BlockMetricResolvers],
  exports: [],
})
export class BlockMetricModule {}
