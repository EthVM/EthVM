import { ContractSupport } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class ContractSupportDto implements ContractSupport {

  email?: string
  url?: string

  constructor(data: any) {
    // Deserialize JSON string
    data = JSON.parse(data)
    assignClean(this, data)

  }
}
