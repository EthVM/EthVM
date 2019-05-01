import { Test } from '@nestjs/testing'
import { UncleService } from './uncle.service'
import { UncleResolvers } from './uncle.resolvers'
import { UncleEntity } from '../../orm/entities/uncle.entity'
import { UncleDto } from './uncle.dto'
import { EthService } from '../../shared/eth.service'

const mockService = {
  async findUncleByHash(hash) {},
  async findUncles(limit, page, fromUncle) {},
  async countUncles() {},
  async findLatestUncleBlockNumber() {}
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

  const hash = '0x0000000000000000000000000000000000000000000000000000000000000000'
  const result = {
    id: hash,
    hash
  }

  describe('uncleByHash', () => {
    it('should return an instance of UncleDto matching the hash provided', async () => {
      jest.spyOn(uncleService, 'findUncleByHash').mockImplementation(
        () =>
          new Promise(resolve => {
            resolve(new UncleEntity(result))
          })
      )

      expect(await uncleResolvers.uncleByHash(hash)).toEqual(new UncleDto(result))
    })
  })

  describe('uncles', () => {
    it('should return an array of UncleDto instances', async () => {
      jest.spyOn(uncleService, 'findUncles').mockImplementation(
        () =>
          new Promise(resolve => {
            resolve([new UncleEntity(result)])
          })
      )

      expect(await uncleResolvers.uncles(1)).toEqual([new UncleDto(result)])
    })
  })

  describe('totalNumberOfUncles', () => {
    it('should return the total number of uncles in the db', async () => {
      jest.spyOn(uncleService, 'countUncles').mockImplementation(
        () =>
          new Promise(resolve => {
            resolve(100)
          })
      )

      expect(await uncleResolvers.totalNumberOfUncles()).toEqual(100)
    })
  })

  describe('latestUncleBlockNumber', () => {
    it('should return the block number of the latest uncle ordered by block number', async () => {
      jest.spyOn(uncleService, 'findLatestUncleBlockNumber').mockImplementation(
        () =>
          new Promise(resolve => {
            resolve(1000)
          })
      )

      expect(await uncleResolvers.latestUncleBlockNumber()).toEqual(1000)
    })
  })
})
