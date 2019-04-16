import { Test } from '@nestjs/testing'
import { StatisticService } from './statistic.service'
import { StatisticResolvers } from './statistic.resolvers'
import { Duration, DurationService, StartEndInterface } from '../../shared/duration.service'
import { StatisticDto } from './statistic.dto'
import { AggregateBlockMetricEntity } from '../../orm/entities/aggregate-block-metric.entity'

const now = new Date()

const dateOne = new Date(now.getFullYear(), 0, 1)
const dateTwo = new Date(now.getFullYear(), now.getMonth())
const dateThree = new Date()
dateThree.setDate(now.getDate() - 7)
const dateFour = new Date()
dateFour.setDate(now.getDate() - 3)

const timeOne = dateOne.getTime()
const timeTwo = dateTwo.getTime()
const timeThree = dateThree.getTime()
const timeFour = dateFour.getTime()

const aggregateBlockMetrics = [
  { name: 'TotalTxs', int: 30, date: timeFour },
  { name: 'TotalTxs', int: 20, date: timeThree },
  { name: 'TotalTxs', int: 10, date: timeTwo },
  { name: 'TotalTxs', int: 0, date: timeOne },
  { name: 'TotalSuccessfulTxs', int: 27, date: timeFour },
  { name: 'TotalSuccessfulTxs', int: 17, date: timeThree },
  { name: 'TotalSuccessfulTxs', int: 9, date: timeTwo },
  { name: 'TotalSuccessfulTxs', int: 0, date: timeOne },
  { name: 'TotalFailedTxs', int: 3, date: timeFour },
  { name: 'TotalFailedTxs', int: 3, date: timeThree },
  { name: 'TotalFailedTxs', int: 1, date: timeTwo },
  { name: 'TotalFailedTxs', int: 0, date: timeOne },
  { name: 'AvgDifficulty', bigInteger: '1470838650662', date: timeOne },
  { name: 'AvgDifficulty', bigInteger: '1586123528941', date: timeTwo },
  { name: 'AvgDifficulty', bigInteger: '1709479787484', date: timeThree },
  { name: 'AvgDifficulty', bigInteger: '1837695763267', date: timeFour },
  { name: 'AvgTotalGasPricePerBlock', bigInteger: '38604871690', date: timeOne },
  { name: 'AvgTotalGasPricePerBlock', bigInteger: '197717485675', date: timeTwo },
  { name: 'AvgTotalGasPricePerBlock', bigInteger: '104392654600', date: timeThree },
  { name: 'AvgTotalGasPricePerBlock', bigInteger: '72534532631', date: timeFour },
  { name: 'AvgGasPricePerBlock', bigInteger: '38604871690', date: timeOne },
  { name: 'AvgGasPricePerBlock', bigInteger: '197717485675', date: timeTwo },
  { name: 'AvgGasPricePerBlock', bigInteger: '104392654600', date: timeThree },
  { name: 'AvgGasPricePerBlock', bigInteger: '72534532631', date: timeFour },
  { name: 'AvgGasLimitPerBlock', bigInteger: '14020', date: timeOne },
  { name: 'AvgGasLimitPerBlock', bigInteger: '64014', date: timeTwo },
  { name: 'AvgGasLimitPerBlock', bigInteger: '16201', date: timeThree },
  { name: 'AvgGasLimitPerBlock', bigInteger: '21207', date: timeFour },
  { name: 'AvgTotalTxsFeesPerBlock', bigInteger: '6062558728067045', date: timeOne },
  { name: 'AvgTotalTxsFeesPerBlock', bigInteger: '8092591774988115', date: timeTwo },
  { name: 'AvgTotalTxsFeesPerBlock', bigInteger: '1664608009475577', date: timeThree },
  { name: 'AvgTotalTxsFeesPerBlock', bigInteger: '4462449126956854', date: timeFour },
  { name: 'AvgTxFeePerBlock', bigInteger: '6062558728067045', date: timeOne },
  { name: 'AvgTxFeePerBlock', bigInteger: '8092591774988115', date: timeTwo },
  { name: 'AvgTxFeePerBlock', bigInteger: '1664608009475577', date: timeThree },
  { name: 'AvgTxFeePerBlock', bigInteger: '4462449126956854', date: timeFour },
  { name: 'AvgMinerRewardPerBlock', bigInteger: '6062558728067045', date: timeOne },
  { name: 'AvgMinerRewardPerBlock', bigInteger: '8092591774988115', date: timeTwo },
  { name: 'AvgMinerRewardPerBlock', bigInteger: '1664608009475577', date: timeThree },
  { name: 'AvgMinerRewardPerBlock', bigInteger: '4462449126956854', date: timeFour },
  { name: 'AvgBlockTime', long: 14, date: timeOne },
  { name: 'AvgBlockTime', long: 16, date: timeTwo },
  { name: 'AvgBlockTime', long: 20, date: timeThree },
  { name: 'AvgBlockTime', long: 32, date: timeFour },
  { name: 'AvgHashRate', double: 493307540000.39264, date: timeOne },
  { name: 'AvgHashRate', double: 590664697697.9985, date: timeTwo },
  { name: 'AvgHashRate', double: 609979945429.7275, date: timeThree },
  { name: 'AvgHashRate', double: 679213798489.1677, date: timeFour }
]

