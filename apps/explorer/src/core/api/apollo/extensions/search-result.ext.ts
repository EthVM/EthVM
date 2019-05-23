import { SearchResult } from '@app/core/api/apollo/types/SearchResult'
import { SearchType } from '@app/core/api/apollo/types/globalTypes'

export class SearchResultExt implements SearchResult {
  __typename!: 'Search'
  type: SearchType

  constructor(proto: SearchResult) {
    this.type = proto.type
  }
}
