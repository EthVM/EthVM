import { Test } from '@nestjs/testing'
import { EthService } from '../../shared/eth.service'
import { BlockMetricsResolvers } from './block-metrics.resolvers'
import { BlockMetricEntity } from '../../orm/entities/block-metric.entity'
import { PubSub } from 'graphql-subscriptions'
import { BlockMetricsService } from '../../dao/block-metrics.service'
import { BlockMetricDto } from './dto/block-metric.dto'
import { AggregateBlockMetric, BlockMetricField, TimeBucket } from '../schema'
import { AggregateBlockMetricDto } from './dto/aggregate-block-metric.dto'

const hashOne = '0x0000000000000000000000000000000000000000000000000000000000000001'
const hashTwo = '0x0000000000000000000000000000000000000000000000000000000000000002'
const hashThree = '0x0000000000000000000000000000000000000000000000000000000000000003'
const hashFour = '0x0000000000000000000000000000000000000000000000000000000000000004'
const hashFive = '0x0000000000000000000000000000000000000000000000000000000000000005'
const hashSix = '0x0000000000000000000000000000000000000000000000000000000000000006'
const hashSeven = '0x0000000000000000000000000000000000000000000000000000000000000007'
const hashEight = '0x0000000000000000000000000000000000000000000000000000000000000008'
const hashNine = '0x0000000000000000000000000000000000000000000000000000000000000009'
const hashTen = '0x00000000000000000000000000000000000000000000000000000000000000010'

const blockMetrics = [
  { id: 1, hash: hashOne },
  { id: 2, hash: hashTwo },
  { id: 3, hash: hashThree },
  { id: 4, hash: hashFour },
  { id: 5, hash: hashFive },
  { id: 6, hash: hashSix },
  { id: 7, hash: hashSeven },
  { id: 8, hash: hashEight },
  { id: 9, hash: hashNine },
  { id: 10, hash: hashTen }
]

const aggregateBlockMetricsHour = [
  {
    time: 1556668800,
    avg_block_time: 12,
    avg_difficulty: 466002708
  },
  {
    time: 1556672400,
    avg_block_time: 13,
    avg_difficulty: 466002708
  },
  {
    time: 1556676000,
    avg_block_time: 10,
    avg_difficulty: 466002708
  },
  {
    time: 1556679600,
    avg_block_time: 20,
    avg_difficulty: 466002708
  },
  {
    time: 1556683200,
    avg_block_time: 9,
    avg_difficulty: 466002708
  },
  {
    time: 1556686800,
    avg_block_time: 15,
    avg_difficulty: 466002708
  },
  {
    time: 1556690400,
    avg_block_time: 12,
    avg_difficulty: 466002708
  },
  {
    time: 1556694000,
    avg_block_time: 12,
    avg_difficulty: 466002708
  },
  {
    time: 1556697600,
    avg_block_time: 14,
    avg_difficulty: 466002708
  },
  {
    time: 1556701200,
    avg_block_time: 12,
    avg_difficulty: 466002708
  },
  {
    time: 1556704800,
    avg_block_time: 10,
    avg_difficulty: 466002708
  },
  {
    time: 1556708400,
    avg_block_time: 20,
    avg_difficulty: 466002708
  },
  {
    time: 1556712000,
    avg_block_time: 22,
    avg_difficulty: 466002708
  },
  {
    time: 1556715600,
    avg_block_time: 19,
    avg_difficulty: 466002708
  },
  {
    time: 1556719200,
    avg_block_time: 14,
    avg_difficulty: 466002708
  },
  {
    time: 1556722800,
    avg_block_time: 20,
    avg_difficulty: 466002708
  },
  {
    time: 1556726400,
    avg_block_time: 18,
    avg_difficulty: 466002708
  },
  {
    time: 1556730000,
    avg_block_time: 21,
    avg_difficulty: 466002708
  },
  {
    time: 1556733600,
    avg_block_time: 15,
    avg_difficulty: 466002708
  },
  {
    time: 1556737200,
    avg_block_time: 16,
    avg_difficulty: 466002708
  },
  {
    time: 1556740800,
    avg_block_time: 18,
    avg_difficulty: 466002708
  },
  {
    time: 1556744400,
    avg_block_time: 12,
    avg_difficulty: 466002708
  },
  {
    time: 1556748000,
    avg_block_time: 10,
    avg_difficulty: 466002708
  },
  {
    time: 1556751600,
    avg_block_time: 9,
    avg_difficulty: 466002708
  }
]

