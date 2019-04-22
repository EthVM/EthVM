import { Test } from '@nestjs/testing'
import { EthService } from '../../shared/eth.service'
import { PubSub } from 'graphql-subscriptions'
import { BlockService } from './block.service'
import { BlockResolvers } from './block.resolvers'
import { BlockEntity } from '../../orm/entities/block.entity'
import { BlockDto } from './block.dto'
import { BlockMetricEntity } from '../../orm/entities/block-metric.entity'
import { BalanceDto } from '../balances/balance.dto'
import { BlockMetricsDto } from '../block-metrics/block-metrics.dto'

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
const hashEleven = '0x0000000000000000000000000000000000000000000000000000000000000011'

const authorOne = '0000000000000000000000000000000000000001'
const authorTwo = '0000000000000000000000000000000000000002'
const authorThree = '0000000000000000000000000000000000000003'

const blocks = {
  '0x0000000000000000000000000000000000000000000000000000000000000001': {
    id: 1,
    header: {
      hash: hashOne,
      author: authorOne,
      number: 1
    }
  },
  '0x0000000000000000000000000000000000000000000000000000000000000002': {
    id: 2,
    header: {
      hash: hashTwo,
      author: authorOne,
      number: 2
    }
  },
  '0x0000000000000000000000000000000000000000000000000000000000000003': {
    id: 3,
    header: {
      hash: hashThree,
      author: authorTwo,
      number: 3
    }
  },
  '0x0000000000000000000000000000000000000000000000000000000000000004': {
    id: 4,
    header: {
      hash: hashFour,
      author: authorOne,
      number: 4
    }
  },
  '0x0000000000000000000000000000000000000000000000000000000000000005': {
    id: 5,
    header: {
      hash: hashFive,
      author: authorOne,
      number: 5
    }
  },
  '0x0000000000000000000000000000000000000000000000000000000000000006': {
    id: 6,
    header: {
      hash: hashSix,
      author: authorTwo,
      number: 6
    }
  },
  '0x0000000000000000000000000000000000000000000000000000000000000007': {
    id: 7,
    header: {
      hash: hashSeven,
      author: authorOne,
      number: 7
    }
  },
  '0x0000000000000000000000000000000000000000000000000000000000000008': {
    id: 8,
    header: {
      hash: hashEight,
      author: authorOne,
      number: 8
    }
  },
  '0x0000000000000000000000000000000000000000000000000000000000000009': {
    id: 9,
    header: {
      hash: hashNine,
      author: authorTwo,
      number: 9
    }
  },
  '0x00000000000000000000000000000000000000000000000000000000000000010': {
    id: 10,
    header: {
      hash: hashTen,
      author: authorOne,
      number: 10
    }
  }
}

const mockService = {
  async findBlockByHash(hash) {
    const data = blocks[hash]
    return data ? new BlockEntity(data) : null
  },
  async findBlocks(page: number = 0, limit: number = 10) {
    const start = page * limit
    const end = start + limit
    const items = Object.values(blocks).slice(start, end)
    return items.map(i => new BlockEntity(i))
  },
  async findBlockByNumber(number) {
    const data = Object.values(blocks).find(b => b.id === number)
    return data ? new BlockEntity(data) : null
  },
  async findMinedBlocksByAddress(address, limit: number = 10, page: number = 0) {
    const minedBlocks = Object.values(blocks).filter(b => b.header.author === address)
    const start = page * limit
    const end = start + limit
    const items = minedBlocks.slice(start, end)
    return items.map(i => new BlockEntity(i))
  },
  async findTotalNumberOfBlocks() {
    return Object.keys(blocks).length
  }
}

