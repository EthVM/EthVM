import {Entity} from "typeorm";
import {assignClean} from "@app/shared/utils";
import {BlockMetric} from "@app/orm/entities/block-metric";

@Entity('canonical_block_metrics_daily')
export class BlockMetricsDailyEntity extends BlockMetric {

  constructor(data: any) {
    super()
    assignClean(this, data)
  }
}
