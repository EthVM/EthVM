import {TokenMetadata, TokenMetadataPage} from '@app/graphql/schema'
import {TokenMetadataDto} from '@app/graphql/tokens/dto/token-metadata.dto'
import {TokenMetadataEntity} from '@app/orm/entities/token-metadata.entity'

export class TokenMetadataPageDto implements TokenMetadataPage {
  items!: TokenMetadata[]
  hasMore!: boolean

  constructor(items: TokenMetadataEntity[], hasMore: boolean) {
    if (items) {
      this.items = items.map(i => new TokenMetadataDto(i))
    }
    this.hasMore = hasMore
  }
}
