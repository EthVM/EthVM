import { Args, Query, Resolver } from '@nestjs/graphql'
import { StatisticService } from '@app/modules/statistics/statistic.service'
import { StatisticDto } from '@app/modules/statistics/statistic.dto'
import { Duration, DurationService } from '@app/shared/duration.service'

@Resolver('Statistic')
export class StatisticResolvers {
  constructor(private readonly statisticService: StatisticService, private readonly durationService: DurationService) {}

  @Query()
  async totalTxs(@Args('duration') duration: Duration) {
    const { from, to } = this.durationService.durationToDates(duration)
    const entities = await this.statisticService.getTotalTxs(from, to)
    return entities.map(e => new StatisticDto(e))
  }

  @Query()
  async totalSuccessfulTxs(@Args('duration') duration: Duration) {
    const { from, to } = this.durationService.durationToDates(duration)
    const entities = await this.statisticService.getTotalSuccessfulTxs(from, to)
    return entities.map(e => new StatisticDto(e))
  }

  @Query()
  async averageDifficulty(@Args('duration') duration: Duration) {
    const { from, to } = this.durationService.durationToDates(duration)
    const entities = await this.statisticService.getAverageDifficulty(from, to)
    return entities.map(e => new StatisticDto(e))
  }

  @Query()
  async totalFailedTxs(@Args('duration') duration: Duration) {
    const { from, to } = this.durationService.durationToDates(duration)
    const entities = await this.statisticService.getTotalFailedTxs(from, to)
    return entities.map(e => new StatisticDto(e))
  }

  @Query()
  async totalGasPrice(@Args('duration') duration: Duration) {
    const { from, to } = this.durationService.durationToDates(duration)
    const entities = await this.statisticService.getTotalGasPrice(from, to)
    return entities.map(e => new StatisticDto(e))
  }

  @Query()
  async averageGasLimit(@Args('duration') duration: Duration) {
    const { from, to } = this.durationService.durationToDates(duration)
    const entities = await this.statisticService.getAverageGasLimit(from, to)
    return entities.map(e => new StatisticDto(e))
  }

  @Query()
  async averageGasPrice(@Args('duration') duration: Duration) {
    const { from, to } = this.durationService.durationToDates(duration)
    const entities = await this.statisticService.getAverageGasPrice(from, to)
    return entities.map(e => new StatisticDto(e))
  }

  @Query()
  async totalTxsFees(@Args('duration') duration: Duration) {
    const { from, to } = this.durationService.durationToDates(duration)
    const entities = await this.statisticService.getTotalTxsFees(from, to)
    return entities.map(e => new StatisticDto(e))
  }

  @Query()
  async averageTxFee(@Args('duration') duration: Duration) {
    const { from, to } = this.durationService.durationToDates(duration)
    const entities = await this.statisticService.getAverageTxFee(from, to)
    return entities.map(e => new StatisticDto(e))
  }

  @Query()
  async averageMinerReward(@Args('duration') duration: Duration) {
    const { from, to } = this.durationService.durationToDates(duration)
    const entities = await this.statisticService.getAverageMinerReward(from, to)
    return entities.map(e => new StatisticDto(e))
  }

  @Query()
  async averageBlockTime(@Args('duration') duration: Duration) {
    const { from, to } = this.durationService.durationToDates(duration)
    const entities = await this.statisticService.getAverageBlockTime(from, to)
    return entities.map(e => new StatisticDto(e))
  }

  @Query()
  async averageHashRate(@Args('duration') duration: Duration) {
    const { from, to } = this.durationService.durationToDates(duration)
    const entities = await this.statisticService.getAverageHashRate(from, to)
    return entities.map(e => new StatisticDto(e))
  }
}
