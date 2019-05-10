import { ContractLogo } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class ContractLogoDto implements ContractLogo {

  src?: string

  constructor(data: string) {
    // Deserialize JSON string
    data = JSON.parse(data)
    assignClean(this, data)
  }

}
