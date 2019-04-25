import { ContractSocial } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class ContractSocialDto extends ContractSocial {
  constructor(data: string) {
    super()
    // Deserialize JSON string
    data = JSON.parse(data)
    assignClean(this, data)

  }
}
