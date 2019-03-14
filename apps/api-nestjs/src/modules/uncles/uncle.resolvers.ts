import { Args, Query, Resolver } from '@nestjs/graphql'
import { UncleService } from '@app/modules/uncles/uncle.service'
import { UncleDto } from '@app/modules/uncles/uncle.dto'

@Resolver('Uncle')
export class UncleResolvers {
  constructor(private readonly uncleService: UncleService) {}

  @Query()
  async uncleByHash(@Args('hash') hash: string) {
    const entity = await this.uncleService.findUncleByHash(hash)
    return entity ? new UncleDto(entity) : null
  }

  @Query()
  async uncles(@Args('limit') limit?: number,
               @Args('page') page?: number,
               @Args('fromUncle') fromUncle?: number) {
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
