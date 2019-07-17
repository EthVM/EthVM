import { Test } from '@nestjs/testing'
import { EthService } from '../../shared/eth.service'
import { PubSub } from 'graphql-subscriptions'
import { BlockService } from '../../dao/block.service'
import { BlockResolvers } from './block.resolvers'
import { BlockSummary } from '../schema'
import BigNumber from 'bignumber.js'
import { BlockSummaryPageDto } from './dto/block-summary-page.dto'
import { BlockSummaryDto } from './dto/block-summary.dto'
import { BlockHeaderEntity } from '../../orm/entities/block-header.entity'
import { BlockDto } from './dto/block.dto'
import { MetadataService } from '../../dao/metadata.service'

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

const blockSummaries = [
  {
    hash: hashOne,
    author: authorOne,
    number: 1
  },
  {
    hash: hashTwo,
    author: authorOne,
    number: 2
  },
  {
    hash: hashThree,
    author: authorTwo,
    number: 3
  },
  {
    hash: hashFour,
    author: authorOne,
    number: 4
  },
  {
    hash: hashFive,
    author: authorOne,
    number: 5
  },
  {
    hash: hashSix,
    author: authorTwo,
    number: 6
  },
  {
    hash: hashSeven,
    author: authorOne,
    number: 7
  },
  {
    hash: hashEight,
    author: authorOne,
    number: 8
  },
  {
    hash: hashNine,
    author: authorTwo,
    number: 9
  },
  {
    hash: hashTen,
    author: authorOne,
    number: 10
  }
]

const blocks = [
  {
    hash: hashOne,
    author: authorOne,
    number: 1,
    blockTime: {
      blockTime: 10
    }
  },
  {
    hash: hashTwo,
    author: authorOne,
    number: 2,
    blockTime: {
      blockTime: 5
    }
  },
  {
    hash: hashThree,
    author: authorTwo,
    number: 3,
    blockTime: {
      blockTime: 9
    }
  },
  {
    hash: hashFour,
    author: authorOne,
    number: 4,
    blockTime: {
      blockTime: 10
    }
  },
  {
    hash: hashFive,
    author: authorOne,
    number: 5,
    blockTime: {
      blockTime: 12
    }
  },
  {
    hash: hashSix,
    author: authorTwo,
    number: 6,
    blockTime: {
      blockTime: 5
    }
  },
  {
    hash: hashSeven,
    author: authorOne,
    number: 7,
    blockTime: {
      blockTime: 10
    }
  },
  {
    hash: hashEight,
    author: authorOne,
    number: 8,
    blockTime: {
      blockTime: 11
    }
  },
  {
    hash: hashNine,
    author: authorTwo,
    number: 9,
    blockTime: {
      blockTime: 2
    }
  },
  {
    hash: hashTen,
    author: authorOne,
    number: 10,
    blockTime: {
      blockTime: 10
    }
  }
]

const metadataServiceMock = {
  async isSyncing() {
    return false
  }
}

