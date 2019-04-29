import { TokenMetadata } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class TokenMetadataDto extends TokenMetadata {
  constructor(data: any) {
    super()
    assignClean(this, data)
  }
}
