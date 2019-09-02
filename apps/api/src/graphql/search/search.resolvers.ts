import {Args, Query, Resolver} from '@nestjs/graphql'
import {SearchService} from '@app/dao/search.service'
import {UseInterceptors} from '@nestjs/common'
import {SyncingInterceptor} from '@app/shared/interceptors/syncing-interceptor'
import {BlockNumberPipe} from '@app/shared/pipes/block-number.pipe';
import BigNumber from 'bignumber.js';
import {SearchDto} from '@app/graphql/search/search.dto';
import {SearchType} from '@app/graphql/schema';

@Resolver('Search')
@UseInterceptors(SyncingInterceptor)
export class SearchResolvers {
  constructor(private readonly searchService: SearchService) {}

  @Query()
  async search(@Args('query') query: string, @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber): Promise<SearchDto> {
    if (!blockNumber) { // There is no data
      return new SearchDto({ type: SearchType.None })
    }
    return this.searchService.search(query, blockNumber)
  }
}
