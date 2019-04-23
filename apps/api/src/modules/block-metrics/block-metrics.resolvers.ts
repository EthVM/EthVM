import {Args, Query, Resolver} from '@nestjs/graphql'
import {BlockMetricsService} from '@app/modules/block-metrics/block-metrics.service';
import {Duration, DurationService} from '@app/shared/duration.service';
import {BlockMetricsDto} from '@app/modules/block-metrics/block-metrics.dto';

@Resolver('BlockMetric')
export class BlockMetricsResolvers {
  constructor(private readonly blockMetricsService: BlockMetricsService,
              private readonly durationService: DurationService) {}

  @Query()
  async blockMetricsByDay(@Args('duration') duration: Duration, @Args('fields') fields: string[]): Promise<BlockMetricsDto[]> {
    const { from, to } = this.durationService.durationToDates(duration)
    const entities = await this.blockMetricsService.findBlockMetricsDaily(from, to, fields)
    return entities.map(e => new BlockMetricsDto(e))
  }

  // @Subscription()
  // newBlockMetric() {
  //   // TODO use withFilter to filter by event type
  //   return {
  //     resolve: payload => {
  //       return new BlockMetricsDto(payload.value)
  //     },
  //     subscribe: () => this.pubSub.asyncIterator('block_metrics'),
  //   }
  // }
}
