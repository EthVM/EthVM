import { Contract } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class ContractDto extends Contract {
  constructor(data: any) {
    super()
    assignClean(this, data)
  }
}
