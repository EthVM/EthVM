import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {BlockMetricsDailyEntity} from "@app/orm/entities/block-metrics-daily.entity";
import {BlockMetricsHourlyEntity} from "@app/orm/entities/block-metrics-hourly.entity";
import {BlockMetricsResolvers} from "@app/modules/block-metrics/block-metrics.resolvers";
import {BlockMetricsService} from "@app/modules/block-metrics/block-metrics.service";

@Module({
  imports: [TypeOrmModule.forFeature([BlockMetricsDailyEntity, BlockMetricsHourlyEntity])],
  providers: [BlockMetricsResolvers, BlockMetricsService],
  exports: [],
})
export class BlockMetricsModule {}
