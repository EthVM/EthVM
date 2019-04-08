import { Test } from '@nestjs/testing'
import { StatisticService } from './statistic.service'
import { StatisticResolvers } from './statistic.resolvers'
import { Duration, DurationService } from '../../shared/duration.service'
import { StatisticDto } from './statistic.dto'
import { AggregateBlockMetricEntity } from '../../orm/entities/aggregate-block-metric.entity'

const mockService = {
  async getTotalTxs(to, from) {},
  async getTotalSuccessfulTxs(to, from) {},
  async getAverageDifficulty(to, from) {},
  async getTotalFailedTxs(to, from) {},
  async getTotalGasPrice(to, from) {},
  async getAverageGasLimit(to, from) {},
  async getAverageGasPrice(to, from) {},
  async getTotalTxsFees(to, from) {},
  async getAverageTxFee(to, from) {},
  async getAverageMinerReward(to, from) {},
  async getAverageBlockTime(to, from) {},
  async getAverageHashRate(to, from) {}
}

const mockDurationService = {
  durationToDates(duration) {}
}

describe('StatisticResolvers', () => {

  let statisticService: StatisticService
  let statisticResolvers: StatisticResolvers
  let durationService: DurationService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        StatisticResolvers,
        {
          provide: StatisticService,
          useValue: mockService
        },
        {
          provide: DurationService,
          useValue: mockDurationService
        }
      ],
    }).compile()
    statisticService = module.get<StatisticService>(StatisticService)
    statisticResolvers = module.get<StatisticResolvers>(StatisticResolvers)
    durationService = module.get<DurationService>(DurationService)
  })

  const duration = Duration.ALL
  const to = new Date()
  const from = new Date(1970, 0, 1)
  const date = to.getMilliseconds()

  describe('totalTxs', () => {
    it('should return an array of StatisticDto instances with name "TotalTxs" and date within given duration', async () => {

      const result = {id: { name: 'TotalTxs', date }}
      jest.spyOn(statisticService, 'getTotalTxs')
        .mockImplementation(() => new Promise(resolve => {
          resolve([new AggregateBlockMetricEntity(result)])
        }))
      jest.spyOn(durationService, 'durationToDates')
        .mockImplementation(() => ({from, to}))

      expect(await statisticResolvers.totalTxs(duration)).toEqual([new StatisticDto(result)])
    })
  })

  describe('totalSuccessfulTxs', () => {
    it('should return an array of StatisticDto instances with name "TotalSuccessfulTxs" and date within given duration', async () => {

      const result = {id: { name: 'TotalSuccessfulTxs', date }}
      jest.spyOn(statisticService, 'getTotalSuccessfulTxs')
        .mockImplementation(() => new Promise(resolve => {
          resolve([new AggregateBlockMetricEntity(result)])
        }))
      jest.spyOn(durationService, 'durationToDates')
        .mockImplementation(() => ({from, to}))

      expect(await statisticResolvers.totalSuccessfulTxs(duration)).toEqual([new StatisticDto(result)])
    })
  })

  describe('averageDifficulty', () => {
    it('should return an array of StatisticDto instances with name "AvgDifficulty" and date within given duration', async () => {

      const result = {id: { name: 'AvgDifficulty', date }}
      jest.spyOn(statisticService, 'getAverageDifficulty')
        .mockImplementation(() => new Promise(resolve => {
          resolve([new AggregateBlockMetricEntity(result)])
        }))
      jest.spyOn(durationService, 'durationToDates')
        .mockImplementation(() => ({from, to}))

      expect(await statisticResolvers.averageDifficulty(duration)).toEqual([new StatisticDto(result)])
    })
  })

  describe('totalFailedTxs', () => {
    it('should return an array of StatisticDto instances with name "TotalFailedTxs" and date within given duration', async () => {

      const result = {id: { name: 'TotalFailedTxs', date }}
      jest.spyOn(statisticService, 'getTotalFailedTxs')
        .mockImplementation(() => new Promise(resolve => {
          resolve([new AggregateBlockMetricEntity(result)])
        }))
      jest.spyOn(durationService, 'durationToDates')
        .mockImplementation(() => ({from, to}))

      expect(await statisticResolvers.totalFailedTxs(duration)).toEqual([new StatisticDto(result)])
    })
  })

  describe('totalGasPrice', () => {
    it('should return an array of StatisticDto instances with name "AvgTotalGasPricePerBlock" and date within given duration', async () => {

      const result = {id: { name: 'AvgTotalGasPricePerBlock', date }}
      jest.spyOn(statisticService, 'getTotalGasPrice')
        .mockImplementation(() => new Promise(resolve => {
          resolve([new AggregateBlockMetricEntity(result)])
        }))
      jest.spyOn(durationService, 'durationToDates')
        .mockImplementation(() => ({from, to}))

      expect(await statisticResolvers.totalGasPrice(duration)).toEqual([new StatisticDto(result)])
    })
  })

  describe('averageGasLimit', () => {
    it('should return an array of StatisticDto instances with name "AvgGasLimitPerBlock" and date within given duration', async () => {

      const result = {id: { name: 'AvgGasLimitPerBlock', date }}
      jest.spyOn(statisticService, 'getAverageGasLimit')
        .mockImplementation(() => new Promise(resolve => {
          resolve([new AggregateBlockMetricEntity(result)])
        }))
      jest.spyOn(durationService, 'durationToDates')
        .mockImplementation(() => ({from, to}))

      expect(await statisticResolvers.averageGasLimit(duration)).toEqual([new StatisticDto(result)])
    })
  })

  describe('averageGasPrice', () => {
    it('should return an array of StatisticDto instances with name "AvgGasPricePerBlock" and date within given duration', async () => {

      const result = {id: { name: 'AvgGasPricePerBlock', date }}
      jest.spyOn(statisticService, 'getAverageGasPrice')
        .mockImplementation(() => new Promise(resolve => {
          resolve([new AggregateBlockMetricEntity(result)])
        }))
      jest.spyOn(durationService, 'durationToDates')
        .mockImplementation(() => ({from, to}))

      expect(await statisticResolvers.averageGasPrice(duration)).toEqual([new StatisticDto(result)])
    })
  })

  describe('totalTxsFees', () => {
    it('should return an array of StatisticDto instances with name "AvgTotalTxsFeesPerBlock" and date within given duration', async () => {

      const result = {id: { name: 'AvgTotalTxsFeesPerBlock', date }}
      jest.spyOn(statisticService, 'getTotalTxsFees')
        .mockImplementation(() => new Promise(resolve => {
          resolve([new AggregateBlockMetricEntity(result)])
        }))
      jest.spyOn(durationService, 'durationToDates')
        .mockImplementation(() => ({from, to}))

      expect(await statisticResolvers.totalTxsFees(duration)).toEqual([new StatisticDto(result)])
    })
  })

  describe('averageTxFee', () => {
    it('should return an array of StatisticDto instances with name "AvgTxFeePerBlock" and date within given duration', async () => {

      const result = {id: { name: 'AvgTxFeePerBlock', date }}
      jest.spyOn(statisticService, 'getAverageTxFee')
        .mockImplementation(() => new Promise(resolve => {
          resolve([new AggregateBlockMetricEntity(result)])
        }))
      jest.spyOn(durationService, 'durationToDates')
        .mockImplementation(() => ({from, to}))

      expect(await statisticResolvers.averageTxFee(duration)).toEqual([new StatisticDto(result)])
    })
  })

  describe('averageMinerReward', () => {
    it('should return an array of StatisticDto instances with name "AvgMinerRewardPerBlock" and date within given duration', async () => {

      const result = {id: { name: 'AvgMinerRewardPerBlock', date }}
      jest.spyOn(statisticService, 'getAverageMinerReward')
        .mockImplementation(() => new Promise(resolve => {
          resolve([new AggregateBlockMetricEntity(result)])
        }))
      jest.spyOn(durationService, 'durationToDates')
        .mockImplementation(() => ({from, to}))

      expect(await statisticResolvers.averageMinerReward(duration)).toEqual([new StatisticDto(result)])
    })
  })

  describe('averageBlockTime', () => {
    it('should return an array of StatisticDto instances with name "AvgBlockTime" and date within given duration', async () => {

      const result = {id: { name: 'AvgBlockTime', date }}
      jest.spyOn(statisticService, 'getAverageBlockTime')
        .mockImplementation(() => new Promise(resolve => {
          resolve([new AggregateBlockMetricEntity(result)])
        }))
      jest.spyOn(durationService, 'durationToDates')
        .mockImplementation(() => ({from, to}))

      expect(await statisticResolvers.averageBlockTime(duration)).toEqual([new StatisticDto(result)])
    })
  })

  describe('averageHashRate', () => {
    it('should return an array of StatisticDto instances with name "AvgHashRate" and date within given duration', async () => {

      const result = {id: { name: 'AvgHashRate', date }}
      jest.spyOn(statisticService, 'getAverageHashRate')
        .mockImplementation(() => new Promise(resolve => {
          resolve([new AggregateBlockMetricEntity(result)])
        }))
      jest.spyOn(durationService, 'durationToDates')
        .mockImplementation(() => ({from, to}))

      expect(await statisticResolvers.averageHashRate(duration)).toEqual([new StatisticDto(result)])
    })
  })

})
