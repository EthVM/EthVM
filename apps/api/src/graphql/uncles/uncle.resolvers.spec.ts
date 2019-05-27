import { Test } from '@nestjs/testing'
import { UncleResolvers } from './uncle.resolvers'
import { EthService } from '../../shared/eth.service'
import { UncleService } from '../../dao/uncle.service'
import BigNumber from 'bignumber.js'
import { UncleEntity } from '../../orm/entities/uncle.entity'
import { UncleDto } from './dto/uncle.dto'
import { UnclePageDto } from './dto/uncle-page.dto'

const hash1 = '0x0000000000000000000000000000000000000000000000000000000000000001'
const hash2 = '0x0000000000000000000000000000000000000000000000000000000000000002'
const hash3 = '0x0000000000000000000000000000000000000000000000000000000000000003'
const hash4 = '0x0000000000000000000000000000000000000000000000000000000000000004'
const hash5 = '0x0000000000000000000000000000000000000000000000000000000000000005'
const hash6 = '0x0000000000000000000000000000000000000000000000000000000000000006'
const hash7 = '0x0000000000000000000000000000000000000000000000000000000000000007'

const uncles = [
  {
    nephewNumber: 1,
    number: 1,
    hash: hash1
  },
  {
    nephewNumber: 1,
    number: 2,
    hash: hash2
  },
  {
    nephewNumber: 2,
    number: 3,
    hash: hash3
  },
  {
    nephewNumber: 3,
    number: 4,
    hash: hash4
  },
  {
    nephewNumber: 5,
    number: 5,
    hash: hash5
  },
  {
    nephewNumber: 6,
    number: 6,
    hash: hash6
  }
]

const mockService = {
  async findUncleByHash(hash: string) {
    const uncle = uncles.find(u => u.hash === hash)
    return uncle ? new UncleEntity(uncle) : null;
  },
  async findUncles(offset: number = 0, limit: number = 10, fromUncle: BigNumber): Promise<[UncleEntity[], number]> {
    if (!fromUncle) {
      fromUncle = await this.findLatestUncleBlockNumber()
    }
    let data = uncles
      .filter(u => u.number <= fromUncle.toNumber())
      .sort((a, b) => {
        if (a.nephewNumber === b.nephewNumber) {
          return b.number - a.number
        } else {
          return b.nephewNumber - a.nephewNumber
        }
      })
    const totalCount = data.length

    data = data.slice(offset, offset + limit)

    return [data.map(u => new UncleEntity(u)), totalCount]
  },
  async findLatestUncleBlockNumber(): Promise<BigNumber> {
    const orderedByNumbers = uncles.sort((a, b) => b.number - a.number)
    return new BigNumber(orderedByNumbers[0].number)
  }
}

