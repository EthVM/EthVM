import {assignClean} from '@app/shared/utils'
import {BlockMetrics} from '@app/graphql/schema';

export class BlockMetricsDto extends BlockMetrics {

  constructor(data: any) {
    super()
    assignClean(this, data)
  }
}
