import { Args, Query, Resolver } from '@nestjs/graphql'
import { BlockMetricService } from '@app/modules/block-metrics/block-metric.service'
import { BlockMetricDto } from '@app/modules/block-metrics/block-metric.dto'

@Resolver('BlockMetric')
export class BlockMetricResolvers {
  constructor(private readonly blockMetricService: BlockMetricService) {}

  @Query()
  async blockMetricByHash(@Args('hash') hash: string) {
    const entity = await this.blockMetricService.findBlockMetricByHash(hash)
    return entity ? new BlockMetricDto(entity) : null
  }

  @Query()
  async blockMetrics(@Args('limit') limit: number, @Args('page') page: number) {
    const entities = await this.blockMetricService.findBlockMetrics(limit, page)
    return entities.map(e => new BlockMetricDto(e))
  }
}
