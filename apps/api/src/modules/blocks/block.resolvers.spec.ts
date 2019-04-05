import { Test } from '@nestjs/testing'
import { EthService } from '../../shared/eth.service'
import { ParseHashPipe } from '../../shared/validation/parse-hash.pipe'
import { PubSub } from 'graphql-subscriptions'
import { BlockService } from './block.service'
import { BlockResolvers } from './block.resolvers'
import { BlockEntity } from '../../orm/entities/block.entity'
import { BlockDto } from './block.dto'

const mockService = {
  async findBlockByHash(hash) {},
  async findBlocks(limit, page) {},
  async findBlockByNumber(number) {},
  async findMinedBlocksByAddress(address, limit, page) {},
  async findTotalNumberOfBlocks() {}
}

describe('BlockResolvers', () => {

  let blockService: BlockService
  let blockResolvers: BlockResolvers

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        BlockResolvers,
        EthService,
        ParseHashPipe,
        {
          provide: 'PUB_SUB',
          useValue: new PubSub(),
        },
        {
          provide: BlockService,
          useValue: mockService
        }
      ],
    }).compile()
    blockService = module.get<BlockService>(BlockService)
    blockResolvers = module.get<BlockResolvers>(BlockResolvers)
  })

  const hash = '0x0000000000000000000000000000000000000000000000000000000000000000'
  const number = 0
  const address = '0000000000000000000000000000000000000000'
  const result = {
    id: 0,
    header: {
      hash,
      number
    }
  }

  describe('blockByHash', () => {
    it('should return an instance of BlockDto matching the address hash provided', async () => {
      jest.spyOn(blockService, 'findBlockByHash')
        .mockImplementation(() => new Promise(resolve => {
          resolve(new BlockEntity(result))
        }))

      expect(await blockResolvers.blockByHash(hash)).toEqual(new BlockDto(result))
    })
  })

  describe('blocks', () => {
    it('should return an array of BlockDto', async () => {
      jest.spyOn(blockService, 'findBlocks')
        .mockImplementation(() => new Promise(resolve => {
          resolve([new BlockEntity(result)])
        }))

      expect(await blockResolvers.blocks(1, 0)).toEqual([new BlockDto(result)])
    })
  })

  describe('blockByNumber', () => {
    it('should return an instance of BlockDto where header.number matches the number provided', async () => {
      jest.spyOn(blockService, 'findBlockByNumber')
        .mockImplementation(() => new Promise(resolve => {
          resolve(new BlockEntity(result))
        }))

      expect(await blockResolvers.blockByNumber(number)).toEqual(new BlockDto(result))
    })
  })

  describe('minedBlocksByAddress', () => {
    it('should return an array of BlockDto instances where header.author matches the address provided', async () => {
      jest.spyOn(blockService, 'findMinedBlocksByAddress')
        .mockImplementation(() => new Promise(resolve => {
          resolve([new BlockEntity(result)])
        }))

      expect(await blockResolvers.minedBlocksByAddress(address, 1, 0)).toEqual([new BlockDto(result)])
    })
  })

  describe('totalNumberOfBlocks', () => {
    it('should return the total number of blocks in the database', async () => {
      const total = 100
      jest.spyOn(blockService, 'findTotalNumberOfBlocks')
        .mockImplementation(() => new Promise(resolve => {
          resolve(total)
        }))

      expect(await blockResolvers.totalNumberOfBlocks()).toBe(total)
    })
  })

})
