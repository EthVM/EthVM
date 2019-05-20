import { DaoModule } from '@app/dao/dao.module';
import { BlockMetricsResolvers } from '@app/graphql/block-metrics/block-metrics.resolvers';
import { Module } from '@nestjs/common';
import {SubscriptionsModule} from '@app/subscriptions/subscriptions.module'

@Module({
  imports: [DaoModule, SubscriptionsModule],
  providers: [BlockMetricsResolvers],
  exports: [],
})
export class BlockMetricsModule { }
