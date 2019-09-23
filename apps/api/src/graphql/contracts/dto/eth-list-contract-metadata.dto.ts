import { ContractLogo, ContractMetadata, ContractSocial, ContractSupport } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import { ContractLogoDto } from '@app/graphql/contracts/dto/contract-logo.dto'
import { ContractSocialDto } from '@app/graphql/contracts/dto/contract-social.dto'
import { ContractSupportDto } from '@app/graphql/contracts/dto/contract-support.dto'
import {EthListContractMetadataEntity} from '@app/orm/entities/eth-list-contract-metadata.entity'

export class EthListContractMetadataDto implements ContractMetadata {

  address?: string
  name?: string
  symbol?: string
  decimals?: number
  ensAddress?: string
  type?: string
  logo?: ContractLogo
  support?: ContractSupport
  social?: ContractSocial
  website?: string

  constructor(data: EthListContractMetadataEntity) {

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
