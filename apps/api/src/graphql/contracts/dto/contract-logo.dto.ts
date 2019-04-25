import { ContractLogo } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class ContractLogoDto extends ContractLogo {
  constructor(data: string) {
    super()
    // Deserialize JSON string
    data = JSON.parse(data)
    assignClean(this, data)

  }
}
