import { Test } from '@nestjs/testing'
import { EthService } from '../../shared/eth.service'
import { BlockMetricService } from './block-metric.service'
import { BlockMetricResolvers } from './block-metric.resolvers'
import { BlockMetricEntity } from '../../orm/entities/block-metric.entity'
import { BlockMetricDto } from './block-metric.dto'
import { ParseHashPipe } from '../../shared/validation/parse-hash.pipe'
import { PubSub } from 'graphql-subscriptions'

const mockService = {
  async findBlockMetricByHash(hash: string) {},
  async findBlockMetrics(limit: number, page: number) {}
}

describe('BlockMetricResolvers', () => {

  let blockMetricService: BlockMetricService
  let blockMetricResolvers: BlockMetricResolvers

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        BlockMetricResolvers,
        EthService,
        ParseHashPipe,
        {
          provide: 'PUB_SUB',
          useValue: new PubSub(),
        },
        {
          provide: BlockMetricService,
          useValue: mockService
        }
      ],
    }).compile()
    blockMetricService = module.get<BlockMetricService>(BlockMetricService)
    blockMetricResolvers = module.get<BlockMetricResolvers>(BlockMetricResolvers)
  })

  const hash = '0000000000000000000000000000000000000000'
  const result = {
    id: 0,
    avgGasLimit: '0',
    avgGasPrice: '0',
    avgTxFees: '0',
    blockTime: '0',
    difficulty: '0',
    hash,
    number: 0,
    numFailedTxs: 0,
    numPendingTxs: 0,
    numSuccessfulTxs: 0,
    numUncles: 0,
    timestamp: 0,
    totalDifficulty: '0',
    totalTxs: 0
  }

  describe('blockMetricByHash', () => {
    it('should return an instance of BlockMetricDto matching the address hash provided', async () => {
      jest.spyOn(blockMetricService, 'findBlockMetricByHash')
        .mockImplementation(() => new Promise(resolve => {
          resolve(new BlockMetricEntity(result))
        }))

      expect(await blockMetricResolvers.blockMetricByHash(hash)).toEqual(new BlockMetricDto(result))
    })
  })

  describe('blockMetrics', () => {
    it('should return an array of BlockMetricDto', async () => {
      jest.spyOn(blockMetricService, 'findBlockMetrics')
        .mockImplementation(() => new Promise(resolve => {
          resolve([new BlockMetricEntity(result)])
        }))

      expect(await blockMetricResolvers.blockMetrics(1, 0)).toEqual([new BlockMetricDto(result)])
    })
  })

})
