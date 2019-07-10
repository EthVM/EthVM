import { TokenMetadata } from '@app/graphql/schema'
import { assignClean, extractFromJson } from '@app/shared/utils'
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
    this.email = extractFromJson('email', data.support)
    this.logo = extractFromJson('src', data.logo)
  }

}
