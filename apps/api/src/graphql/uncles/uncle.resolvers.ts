import { UncleService } from '@app/dao/uncle.service'
import { ParseHashPipe } from '@app/shared/validation/parse-hash.pipe'
import { Args, Query, Resolver } from '@nestjs/graphql'
import BigNumber from 'bignumber.js'
import { UncleDto } from '@app/graphql/uncles/dto/uncle.dto'
import { UnclePageDto } from '@app/graphql/uncles/dto/uncle-page.dto'
import { UseInterceptors } from '@nestjs/common'
import { SyncingInterceptor } from '@app/shared/interceptors/syncing-interceptor'

@Resolver('Uncle')
@UseInterceptors(SyncingInterceptor)
export class UncleResolvers {
  constructor(private readonly uncleService: UncleService) { }

  @Query()
  async uncleByHash(@Args('hash', ParseHashPipe) hash: string) {
    const entity = await this.uncleService.findUncleByHash(hash)
    return entity ? new UncleDto(entity) : null
  }

  @Query()
  async uncles(
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('fromUncle') fromUncle?: BigNumber,
  ) {
    const [entities, count] = await this.uncleService.findUncles(offset, limit, fromUncle)
    // console.log('Uncles', entities)
    return new UnclePageDto(entities, count)
  }

  @Query()
  async latestUncleBlockNumber(): Promise<BigNumber> {
    return await this.uncleService.findLatestUncleBlockNumber()
  }
}