const mockService = {
  async getTotalTxs(start, end) {
    const items = this.filterMetrics('TotalTxs', start, end)
    return items.map(i => new AggregateBlockMetricEntity(i))
  },
  async getTotalSuccessfulTxs(start, end) {
    const items = this.filterMetrics('TotalSuccessfulTxs', start, end)
    return items.map(i => new AggregateBlockMetricEntity(i))
  },
  async getAverageDifficulty(start, end) {
    const items = this.filterMetrics('AvgDifficulty', start, end)
    return items.map(i => new AggregateBlockMetricEntity(i))
  },
  async getTotalFailedTxs(start, end) {
    const items = this.filterMetrics('TotalFailedTxs', start, end)
    return items.map(i => new AggregateBlockMetricEntity(i))
  },
  async getTotalGasPrice(start, end) {
    const items = this.filterMetrics('AvgTotalGasPricePerBlock', start, end)
    return items.map(i => new AggregateBlockMetricEntity(i))
  },
  async getAverageGasLimit(start, end) {
    const items = this.filterMetrics('AvgGasLimitPerBlock', start, end)
    return items.map(i => new AggregateBlockMetricEntity(i))
  },
  async getAverageGasPrice(start, end) {
    const items = this.filterMetrics('AvgGasPricePerBlock', start, end)
    return items.map(i => new AggregateBlockMetricEntity(i))
  },
  async getTotalTxsFees(start, end) {
    const items = this.filterMetrics('AvgTotalTxsFeesPerBlock', start, end)
    return items.map(i => new AggregateBlockMetricEntity(i))
  },
  async getAverageTxFee(start, end) {
    const items = this.filterMetrics('AvgTxFeePerBlock', start, end)
    return items.map(i => new AggregateBlockMetricEntity(i))
  },
  async getAverageMinerReward(start, end) {
    const items = this.filterMetrics('AvgMinerRewardPerBlock', start, end)
    return items.map(i => new AggregateBlockMetricEntity(i))
  },
  async getAverageBlockTime(start, end) {
    const items = this.filterMetrics('AvgBlockTime', start, end)
    return items.map(i => new AggregateBlockMetricEntity(i))
  },
  async getAverageHashRate(start, end) {
    const items = this.filterMetrics('AvgHashRate', start, end)
    return items.map(i => new AggregateBlockMetricEntity(i))
  },
  filterMetrics(name, start, end) {
    return aggregateBlockMetrics.filter(a => {
      return a.name === name && a.date >= start.getTime() && a.date <= end.getTime()
    })
  }
}

