import { Balance } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class BalanceDto extends Balance {
  constructor(data: any) {
    super()
    assignClean(this, data)

    // Map amount
    if (this.amount) {
      this.amount = this.amount.toString()
    }
  }
}
