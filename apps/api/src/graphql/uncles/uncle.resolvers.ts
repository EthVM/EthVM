import { Args, Query, Resolver } from '@nestjs/graphql'
import { UncleService } from '@app/dao/uncle.service'
import { UncleDto } from '@app/graphql/uncles/uncle.dto'
import { ParseHashPipe } from '@app/shared/validation/parse-hash.pipe'
import { ParseLimitPipe } from '@app/shared/validation/parse-limit.pipe'
import { ParsePagePipe } from '@app/shared/validation/parse-page.pipe'

@Resolver('Uncle')
export class UncleResolvers {
  constructor(private readonly uncleService: UncleService) {}

  @Query()
  async uncleByHash(@Args('hash', ParseHashPipe) hash: string) {
    const entity = await this.uncleService.findUncleByHash(hash)
    return entity ? new UncleDto(entity) : null
  }

  @Query()
  async uncles(@Args('limit', ParseLimitPipe) limit?: number, @Args('page', ParsePagePipe) page?: number, @Args('fromUncle') fromUncle?: number) {
    const entities = await this.uncleService.findUncles(limit, page, fromUncle)
    return entities.map(e => new UncleDto(e))
  }

  @Query()
  async totalNumberOfUncles() {
    return await this.uncleService.countUncles()
  }

  @Query()
  async latestUncleBlockNumber() {
    return await this.uncleService.findLatestUncleBlockNumber()
  }
}
