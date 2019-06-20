import { TokenMetadata, TokenMetadataPage } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import { TokenMetadataDto } from '@app/graphql/tokens/dto/token-metadata.dto'

export class TokenMetadataPageDto implements TokenMetadataPage {
  items!: TokenMetadata[]
  totalCount!: number

  constructor(data) {
    if (data.items) {
      this.items = data.items.map(i => new TokenMetadataDto(i))
      delete data.items
    }
    assignClean(this, data)
  }
}
