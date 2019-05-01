import { DaoModule } from '@app/dao/dao.module';
import { BlockMetricsResolvers } from '@app/graphql/block-metrics/block-metrics.resolvers';
import { Module } from '@nestjs/common';

@Module({
  imports: [DaoModule],
  providers: [BlockMetricsResolvers],
  exports: [],
})
export class BlockMetricsModule { }
