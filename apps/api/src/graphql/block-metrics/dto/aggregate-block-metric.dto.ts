import {AggregateBlockMetric} from '@app/graphql/schema'
import {assignClean} from '@app/shared/utils'

export class AggregateBlockMetricDto extends AggregateBlockMetric {

  constructor(data: any) {
    super()
    assignClean(this, data)
  }

}
