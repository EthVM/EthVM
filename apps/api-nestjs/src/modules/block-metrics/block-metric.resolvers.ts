import { Args, Query, Resolver, Subscription } from '@nestjs/graphql'
import { BlockMetricService } from '@app/modules/block-metrics/block-metric.service'
import { BlockMetricDto } from '@app/modules/block-metrics/block-metric.dto'
import { ParseHashPipe } from '@app/shared/validation/parse-hash.pipe'
import { ParseLimitPipe } from '@app/shared/validation/parse-limit.pipe'
import { ParsePagePipe } from '@app/shared/validation/parse-page.pipe'
import { Inject } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'

@Resolver('BlockMetric')
export class BlockMetricResolvers {
  constructor(private readonly blockMetricService: BlockMetricService, @Inject('PUB_SUB') private pubSub: PubSub) {}

  @Query()
  async blockMetricByHash(@Args('hash', ParseHashPipe) hash: string) {
    const entity = await this.blockMetricService.findBlockMetricByHash(hash)
    return entity ? new BlockMetricDto(entity) : null
  }

  @Query()
  async blockMetrics(@Args('limit', ParseLimitPipe) limit: number, @Args('page', ParsePagePipe) page: number) {
    const entities = await this.blockMetricService.findBlockMetrics(limit, page)
    return entities.map(e => new BlockMetricDto(e))
  }

  @Subscription()
  newBlockMetric() {
    // TODO use withFilter to filter by event type
    return {
      resolve: payload => {
        return new BlockMetricDto(payload.value)
      },
      subscribe: () => this.pubSub.asyncIterator('blockMetrics')
    }
  }
}
