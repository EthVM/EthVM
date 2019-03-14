import { assignClean } from '@app/shared/utils'
import { AggregateBlockMetric } from '@app/graphql/schema'

export class StatisticDto extends AggregateBlockMetric {
  value: string | number

  constructor(data: any) {
    super()
    assignClean(this, data)

    this.value = data.bigInteger | data.int | data.long | data.float | data.double
  }
}