const aggregateBlockMetricsDay = [
  {
    time: 1556668800,
    avg_block_time: 13,
    avg_num_uncles: 1,
    avg_difficulty: 465545966,
    avg_total_difficulty: 63418040887724,
    avg_gas_limit: 424248
  },
  {
    time: 1556755200,
    avg_block_time: 14,
    avg_num_uncles: 1.2,
    avg_difficulty: 465318759,
    avg_total_difficulty: 63417110022999,
    avg_gas_limit: 1089503
  },
  {
    time: 1556841600,
    avg_block_time: 11,
    avg_num_uncles: 0.9,
    avg_difficulty: 465091663,
    avg_total_difficulty: 63417575341758,
    avg_gas_limit: 534072
  },
  {
    time: 1556928000,
    avg_block_time: 17,
    avg_num_uncles: 1.1,
    avg_difficulty: 464864678,
    avg_total_difficulty: 63416644931336,
    avg_gas_limit: 0
  },
  {
    time: 1557014400,
    avg_block_time: 12,
    avg_num_uncles: 1.3,
    avg_difficulty: 464637804,
    avg_total_difficulty: 63416180066658,
    avg_gas_limit: 940000
  }
]

const mockService = {
  async find(offset: number = 0, limit: number = 10): Promise<[BlockMetricEntity[], number]> {
    const end = offset + limit
    const allBlockMetrics = Object.values(blockMetrics)
    const items = allBlockMetrics.slice(offset, end)
    return [items.map(i => new BlockMetricEntity(i)), allBlockMetrics.length]
  },
  async timeseries(start: Date, end: Date, bucket: TimeBucket, fields: BlockMetricField[],): Promise<AggregateBlockMetric[]> {

    // Default to "ONE_DAY" if no "ONE_HOUR" for purpose of testing
    const collection = bucket === TimeBucket.ONE_HOUR ? aggregateBlockMetricsHour : aggregateBlockMetricsDay

    const items = collection.filter(c => c.time >= (start.getTime() / 1000) && c.time <= (end.getTime() / 1000))

    return items.map(i => {
      const res = { timestamp: i.time } as AggregateBlockMetric
      if (fields.includes(BlockMetricField.AVG_BLOCK_TIME)) {
        res.avgBlockTime = i.avg_block_time
      }
      if (fields.includes(BlockMetricField.AVG_DIFFICULTY)) {
        res.avgDifficulty = i.avg_difficulty
      }
      return res
    })

  }
}

