import { TokenMetadata } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class TokenMetadataDto implements TokenMetadata {

  name?: string
  website?: string
  email?: string
  symbol?: string
  address?: string
  decimals?: number
  logo?: string

  constructor(data: any) {
    assignClean(this, data)
  }

}