describe('StatisticResolvers', () => {
  let statisticService: StatisticService
  let statisticResolvers: StatisticResolvers
  let durationService: DurationService

  beforeEach(async () => {
    // Test module
    const module = await Test.createTestingModule({
      providers: [
        StatisticResolvers,
        {
          provide: StatisticService,
          useValue: mockService
        },
        DurationService
      ]
    }).compile()

    // Fetch dependencies
    statisticService = module.get<StatisticService>(StatisticService)
    statisticResolvers = module.get<StatisticResolvers>(StatisticResolvers)
    durationService = module.get<DurationService>(DurationService)
  })

  describe('totalTxs', () => {
    it('should return an array of StatisticDto instances with name "TotalTxs"', async () => {
      const totalTxs = await statisticResolvers.totalTxs(Duration.ALL)

      expect(totalTxs).toHaveLength(4)
      expect(totalTxs[0]).toHaveProperty('name', 'TotalTxs')
      expect(totalTxs[1]).toHaveProperty('name', 'TotalTxs')
      expect(totalTxs[2]).toHaveProperty('name', 'TotalTxs')
      expect(totalTxs[3]).toHaveProperty('name', 'TotalTxs')
      expect(totalTxs[0]).toBeInstanceOf(StatisticDto)
    })

    it('should only return StatisticDto instances with dates within the given duration', async () => {
      const totalTxsWeek = await statisticResolvers.totalTxs(Duration.WEEK)
      expect(totalTxsWeek).toHaveLength(2)

      const totalTxsMonth = await statisticResolvers.totalTxs(Duration.MONTH)
      expect(totalTxsMonth).toHaveLength(3)

      const totalTxsYear = await statisticResolvers.totalTxs(Duration.YEAR)
      expect(totalTxsYear).toHaveLength(4)
    })

    it('should return an empty array when there are no AggregateBlockMetrics with name "TotalTxs" with dates within the given duration', async () => {
      const totalTxsDay = await statisticResolvers.totalTxs(Duration.DAY)
      expect(totalTxsDay).toHaveLength(0)
    })
  })

  describe('totalSuccessfulTxs', () => {
    it('should return an array of StatisticDto instances with name "TotalSuccessfulTxs"', async () => {
      const totalSuccessfulTxs = await statisticResolvers.totalSuccessfulTxs(Duration.ALL)

      expect(totalSuccessfulTxs).toHaveLength(4)
      expect(totalSuccessfulTxs[0]).toHaveProperty('name', 'TotalSuccessfulTxs')
      expect(totalSuccessfulTxs[1]).toHaveProperty('name', 'TotalSuccessfulTxs')
      expect(totalSuccessfulTxs[2]).toHaveProperty('name', 'TotalSuccessfulTxs')
      expect(totalSuccessfulTxs[3]).toHaveProperty('name', 'TotalSuccessfulTxs')
      expect(totalSuccessfulTxs[0]).toBeInstanceOf(StatisticDto)
    })

    it('should only return StatisticDto instances with dates within the given duration', async () => {
      const totalSuccessfulTxsWeek = await statisticResolvers.totalSuccessfulTxs(Duration.WEEK)
      expect(totalSuccessfulTxsWeek).toHaveLength(2)

      const totalSuccessfulTxsMonth = await statisticResolvers.totalSuccessfulTxs(Duration.MONTH)
      expect(totalSuccessfulTxsMonth).toHaveLength(3)

      const totalSuccessfulTxsYear = await statisticResolvers.totalSuccessfulTxs(Duration.YEAR)
      expect(totalSuccessfulTxsYear).toHaveLength(4)
    })

    it('should return an empty array when there are no AggregateBlockMetrics with name "TotalSuccessfulTxs" with dates within the given duration', async () => {
      const totalSuccessfulTxsDay = await statisticResolvers.totalSuccessfulTxs(Duration.DAY)
      expect(totalSuccessfulTxsDay).toHaveLength(0)
    })
  })

  describe('averageDifficulty', () => {
    it('should return an array of StatisticDto instances with name "AvgDifficulty"', async () => {
      const avgDifficulty = await statisticResolvers.averageDifficulty(Duration.ALL)

      expect(avgDifficulty).toHaveLength(4)
      expect(avgDifficulty[0]).toHaveProperty('name', 'AvgDifficulty')
      expect(avgDifficulty[1]).toHaveProperty('name', 'AvgDifficulty')
      expect(avgDifficulty[2]).toHaveProperty('name', 'AvgDifficulty')
      expect(avgDifficulty[3]).toHaveProperty('name', 'AvgDifficulty')
      expect(avgDifficulty[0]).toBeInstanceOf(StatisticDto)
    })

    it('should only return StatisticDto instances with dates within the given duration', async () => {
      const avgDifficultyWeek = await statisticResolvers.averageDifficulty(Duration.WEEK)
      expect(avgDifficultyWeek).toHaveLength(2)

      const avgDifficultyMonth = await statisticResolvers.averageDifficulty(Duration.MONTH)
      expect(avgDifficultyMonth).toHaveLength(3)

      const avgDifficultyYear = await statisticResolvers.averageDifficulty(Duration.YEAR)
      expect(avgDifficultyYear).toHaveLength(4)
    })

    it('should return an empty array when there are no AggregateBlockMetrics with name "AvgDifficulty" with dates within the given duration', async () => {
      const avgDifficultyDay = await statisticResolvers.averageDifficulty(Duration.DAY)
      expect(avgDifficultyDay).toHaveLength(0)
    })
  })

  describe('totalFailedTxs', () => {
    it('should return an array of StatisticDto instances with name "TotalFailedTxs"', async () => {
      const totalFailedTxs = await statisticResolvers.totalFailedTxs(Duration.ALL)

      expect(totalFailedTxs).toHaveLength(4)
      expect(totalFailedTxs[0]).toHaveProperty('name', 'TotalFailedTxs')
      expect(totalFailedTxs[1]).toHaveProperty('name', 'TotalFailedTxs')
      expect(totalFailedTxs[2]).toHaveProperty('name', 'TotalFailedTxs')
      expect(totalFailedTxs[3]).toHaveProperty('name', 'TotalFailedTxs')
      expect(totalFailedTxs[0]).toBeInstanceOf(StatisticDto)
    })

    it('should only return StatisticDto instances with dates within the given duration', async () => {
      const totalFailedTxsWeek = await statisticResolvers.totalFailedTxs(Duration.WEEK)
      expect(totalFailedTxsWeek).toHaveLength(2)

      const totalFailedTxsMonth = await statisticResolvers.totalFailedTxs(Duration.MONTH)
      expect(totalFailedTxsMonth).toHaveLength(3)

      const totalFailedTxsYear = await statisticResolvers.totalFailedTxs(Duration.YEAR)
      expect(totalFailedTxsYear).toHaveLength(4)
    })

    it('should return an empty array when there are no AggregateBlockMetrics with name "TotalFailedTxs" with dates within the given duration', async () => {
      const totalFailedTxsDay = await statisticResolvers.totalFailedTxs(Duration.DAY)
      expect(totalFailedTxsDay).toHaveLength(0)
    })
  })

  describe('totalGasPrice', () => {
    it('should return an array of StatisticDto instances with name "AvgTotalGasPricePerBlock"', async () => {
      const totalGasPrice = await statisticResolvers.totalGasPrice(Duration.ALL)

      expect(totalGasPrice).toHaveLength(4)
      expect(totalGasPrice[0]).toHaveProperty('name', 'AvgTotalGasPricePerBlock')
      expect(totalGasPrice[1]).toHaveProperty('name', 'AvgTotalGasPricePerBlock')
      expect(totalGasPrice[2]).toHaveProperty('name', 'AvgTotalGasPricePerBlock')
      expect(totalGasPrice[3]).toHaveProperty('name', 'AvgTotalGasPricePerBlock')
      expect(totalGasPrice[0]).toBeInstanceOf(StatisticDto)
    })

    it('should only return StatisticDto instances with dates within the given duration', async () => {
      const totalGasPriceWeek = await statisticResolvers.totalGasPrice(Duration.WEEK)
      expect(totalGasPriceWeek).toHaveLength(2)

      const totalGasPriceMonth = await statisticResolvers.totalGasPrice(Duration.MONTH)
      expect(totalGasPriceMonth).toHaveLength(3)

      const totalGasPriceYear = await statisticResolvers.totalGasPrice(Duration.YEAR)
      expect(totalGasPriceYear).toHaveLength(4)
    })

    it('should return an empty array when there are no AggregateBlockMetrics with name "AvgTotalGasPricePerBlock" with dates within the given duration', async () => {
      const totalGasPriceDay = await statisticResolvers.totalGasPrice(Duration.DAY)
      expect(totalGasPriceDay).toHaveLength(0)
    })
  })

  describe('averageGasLimit', () => {
    it('should return an array of StatisticDto instances with name "AvgGasLimitPerBlock"', async () => {
      const averageGasLimit = await statisticResolvers.averageGasLimit(Duration.ALL)

      expect(averageGasLimit).toHaveLength(4)
      expect(averageGasLimit[0]).toHaveProperty('name', 'AvgGasLimitPerBlock')
      expect(averageGasLimit[1]).toHaveProperty('name', 'AvgGasLimitPerBlock')
      expect(averageGasLimit[2]).toHaveProperty('name', 'AvgGasLimitPerBlock')
      expect(averageGasLimit[3]).toHaveProperty('name', 'AvgGasLimitPerBlock')
      expect(averageGasLimit[0]).toBeInstanceOf(StatisticDto)
    })

    it('should only return StatisticDto instances with dates within the given duration', async () => {
      const averageGasLimitWeek = await statisticResolvers.averageGasLimit(Duration.WEEK)
      expect(averageGasLimitWeek).toHaveLength(2)

      const averageGasLimitMonth = await statisticResolvers.averageGasLimit(Duration.MONTH)
      expect(averageGasLimitMonth).toHaveLength(3)

      const averageGasLimitYear = await statisticResolvers.averageGasLimit(Duration.YEAR)
      expect(averageGasLimitYear).toHaveLength(4)
    })

    it('should return an empty array when there are no AggregateBlockMetrics with name "AvgGasLimitPerBlock" with dates within the given duration', async () => {
      const averageGasLimitDay = await statisticResolvers.averageGasLimit(Duration.DAY)
      expect(averageGasLimitDay).toHaveLength(0)
    })
  })

  describe('averageGasPrice', () => {
    it('should return an array of StatisticDto instances with name "AvgGasPricePerBlock"', async () => {
      const averageGasPrice = await statisticResolvers.averageGasPrice(Duration.ALL)

      expect(averageGasPrice).toHaveLength(4)
      expect(averageGasPrice[0]).toHaveProperty('name', 'AvgGasPricePerBlock')
      expect(averageGasPrice[1]).toHaveProperty('name', 'AvgGasPricePerBlock')
      expect(averageGasPrice[2]).toHaveProperty('name', 'AvgGasPricePerBlock')
      expect(averageGasPrice[3]).toHaveProperty('name', 'AvgGasPricePerBlock')
      expect(averageGasPrice[0]).toBeInstanceOf(StatisticDto)
    })

    it('should only return StatisticDto instances with dates within the given duration', async () => {
      const averageGasPriceWeek = await statisticResolvers.averageGasPrice(Duration.WEEK)
      expect(averageGasPriceWeek).toHaveLength(2)

      const averageGasPriceMonth = await statisticResolvers.averageGasPrice(Duration.MONTH)
      expect(averageGasPriceMonth).toHaveLength(3)

      const averageGasPriceYear = await statisticResolvers.averageGasPrice(Duration.YEAR)
      expect(averageGasPriceYear).toHaveLength(4)
    })

    it('should return an empty array when there are no AggregateBlockMetrics with name "AvgGasPricePerBlock" with dates within the given duration', async () => {
      const averageGasPriceDay = await statisticResolvers.averageGasPrice(Duration.DAY)
      expect(averageGasPriceDay).toHaveLength(0)
    })
  })

  describe('totalTxsFees', () => {
    it('should return an array of StatisticDto instances with name "AvgTotalTxsFeesPerBlock"', async () => {
      const totalTxsFees = await statisticResolvers.totalTxsFees(Duration.ALL)

      expect(totalTxsFees).toHaveLength(4)
      expect(totalTxsFees[0]).toHaveProperty('name', 'AvgTotalTxsFeesPerBlock')
      expect(totalTxsFees[1]).toHaveProperty('name', 'AvgTotalTxsFeesPerBlock')
      expect(totalTxsFees[2]).toHaveProperty('name', 'AvgTotalTxsFeesPerBlock')
      expect(totalTxsFees[3]).toHaveProperty('name', 'AvgTotalTxsFeesPerBlock')
      expect(totalTxsFees[0]).toBeInstanceOf(StatisticDto)
    })

    it('should only return StatisticDto instances with dates within the given duration', async () => {
      const totalTxsFeesWeek = await statisticResolvers.totalTxsFees(Duration.WEEK)
      expect(totalTxsFeesWeek).toHaveLength(2)

      const totalTxsFeesMonth = await statisticResolvers.totalTxsFees(Duration.MONTH)
      expect(totalTxsFeesMonth).toHaveLength(3)

      const totalTxsFeesYear = await statisticResolvers.totalTxsFees(Duration.YEAR)
      expect(totalTxsFeesYear).toHaveLength(4)
    })

    it('should return an empty array when there are no AggregateBlockMetrics with name "AvgTotalTxsFeesPerBlock" with dates within the given duration', async () => {
      const totalTxsFeesDay = await statisticResolvers.totalTxsFees(Duration.DAY)
      expect(totalTxsFeesDay).toHaveLength(0)
    })
  })

  describe('averageTxFee', () => {
    it('should return an array of StatisticDto instances with name "AvgTxFeePerBlock"', async () => {
      const averageTxFee = await statisticResolvers.averageTxFee(Duration.ALL)

      expect(averageTxFee).toHaveLength(4)
      expect(averageTxFee[0]).toHaveProperty('name', 'AvgTxFeePerBlock')
      expect(averageTxFee[1]).toHaveProperty('name', 'AvgTxFeePerBlock')
      expect(averageTxFee[2]).toHaveProperty('name', 'AvgTxFeePerBlock')
      expect(averageTxFee[3]).toHaveProperty('name', 'AvgTxFeePerBlock')
      expect(averageTxFee[0]).toBeInstanceOf(StatisticDto)
    })

    it('should only return StatisticDto instances with dates within the given duration', async () => {
      const averageTxFeeWeek = await statisticResolvers.averageTxFee(Duration.WEEK)
      expect(averageTxFeeWeek).toHaveLength(2)

      const averageTxFeeMonth = await statisticResolvers.averageTxFee(Duration.MONTH)
      expect(averageTxFeeMonth).toHaveLength(3)

      const averageTxFeeYear = await statisticResolvers.averageTxFee(Duration.YEAR)
      expect(averageTxFeeYear).toHaveLength(4)
    })

    it('should return an empty array when there are no AggregateBlockMetrics with name "AvgTxFeePerBlock" with dates within the given duration', async () => {
      const averageTxFeeDay = await statisticResolvers.averageTxFee(Duration.DAY)
      expect(averageTxFeeDay).toHaveLength(0)
    })
  })

  describe('averageMinerReward', () => {
    it('should return an array of StatisticDto instances with name "AvgMinerRewardPerBlock"', async () => {
      const averageMinerReward = await statisticResolvers.averageMinerReward(Duration.ALL)

      expect(averageMinerReward).toHaveLength(4)
      expect(averageMinerReward[0]).toHaveProperty('name', 'AvgMinerRewardPerBlock')
      expect(averageMinerReward[1]).toHaveProperty('name', 'AvgMinerRewardPerBlock')
      expect(averageMinerReward[2]).toHaveProperty('name', 'AvgMinerRewardPerBlock')
      expect(averageMinerReward[3]).toHaveProperty('name', 'AvgMinerRewardPerBlock')
      expect(averageMinerReward[0]).toBeInstanceOf(StatisticDto)
    })

    it('should only return StatisticDto instances with dates within the given duration', async () => {
      const averageMinerRewardWeek = await statisticResolvers.averageMinerReward(Duration.WEEK)
      expect(averageMinerRewardWeek).toHaveLength(2)

      const averageMinerRewardMonth = await statisticResolvers.averageMinerReward(Duration.MONTH)
      expect(averageMinerRewardMonth).toHaveLength(3)

      const averageMinerRewardYear = await statisticResolvers.averageMinerReward(Duration.YEAR)
      expect(averageMinerRewardYear).toHaveLength(4)
    })

    it('should return an empty array when there are no AggregateBlockMetrics with name "AvgMinerRewardPerBlock" with dates within the given duration', async () => {
      const averageMinerRewardDay = await statisticResolvers.averageMinerReward(Duration.DAY)
      expect(averageMinerRewardDay).toHaveLength(0)
    })
  })

  describe('averageBlockTime', () => {
    it('should return an array of StatisticDto instances with name "AvgBlockTime"', async () => {
      const averageBlockTime = await statisticResolvers.averageBlockTime(Duration.ALL)

      expect(averageBlockTime).toHaveLength(4)
      expect(averageBlockTime[0]).toHaveProperty('name', 'AvgBlockTime')
      expect(averageBlockTime[1]).toHaveProperty('name', 'AvgBlockTime')
      expect(averageBlockTime[2]).toHaveProperty('name', 'AvgBlockTime')
      expect(averageBlockTime[3]).toHaveProperty('name', 'AvgBlockTime')
      expect(averageBlockTime[0]).toBeInstanceOf(StatisticDto)
    })

    it('should only return StatisticDto instances with dates within the given duration', async () => {
      const averageBlockTimeWeek = await statisticResolvers.averageBlockTime(Duration.WEEK)
      expect(averageBlockTimeWeek).toHaveLength(2)

      const averageBlockTimeMonth = await statisticResolvers.averageBlockTime(Duration.MONTH)
      expect(averageBlockTimeMonth).toHaveLength(3)

      const averageBlockTimeYear = await statisticResolvers.averageBlockTime(Duration.YEAR)
      expect(averageBlockTimeYear).toHaveLength(4)
    })

    it('should return an empty array when there are no AggregateBlockMetrics with name "AvgBlockTime" with dates within the given duration', async () => {
      const averageBlockTimeDay = await statisticResolvers.averageBlockTime(Duration.DAY)
      expect(averageBlockTimeDay).toHaveLength(0)
    })
  })

  describe('averageHashRate', () => {
    it('should return an array of StatisticDto instances with name "AvgHashRate"', async () => {
      const averageHashRate = await statisticResolvers.averageHashRate(Duration.ALL)

      expect(averageHashRate).toHaveLength(4)
      expect(averageHashRate[0]).toHaveProperty('name', 'AvgHashRate')
      expect(averageHashRate[1]).toHaveProperty('name', 'AvgHashRate')
      expect(averageHashRate[2]).toHaveProperty('name', 'AvgHashRate')
      expect(averageHashRate[3]).toHaveProperty('name', 'AvgHashRate')
      expect(averageHashRate[0]).toBeInstanceOf(StatisticDto)
    })

    it('should only return StatisticDto instances with dates within the given duration', async () => {
      const averageHashRateWeek = await statisticResolvers.averageHashRate(Duration.WEEK)
      expect(averageHashRateWeek).toHaveLength(2)

      const averageHashRateMonth = await statisticResolvers.averageHashRate(Duration.MONTH)
      expect(averageHashRateMonth).toHaveLength(3)

      const averageHashRateYear = await statisticResolvers.averageHashRate(Duration.YEAR)
      expect(averageHashRateYear).toHaveLength(4)
    })

    it('should return an empty array when there are no AggregateBlockMetrics with name "AvgHashRate" with dates within the given duration', async () => {
      const averageHashRateDay = await statisticResolvers.averageHashRate(Duration.DAY)
      expect(averageHashRateDay).toHaveLength(0)
    })
  })
})
