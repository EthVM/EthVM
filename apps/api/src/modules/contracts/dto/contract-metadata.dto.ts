import { ContractMetadata } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import { ContractMetadataEntity } from '@app/orm/entities/contract-metadata.entity'
import { ContractLogoDto } from '@app/modules/contracts/dto/contract-logo.dto'
import { ContractSocialDto } from '@app/modules/contracts/dto/contract-social.dto'
import { ContractSupportDto } from '@app/modules/contracts/dto/contract-support.dto'

export class ContractMetadataDto extends ContractMetadata {
  constructor(data: ContractMetadataEntity) {
    super()

    if (data.logo) {
      this.logo = new ContractLogoDto(data.logo)
      delete data.logo
    }
    if (data.social) {
      this.social = new ContractSocialDto(data.social)
      delete data.social
    }
    if (data.support) {
      this.support = new ContractSupportDto(data.support)
      delete data.support
    }

    assignClean(this, data)

  }
}
