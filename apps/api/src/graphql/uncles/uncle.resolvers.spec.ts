import { Test } from '@nestjs/testing'
import { UncleResolvers } from './uncle.resolvers'
import { EthService } from '../../shared/eth.service'
import { UncleService } from '../../dao/uncle.service'
import BigNumber from 'bignumber.js'
import { UncleDto } from './uncle.dto'
import { from } from 'rxjs'
import { ContractsPageDto } from '../contracts/dto/contracts-page.dto'
import { ContractDto } from '../contracts/dto/contract.dto'
import { UncleEntity } from '../../orm/entities/uncle.entity'

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
  async findUncles(limit: number = 10, page: number = 0, fromUncle: BigNumber) {
    if (!fromUncle) {
      fromUncle = await this.findLatestUncleBlockNumber()
    }
    const data = uncles
      .filter(u => u.number <= fromUncle.toNumber())
      .sort((a, b) => {
        if (a.nephewNumber === b.nephewNumber) {
          return b.number - a.number
        } else {
          return b.nephewNumber - a.nephewNumber
        }
      })

    const start = page * limit
    const end = start + limit

    return data.slice(start, end).map(u => new UncleEntity(u))

  },
  async countUncles() {
    return new BigNumber(uncles.length)
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

  describe('totalNumberOfUncles', () => {

    it('should return a BigNumber', async () => {
      const totalUncles = await uncleResolvers.totalNumberOfUncles()
      expect(totalUncles).not.toBeNull()
      // Find a better way to check if result is instance of big number
      expect(totalUncles).toEqual(new BigNumber(6))
    })

    it('should return the total number of uncles', async () => {
      const totalUncles = await uncleResolvers.totalNumberOfUncles()
      expect(totalUncles.toNumber()).toEqual(6)
    })

  })

  describe('uncles', () => {

    it('should return an array of UncleDto instances', async () => {
      const uncles = await uncleResolvers.uncles()

      expect(uncles).toHaveLength(6)
      expect(uncles[0]).toBeInstanceOf(UncleDto)

    })

    it('should respect given limit and page parameters', async () => {
      const uncles1 = await uncleResolvers.uncles(5, 0)
      const uncles2 = await uncleResolvers.uncles(5, 1)

      expect(uncles1).toHaveLength(5)
      expect(uncles2).toHaveLength(1)
      expect(uncles1).not.toEqual(uncles2)

      // Check an empty array is returned if no items available for requested page
      const uncles3 = await uncleResolvers.uncles(5, 2)
      expect(uncles3).toHaveLength(0)
    })

    it('should convert an array of UncleEntity instances to an array of UncleDto instances', async () => {
      const uncles = await uncleResolvers.uncles(2)
      const expected = [
        new UncleDto({ nephewNumber: 6, number: 6, hash: hash6 }),
        new UncleDto({ nephewNumber: 5, number: 5, hash: hash5 })
      ]
      expect(uncles).toEqual(expect.arrayContaining(expected))
    })

    it('should order Uncles by nephew number and number DESC', async () => {
      const uncles = await uncleResolvers.uncles()

      expect(uncles).toHaveLength(6)
      expect(uncles[0]).toHaveProperty('nephewNumber', 6)
      expect(uncles[1]).toHaveProperty('nephewNumber', 5)
      expect(uncles[2]).toHaveProperty('nephewNumber', 3)
      expect(uncles[3]).toHaveProperty('nephewNumber', 2)
      expect(uncles[4]).toHaveProperty('nephewNumber', 1)
      expect(uncles[5]).toHaveProperty('nephewNumber', 1)
      expect(uncles[4]).toHaveProperty('number', 2)
      expect(uncles[5]).toHaveProperty('number', 1)

    })

  })

})