const blockServiceMock = {
  async findSummaries(offset: number, limit: number, fromBlock: BigNumber): Promise<[BlockSummary[], number]> {

    let items = blockSummaries
    let count = blockSummaries.length

    if (fromBlock) {
      items = items.filter(i => fromBlock.isGreaterThanOrEqualTo(i.number))
      count = items.length
    }

    items = items.sort((a, b) => b.number - a.number)

    items = items.slice(offset, offset + limit)

    return [items as BlockSummary[], count]
  },
  async findSummariesByAuthor(author: string, offset: number, limit: number): Promise<[BlockSummary[], number]> {

    let items = blockSummaries.filter(bs => bs.author === author)
    let count = items.length

    items = items.sort((a, b) => b.number - a.number)

    items = items.slice(offset, offset + limit)

    return [items as BlockSummary[], count]
  },
  async findByNumber(number: BigNumber): Promise<BlockHeaderEntity | undefined> {
    const item = blocks.find(bs => number.isEqualTo(bs.number))
    return item ? new BlockHeaderEntity(item) : undefined
  },
  async findByHash(hash: string) {
    const item = blocks.find(bs => bs.hash === hash)
    return item ? new BlockHeaderEntity(item) : undefined
  },
  async calculateHashRate() {
    return new BigNumber(100)
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
          useValue: blockServiceMock
        },
        {
          provide: MetadataService,
          useValue: metadataServiceMock
        }
      ]
    }).compile()

    // fetch dependencies
    blockService = module.get<BlockService>(BlockService)
    blockResolvers = module.get<BlockResolvers>(BlockResolvers)
  })

  describe('blockSummaries', () => {
    it('should return an instance of BlockSummaryPageDto, with items respecting given limit and page parameters', async () => {

      const blocksOne = await blockResolvers.blockSummaries(new BigNumber(100), 0, 5)

      expect(blocksOne).not.toBeNull()
      expect(blocksOne).toBeInstanceOf(BlockSummaryPageDto)
      expect(blocksOne).toHaveProperty('items')
      expect(blocksOne).toHaveProperty('totalCount')

      if (blocksOne) {
        expect(blocksOne.items).toHaveLength(5)
        expect(blocksOne.items[0]).toHaveProperty('number', 10)
        expect(blocksOne.items[4]).toHaveProperty('number', 6)

        expect(blocksOne.totalCount).toBe(10)
      }


      const blocksTwo = await blockResolvers.blockSummaries(new BigNumber(100), 5, 5)

      expect(blocksTwo).not.toBeNull()
      expect(blocksTwo).toBeInstanceOf(BlockSummaryPageDto)
      expect(blocksTwo).toHaveProperty('items')
      expect(blocksTwo).toHaveProperty('totalCount')

      if (blocksTwo) {
        expect(blocksTwo.items).toHaveLength(5)
        expect(blocksTwo.items[0]).toHaveProperty('number', 5)
        expect(blocksTwo.items[4]).toHaveProperty('number', 1)

        expect(blocksTwo.totalCount).toBe(10)

      }


      // Check an empty array is returned if no items available for requested page
      const blocksThree = await blockResolvers.blockSummaries(new BigNumber(100), 10, 10)
      expect(blocksThree).not.toBeNull()
      expect(blocksThree).toBeInstanceOf(BlockSummaryPageDto)
      expect(blocksThree).toHaveProperty('items')
      expect(blocksThree).toHaveProperty('totalCount')

      if (blocksThree) {
        expect(blocksThree.items).toHaveLength(0)
        expect(blocksThree.totalCount).toBe(10)
      }

    })

    it('should return a page object with an array of BlockSummaryDto instances in descending order', async () => {
      const blockSummaries = await blockResolvers.blockSummaries(new BigNumber(100), 0, 5)
      const expected = [
        new BlockSummaryDto({ hash: hashTen, author: authorOne, number: 10 }),
        new BlockSummaryDto({ hash: hashNine, author: authorTwo, number: 9 }),
        new BlockSummaryDto({ hash: hashEight, author: authorOne, number: 8 }),
        new BlockSummaryDto({ hash: hashSeven, author: authorOne, number: 7 }),
        new BlockSummaryDto({ hash: hashSix, author: authorTwo, number: 6 })
      ]
      expect(blockSummaries).not.toBeNull()
      expect(blockSummaries).toHaveProperty('items')
      if (blockSummaries) {
        expect(blockSummaries.items).toEqual(expect.arrayContaining(expected))
      }
    })

    it('should only return information about Blocks with number less than or equal to fromBlock', async () => {

      const blockSummaries = await blockResolvers.blockSummaries(new BigNumber(8), 0, 5)

      expect(blockSummaries).not.toBeNull()
      expect(blockSummaries).toHaveProperty('items')
      expect(blockSummaries).toHaveProperty('totalCount')
      if (blockSummaries) {
        expect(blockSummaries.items).toHaveLength(5)
        expect(blockSummaries.totalCount).toBe(8)
        expect(blockSummaries.items[0]).toHaveProperty('number', 8)
      }

    })
  })

  describe('blockSummariesByAuthor', () => {

    it('should return an instance of BlockSummaryPageDto, with items with author property matching the address provided', async () => {
      const blocksMinedByAuthorOne = await blockResolvers.blockSummariesByAuthor(authorOne, 0, 10)
      const blocksMinedByAuthorTwo = await blockResolvers.blockSummariesByAuthor(authorTwo, 0, 10)

      expect(blocksMinedByAuthorOne).not.toBeNull()
      expect(blocksMinedByAuthorTwo).not.toBeNull()

      expect(blocksMinedByAuthorOne).toHaveProperty('items')
      expect(blocksMinedByAuthorOne).toHaveProperty('totalCount', 7)
      expect(blocksMinedByAuthorTwo).toHaveProperty('items')
      expect(blocksMinedByAuthorTwo).toHaveProperty('totalCount', 3)

      if (blocksMinedByAuthorOne) {
        expect(blocksMinedByAuthorOne.items[0]).toHaveProperty('number', 10)
      }
      if (blocksMinedByAuthorTwo) {
        expect(blocksMinedByAuthorTwo.items[0]).toHaveProperty('number', 9)
      }

      expect(blocksMinedByAuthorOne).not.toEqual(blocksMinedByAuthorTwo)
    })

    it('should respect given limit and page parameters', async () => {
      const blocksPageOne = await blockResolvers.blockSummariesByAuthor(authorOne, 0, 5)
      expect(blocksPageOne).not.toBeNull()
      expect(blocksPageOne).toHaveProperty('items')
      expect(blocksPageOne).toHaveProperty('totalCount', 7)

      if (blocksPageOne) {
        expect(blocksPageOne.items).toHaveLength(5)
        expect(blocksPageOne.items[0]).toHaveProperty('number', 10)
        expect(blocksPageOne.items[4]).toHaveProperty('number', 4)
      }

      const blocksPageTwo = await blockResolvers.blockSummariesByAuthor(authorOne, 5, 5)

      expect(blocksPageTwo).not.toBeNull()
      expect(blocksPageTwo).toHaveProperty('items')
      expect(blocksPageTwo).toHaveProperty('totalCount', 7)

      if (blocksPageTwo) {
        expect(blocksPageTwo.items).toHaveLength(2)
        expect(blocksPageTwo.items[0]).toHaveProperty('number', 2)
        expect(blocksPageTwo.items[1]).toHaveProperty('number', 1)
      }

      // Check an empty array is returned if no items available for requested page
      const blocksPageThree = await blockResolvers.blockSummariesByAuthor(authorThree, 0, 10)
      expect(blocksPageThree).not.toBeNull()
      expect(blocksPageThree).toHaveProperty('items')
      expect(blocksPageThree).toHaveProperty('totalCount', 0)

      if (blocksPageThree) {
        expect(blocksPageThree.items).toHaveLength(0)
      }

    })

    it('should return a page object with an array of BlockSummaryDto instances in descending order', async () => {
      const blockSummaries = await blockResolvers.blockSummariesByAuthor(authorOne, 0, 5)
      const expected = [
        new BlockSummaryDto({hash: hashTen, author: authorOne, number: 10}),
        new BlockSummaryDto({hash: hashEight, author: authorOne, number: 8}),
        new BlockSummaryDto({hash: hashSeven, author: authorOne, number: 7}),
        new BlockSummaryDto({hash: hashFive, author: authorOne, number: 5}),
        new BlockSummaryDto({hash: hashFour, author: authorOne, number: 4})
      ]

      expect(blockSummaries).not.toBeNull()
      expect(blockSummaries).toHaveProperty('items')

      if (blockSummaries) {
        expect(blockSummaries.items).toEqual(expect.arrayContaining(expected))
      }
    })
  })

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
      expect(blockOne).toHaveProperty('header')
      if (blockOne) {
        expect(blockOne.header).toHaveProperty('hash', hashOne)
      }

      expect(blockTwo).not.toBeNull()
      expect(blockTwo).toBeInstanceOf(BlockDto)
      expect(blockTwo).toHaveProperty('header')
      if (blockTwo) {
        expect(blockTwo.header).toHaveProperty('hash', hashTwo)
      }

      expect(blockOne).not.toEqual(blockTwo)
    })

  })

  describe('blockByNumber', () => {
    it('should return null if block does not exist for a given number', async () => {
      expect(await blockResolvers.blockByNumber(new BigNumber(11))).toEqual(null)
    })

    it('should return an instance of BlockDto matching the address hash provided', async () => {
      const blockOne = await blockResolvers.blockByNumber(new BigNumber(1))
      const blockTwo = await blockResolvers.blockByNumber(new BigNumber(2))

      // check that distinct objects are returned based on hash and that they do not equal each other

      expect(blockOne).not.toBeNull()
      expect(blockOne).toBeInstanceOf(BlockDto)
      expect(blockOne).toHaveProperty('header')
      if (blockOne) {
        expect(blockOne.header).toHaveProperty('hash', hashOne)
      }

      expect(blockTwo).not.toBeNull()
      expect(blockTwo).toBeInstanceOf(BlockDto)
      expect(blockTwo).toHaveProperty('header')
      if (blockTwo) {
        expect(blockTwo.header).toHaveProperty('hash', hashTwo)
      }

      expect(blockOne).not.toEqual(blockTwo)
    })

  })

  describe('queryHashRate', () => {

    it ('should return a BigNumber', async () => {

      const hashRate = await blockResolvers.queryHashRate()

      expect(hashRate).not.toBeNull()
      expect(hashRate).toBeInstanceOf(BigNumber)

    })

  })

})