describe('BlockMetricResolvers', () => {
  let blockMetricsService: BlockMetricsService
  let blockMetricResolvers: BlockMetricsResolvers

  beforeEach(async () => {
    // test module
    const module = await Test.createTestingModule({
      providers: [
        BlockMetricsResolvers,
        EthService,
        {
          provide: 'PUB_SUB',
          useValue: new PubSub()
        },
        {
          provide: BlockMetricsService,
          useValue: mockService
        }
      ]
    }).compile()

    // fetch dependencies
    blockMetricsService = module.get<BlockMetricsService>(BlockMetricsService)
    blockMetricResolvers = module.get<BlockMetricsResolvers>(BlockMetricsResolvers)
  })

  describe('blockMetrics', () => {
    it('should return a page of BlockMetricsDto instances, respecting given offset and limit parameters, with total count', async () => {
      const blockMetricsPageOne = await blockMetricResolvers.blockMetrics(0, 5)

      expect(blockMetricsPageOne).not.toBeNull()
      const {items, totalCount} = blockMetricsPageOne

      expect(items).toHaveLength(5)
      expect(items[0]).toHaveProperty('id', 1)
      expect(items[4]).toHaveProperty('id', 5)
      expect(totalCount).toBe(10)

      const blockMetricsPageTwo = await blockMetricResolvers.blockMetrics(5, 5)
      expect(blockMetricsPageTwo).not.toBeNull()
      const itemsTwo = blockMetricsPageTwo.items
      const totalCountTwo = blockMetricsPageTwo.totalCount
      expect(itemsTwo).toHaveLength(5)
      expect(itemsTwo[0]).toHaveProperty('id', 6)
      expect(itemsTwo[4]).toHaveProperty('id', 10)
      expect(totalCountTwo).toBe(10)

      // Check an empty array is returned if no items available for requested page
      const blockMetricsPageThree = await blockMetricResolvers.blockMetrics(10, 10)
      expect(blockMetricsPageThree).not.toBeNull()
      const itemsThree = blockMetricsPageThree.items
      const totalCountThree = blockMetricsPageThree.totalCount
      expect(itemsThree).toHaveLength(0)
      expect(totalCountThree).toBe(10)
    })

    it('should convert an array of BlockMetricEntity instances to an array of BlockMetricsDto instances', async () => {
      const blockMetricsPage = await blockMetricResolvers.blockMetrics(0, 10)

      expect(blockMetricsPage).not.toBeNull()

      const expected = [
        new BlockMetricDto({id: 1, hash: hashOne}),
        new BlockMetricDto({id: 2, hash: hashTwo}),
        new BlockMetricDto({id: 3, hash: hashThree}),
        new BlockMetricDto({id: 4, hash: hashFour}),
        new BlockMetricDto({id: 5, hash: hashFive}),
        new BlockMetricDto({id: 6, hash: hashSix}),
        new BlockMetricDto({id: 7, hash: hashSeven}),
        new BlockMetricDto({id: 8, hash: hashEight}),
        new BlockMetricDto({id: 9, hash: hashNine}),
        new BlockMetricDto({id: 10, hash: hashTen})
      ]
      expect(blockMetricsPage.items).toEqual(expect.arrayContaining(expected))
    })
  })

  describe('blockMetricsTimeseries', () => {

    it ('should return an array of AggregateBlockMetricDto with time between start and end parameters', async () => {

      const aggregateBlockMetrics = await blockMetricResolvers.blockMetricsTimeseries(
        new Date(1556668800000),
        new Date(1556708400000),
        TimeBucket.ONE_HOUR,
        [BlockMetricField.AVG_BLOCK_TIME])

      expect(aggregateBlockMetrics).not.toBeNull()
      expect(aggregateBlockMetrics).toHaveLength(12)

      expect(aggregateBlockMetrics[0]).toHaveProperty('timestamp')
      expect(aggregateBlockMetrics[0].timestamp).toBeGreaterThanOrEqual(1556668800)
      expect(aggregateBlockMetrics[0].timestamp).toBeLessThanOrEqual(1556708400)

      expect(aggregateBlockMetrics[11]).toHaveProperty('timestamp')
      expect(aggregateBlockMetrics[11].timestamp).toBeGreaterThanOrEqual(1556668800)
      expect(aggregateBlockMetrics[11].timestamp).toBeLessThanOrEqual(1556708400)

      expect(aggregateBlockMetrics[0]).toBeInstanceOf(AggregateBlockMetricDto)
      expect(aggregateBlockMetrics[11]).toBeInstanceOf(AggregateBlockMetricDto)

    })

    it ('should return only the fields requested and timestamp', async () => {

      const aggregateBlockMetrics = await blockMetricResolvers.blockMetricsTimeseries(
        new Date(1556668800000),
        new Date(1557014400000),
        TimeBucket.ONE_DAY,
        [BlockMetricField.AVG_BLOCK_TIME]
      )

      expect(aggregateBlockMetrics).not.toBeNull()
      expect(aggregateBlockMetrics).toHaveLength(5)

      expect(aggregateBlockMetrics[0]).toHaveProperty('timestamp')
      expect(aggregateBlockMetrics[0]).toHaveProperty('avgBlockTime')
      expect(aggregateBlockMetrics[0]).not.toHaveProperty('avgNumUncles')
      expect(aggregateBlockMetrics[0]).not.toHaveProperty('avgDifficulty')
      expect(aggregateBlockMetrics[0]).not.toHaveProperty('avgTotalDifficulty')
      expect(aggregateBlockMetrics[0]).not.toHaveProperty('avgGasLimit')

      const aggregateBlockMetricsTwo = await blockMetricResolvers.blockMetricsTimeseries(
        new Date(1556668800000),
        new Date(1557014400000),
        TimeBucket.ONE_DAY,
        [BlockMetricField.AVG_BLOCK_TIME, BlockMetricField.AVG_DIFFICULTY]
      )

      expect(aggregateBlockMetricsTwo).not.toBeNull()
      expect(aggregateBlockMetricsTwo).toHaveLength(5)

      expect(aggregateBlockMetricsTwo[0]).toHaveProperty('timestamp')
      expect(aggregateBlockMetricsTwo[0]).toHaveProperty('avgBlockTime')
      expect(aggregateBlockMetricsTwo[0]).toHaveProperty('avgDifficulty')
      expect(aggregateBlockMetricsTwo[0]).not.toHaveProperty('avgNumUncles')
      expect(aggregateBlockMetricsTwo[0]).not.toHaveProperty('avgTotalDifficulty')
      expect(aggregateBlockMetricsTwo[0]).not.toHaveProperty('avgGasLimit')

    })

    it ('should return stats aggregated by the given Bucket parameter', async () => {

      const aggregateBlockMetrics = await blockMetricResolvers.blockMetricsTimeseries(
        new Date(1556668800000),
        new Date(1557014400000),
        TimeBucket.ONE_DAY,
        [BlockMetricField.AVG_BLOCK_TIME]
      )

      expect(aggregateBlockMetrics).not.toBeNull()
      expect(aggregateBlockMetrics).toHaveLength(5)

      const start = 1556668800
      const daySeconds = 86400
      expect(aggregateBlockMetrics[0]).toHaveProperty('timestamp', start)
      expect(aggregateBlockMetrics[1]).toHaveProperty('timestamp', start + daySeconds)
      expect(aggregateBlockMetrics[2]).toHaveProperty('timestamp', start + (daySeconds * 2))
      expect(aggregateBlockMetrics[3]).toHaveProperty('timestamp', start + (daySeconds * 3))
      expect(aggregateBlockMetrics[4]).toHaveProperty('timestamp', start + (daySeconds * 4))

    })

    it ('should return an empty array if there are no BlockMetricsEntities with time field between the start and end parameters', async () => {

      const aggregateBlockMetrics = await blockMetricResolvers.blockMetricsTimeseries(
        new Date(1546300800000),
        new Date(1546819200000),
        TimeBucket.ONE_DAY,
        [BlockMetricField.AVG_BLOCK_TIME]
      )

      expect(aggregateBlockMetrics).not.toBeNull()
      expect(aggregateBlockMetrics).toHaveLength(0)

    })
  })
})
