import { TokenMetadata } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import { TokenMetadataEntity } from '@app/orm/entities/token-metadata.entity'

export class TokenMetadataDto implements TokenMetadata {

  name?: string
  website?: string
  email?: string
  symbol?: string
  address?: string
  decimals?: number
  logo?: string

  constructor(data: TokenMetadataEntity) {
    assignClean(this, data)
    this.email = data.support ? JSON.parse(data.support).email : null
    this.logo = data.logo ? JSON.parse(data.logo).src : null
  }

}
