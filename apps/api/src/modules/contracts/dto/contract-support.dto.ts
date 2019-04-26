import { ContractSupport } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class ContractSupportDto extends ContractSupport {
  constructor(data: any) {
    super()
    // Deserialize JSON string
    data = JSON.parse(data)
    assignClean(this, data)

  }
}