describe('UncleResolvers', () => {
  let uncleService: UncleService
  let uncleResolvers: UncleResolvers

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UncleResolvers,
        EthService,
        {
          provide: UncleService,
          useValue: mockService
        }
      ]
    }).compile()
    uncleService = module.get<UncleService>(UncleService)
    uncleResolvers = module.get<UncleResolvers>(UncleResolvers)
  })

  describe('uncleByHash', () => {

    it('should return null if uncle does not exist for a given hash', async () => {
      expect(await uncleResolvers.uncleByHash(hash7)).toEqual(null)
    })

    it('should return an instance of UncleDto matching the hash provided', async () => {
      const uncle1 = await uncleResolvers.uncleByHash(hash1)
      const uncle2 = await uncleResolvers.uncleByHash(hash2)

      // check that distinct objects are returned based on hash and that they do not equal each other

      expect(uncle1).not.toBeNull()
      expect(uncle1).toBeInstanceOf(UncleDto)
      expect(uncle1).toHaveProperty('hash', hash1)

      expect(uncle2).not.toBeNull()
      expect(uncle2).toBeInstanceOf(UncleDto)
      expect(uncle2).toHaveProperty('hash', hash2)

      expect(uncle1).not.toEqual(uncle2)
    })

    it('should convert an UncleEntity to an UncleDto', async () => {
      const uncle = await uncleResolvers.uncleByHash(hash3)

      expect(uncle).toEqual(
        new UncleDto({ nephewNumber: 2, number: 3, hash: hash3 })
      )
    })

  })

  describe('latestUncleBlockNumber', () => {

    it('should return a BigNumber', async () => {
      const latestNumber = await uncleResolvers.latestUncleBlockNumber()
      expect(latestNumber).not.toBeNull()
      // Find a better way to check if result is instance of big number
      expect(latestNumber).toEqual(new BigNumber(6))
    })

    it('should return the highest value of "number" field of all uncles', async () => {
      const latestNumber = await uncleResolvers.latestUncleBlockNumber()
      expect(latestNumber.toNumber()).toEqual(6)
    })
  })

  describe('uncles', () => {

    it('should return an instance of UnclePageDto with totalCount and array of UncleDto items', async () => {
      const uncles = await uncleResolvers.uncles(0, 10)

      expect(uncles).not.toBeNull()
      expect(uncles).toBeInstanceOf(UnclePageDto)
      expect(uncles).toHaveProperty('totalCount', 6)
      expect(uncles).toHaveProperty('items')

      if(uncles) {
        expect(uncles.items).toHaveLength(6)
        expect(uncles.items[0]).toBeInstanceOf(UncleDto)
      }

    })

    it('should respect given limit and page parameters', async () => {
      const uncles1 = await uncleResolvers.uncles(0, 5)
      const uncles2 = await uncleResolvers.uncles(5, 5)

      expect(uncles1).not.toBeNull()
      expect(uncles1).toBeInstanceOf(UnclePageDto)
      expect(uncles1).toHaveProperty('totalCount', 6)
      expect(uncles1).toHaveProperty('items')

      if (uncles1) {
        expect(uncles1.items).toHaveLength(5)
      }

      expect(uncles2).not.toBeNull()
      expect(uncles2).toBeInstanceOf(UnclePageDto)
      expect(uncles2).toHaveProperty('totalCount', 6)
      expect(uncles2).toHaveProperty('items')

      if (uncles2) {
        expect(uncles2.items).toHaveLength(1)
      }

      expect(uncles1).not.toEqual(uncles2)

      // Check an empty array is returned if no items available for requested page
      const uncles3 = await uncleResolvers.uncles(10, 5)
      expect(uncles3).not.toBeNull()
      expect(uncles3).toHaveProperty('totalCount', 6)
      expect(uncles3).toHaveProperty('items')
      if (uncles3) {
        expect(uncles3.items).toHaveLength(0)
      }
    })

    it('should order Uncles by nephew number and number DESC', async () => {
      const uncles = await uncleResolvers.uncles(0, 10)

      expect(uncles).not.toBeNull()
      expect(uncles).toHaveProperty('items')

      if (uncles) {
        expect(uncles.items).toHaveLength(6)
        expect(uncles.items[0]).toHaveProperty('nephewNumber', 6)
        expect(uncles.items[0]).toHaveProperty('number', 6)
        expect(uncles.items[1]).toHaveProperty('nephewNumber', 5)
        expect(uncles.items[1]).toHaveProperty('number', 5)
        expect(uncles.items[2]).toHaveProperty('nephewNumber', 3)
        expect(uncles.items[2]).toHaveProperty('number', 4)
        expect(uncles.items[3]).toHaveProperty('nephewNumber', 2)
        expect(uncles.items[3]).toHaveProperty('number', 3)
        expect(uncles.items[4]).toHaveProperty('nephewNumber', 1)
        expect(uncles.items[4]).toHaveProperty('number', 2)
        expect(uncles.items[5]).toHaveProperty('nephewNumber', 1)
        expect(uncles.items[5]).toHaveProperty('number', 1)
      }
    })

    it('should only return information for uncles with number <= fromUncle parameter', async () => {

      const unclesPage1 = await uncleResolvers.uncles(0, 2, new BigNumber(5))

      expect(unclesPage1).not.toBeNull()

      // Check uncles greater than fromUncle are not included in totalCount
      expect(unclesPage1).toHaveProperty('totalCount', 5)
      expect(unclesPage1).toHaveProperty('items')
      if (unclesPage1) {
        expect(unclesPage1.items).toHaveLength(2)
        expect(unclesPage1.items[0]).toHaveProperty('number', 5)
        expect(unclesPage1.items[1]).toHaveProperty('number', 4)
      }

      // Check fromUncle is respected with offset param

      const unclesPage2 = await uncleResolvers.uncles(2, 2, new BigNumber(5))

      expect(unclesPage2).not.toBeNull()
      expect(unclesPage2).toHaveProperty('totalCount', 5)
      expect(unclesPage2).toHaveProperty('items')
      if (unclesPage2) {
        expect(unclesPage2.items).toHaveLength(2)
        expect(unclesPage2.items[0]).toHaveProperty('number', 3)
        expect(unclesPage2.items[1]).toHaveProperty('number', 2)
      }
    })

  })

})
