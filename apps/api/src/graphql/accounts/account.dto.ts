import { Account } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class AccountDto extends Account {
  constructor(data: any) {
    super()
    assignClean(this, data)
  }
}
