import { Args, Query, Resolver } from '@nestjs/graphql'
import { BlockMetricService } from '@app/modules/block-metrics/block-metric.service'
import { BlockMetricDto } from '@app/modules/block-metrics/block-metric.dto'
import { ParseHashPipe } from '@app/shared/validation/parse-hash.pipe'
import { ParseLimitPipe } from '@app/shared/validation/parse-limit.pipe'

@Resolver('BlockMetric')
export class BlockMetricResolvers {
  constructor(private readonly blockMetricService: BlockMetricService) {}

  @Query()
  async blockMetricByHash(@Args('hash', ParseHashPipe) hash: string) {
    const entity = await this.blockMetricService.findBlockMetricByHash(hash)
    return entity ? new BlockMetricDto(entity) : null
  }

  @Query()
  async blockMetrics(@Args('limit', ParseLimitPipe) limit: number, @Args('page') page: number) {
    const entities = await this.blockMetricService.findBlockMetrics(limit, page)
    return entities.map(e => new BlockMetricDto(e))
  }
}
