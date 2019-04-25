import { Args, Query, Resolver } from '@nestjs/graphql'
import { SearchService } from '@app/dao/search.service'

@Resolver('Search')
export class SearchResolvers {
  constructor(private readonly searchService: SearchService) {}

  @Query()
  async search(@Args('query') query: string) {
    return this.searchService.search(query)
  }
}