describe('BlockResolvers', () => {
  let blockService: BlockService
  let blockResolvers: BlockResolvers

  beforeEach(async () => {
    // test module
    const module = await Test.createTestingModule({
      providers: [
        BlockResolvers,
        EthService,
        {
          provide: 'PUB_SUB',
          useValue: new PubSub()
        },
        {
          provide: BlockService,
          useValue: mockService
        }
      ]
    }).compile()

    // fetch dependencies
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
    it('should return null if block does not exist for a given hash', async () => {
      expect(await blockResolvers.blockByHash(hashEleven)).toEqual(null)
    })

    it('should return an instance of BlockDto matching the address hash provided', async () => {
      const blockOne = await blockResolvers.blockByHash(hashOne)
      const blockTwo = await blockResolvers.blockByHash(hashTwo)

      // check that distinct objects are returned based on hash and that they do not equal each other

      expect(blockOne).not.toBeNull()
      expect(blockOne).toBeInstanceOf(BlockDto)
      expect(blockOne).toHaveProperty('header', { hash: hashOne, author: authorOne, number: 1 })

      expect(blockTwo).not.toBeNull()
      expect(blockTwo).toBeInstanceOf(BlockDto)
      expect(blockTwo).toHaveProperty('header', { hash: hashTwo, author: authorOne, number: 2 })

      expect(blockOne).not.toEqual(blockTwo)
    })

    it('should convert a BlockEntity to a BlockDto', async () => {
      const blockOne = await blockResolvers.blockByHash(hashOne)

      expect(blockOne).toEqual(
        new BlockDto({
          id: 1,
          header: {
            hash: hashOne,
            author: authorOne,
            number: 1
          }
        })
      )
    })
  })

  describe('blocks', () => {
    it('should return an array of BlockDto instances, respecting given limit and page parameters', async () => {
      const blocksOne = await blockResolvers.blocks(5, 0)
      expect(blocksOne).toHaveLength(5)
      expect(blocksOne[0]).toHaveProperty('id', 1)
      expect(blocksOne[4]).toHaveProperty('id', 5)

      const blocksTwo = await blockResolvers.blocks(5, 1)
      expect(blocksTwo).toHaveLength(5)
      expect(blocksTwo[0]).toHaveProperty('id', 6)
      expect(blocksTwo[4]).toHaveProperty('id', 10)

      // Check an empty array is returned if no items available for requested page
      const blocksThree = await blockResolvers.blocks(10, 1)
      expect(blocksThree).toHaveLength(0)
    })

    it('should convert an array of BlockEntity instances to an array of BlockDto instances', async () => {
      const blocks = await blockResolvers.blocks()
      const expected = [
        new BlockDto({ id: 1, header: { hash: hashOne, author: authorOne, number: 1 } }),
        new BlockDto({ id: 2, header: { hash: hashTwo, author: authorOne, number: 2 } }),
        new BlockDto({ id: 3, header: { hash: hashThree, author: authorTwo, number: 3 } }),
        new BlockDto({ id: 4, header: { hash: hashFour, author: authorOne, number: 4 } }),
        new BlockDto({ id: 5, header: { hash: hashFive, author: authorOne, number: 5 } }),
        new BlockDto({ id: 6, header: { hash: hashSix, author: authorTwo, number: 6 } }),
        new BlockDto({ id: 7, header: { hash: hashSeven, author: authorOne, number: 7 } }),
        new BlockDto({ id: 8, header: { hash: hashEight, author: authorOne, number: 8 } }),
        new BlockDto({ id: 9, header: { hash: hashNine, author: authorTwo, number: 9 } }),
        new BlockDto({ id: 10, header: { hash: hashTen, author: authorOne, number: 10 } })
      ]
      expect(blocks).toEqual(expect.arrayContaining(expected))
    })
  })

  describe('blockByNumber', () => {
    it('should return null if block does not exist for a given number', async () => {
      expect(await blockResolvers.blockByNumber(11)).toEqual(null)
    })

    it('should return an instance of BlockDto matching the block number provided', async () => {
      const blockOne = await blockResolvers.blockByNumber(1)
      const blockTwo = await blockResolvers.blockByNumber(2)

      // check that distinct objects are returned based on number and that they do not equal each other

      expect(blockOne).not.toBeNull()
      expect(blockOne).toBeInstanceOf(BlockDto)
      expect(blockOne).toHaveProperty('header', { hash: hashOne, author: authorOne, number: 1 })

      expect(blockTwo).not.toBeNull()
      expect(blockTwo).toBeInstanceOf(BlockDto)
      expect(blockTwo).toHaveProperty('header', { hash: hashTwo, author: authorOne, number: 2 })

      expect(blockOne).not.toEqual(blockTwo)
    })

    it('should convert a BlockEntity to a BlockDto', async () => {
      const blockOne = await blockResolvers.blockByNumber(1)

      expect(blockOne).toEqual(
        new BlockDto({
          id: 1,
          header: {
            hash: hashOne,
            author: authorOne,
            number: 1
          }
        })
      )
    })
  })

  describe('minedBlocksByAddress', () => {
    it('should return an array of BlockDto instances matching the address provided', async () => {
      const blocksMinedByAuthorOne = await blockResolvers.minedBlocksByAddress(authorOne)
      const blocksMinedByAuthorTwo = await blockResolvers.minedBlocksByAddress(authorTwo)

      expect(blocksMinedByAuthorOne).toHaveLength(7)
      expect(blocksMinedByAuthorOne[0]).toHaveProperty('header', { hash: hashOne, author: authorOne, number: 1 })

      expect(blocksMinedByAuthorTwo).toHaveLength(3)
      expect(blocksMinedByAuthorTwo[0]).toHaveProperty('header', { hash: hashThree, author: authorTwo, number: 3 })

      expect(blocksMinedByAuthorOne).not.toEqual(blocksMinedByAuthorTwo)
    })

    it('should respect given limit and page parameters', async () => {
      const blocksOne = await blockResolvers.minedBlocksByAddress(authorOne, 5, 0)
      expect(blocksOne).toHaveLength(5)
      expect(blocksOne[0]).toHaveProperty('id', 1)
      expect(blocksOne[4]).toHaveProperty('id', 7)

      const blocksTwo = await blockResolvers.minedBlocksByAddress(authorOne, 5, 1)
      expect(blocksTwo).toHaveLength(2)
      expect(blocksTwo[0]).toHaveProperty('id', 8)
      expect(blocksTwo[1]).toHaveProperty('id', 10)

      // Check an empty array is returned if no items available for requested page
      const blocksThree = await blockResolvers.minedBlocksByAddress(authorThree, 10, 1)
      expect(blocksThree).toHaveLength(0)
    })

    it('should convert an array of BlockEntity instances to an array of BlockDto instances', async () => {
      const blocks = await blockResolvers.minedBlocksByAddress(authorOne)
      const expected = [
        new BlockDto({ id: 1, header: { hash: hashOne, author: authorOne, number: 1 } }),
        new BlockDto({ id: 2, header: { hash: hashTwo, author: authorOne, number: 2 } }),
        new BlockDto({ id: 4, header: { hash: hashFour, author: authorOne, number: 4 } }),
        new BlockDto({ id: 5, header: { hash: hashFive, author: authorOne, number: 5 } }),
        new BlockDto({ id: 7, header: { hash: hashSeven, author: authorOne, number: 7 } }),
        new BlockDto({ id: 8, header: { hash: hashEight, author: authorOne, number: 8 } }),
        new BlockDto({ id: 10, header: { hash: hashTen, author: authorOne, number: 10 } })
      ]
      expect(blocks).toEqual(expect.arrayContaining(expected))
    })
  })

  describe('totalNumberOfBlocks', () => {
    it('should return the total number of blocks in the database', async () => {
      expect(await blockResolvers.totalNumberOfBlocks()).toBe(10)
    })
  })
})
