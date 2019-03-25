import { BlockMetric } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class BlockMetricDto extends BlockMetric {
  constructor(data: any) {
    super()
    assignClean(this, data)
    // TODO add mappers
  }
}
