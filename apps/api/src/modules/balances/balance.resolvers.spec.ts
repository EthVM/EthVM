import { BalanceService } from './balance.service'
import { BalanceResolvers } from './balance.resolvers'
import { Test } from '@nestjs/testing'
import { EthService } from '../../shared/eth.service'
import { BalanceEntity } from '../../orm/entities/balance.entity'
import { BalanceDto } from './balance.dto'

const hashOne = '0000000000000000000000000000000000000001'
const hashTwo = '0000000000000000000000000000000000000002'
const hashThree = '0000000000000000000000000000000000000003'

const balances = {
  '0000000000000000000000000000000000000001': {
    id: {
      balanceType: 'ETHER',
      address: hashOne
    },
    address: hashOne,
    amount: '',
    balanceType: 'ETHER'
  },
  '0000000000000000000000000000000000000002': {
    id: {
      balanceType: 'ETHER',
      address: hashTwo
    },
    address: hashTwo,
    amount: '',
    balanceType: 'ETHER'
  }
}

const mockService = {
  async findBalanceByHash(hash: string) {
    const data = balances[hash]
    return data ? new BalanceEntity(data) : null
  }
}

describe('BalanceResolvers', () => {
  let balanceService: BalanceService
  let balanceResolvers: BalanceResolvers

  beforeEach(async () => {
    // test module
    const module = await Test.createTestingModule({
      providers: [
        BalanceResolvers,
        EthService,
        {
          provide: BalanceService,
          useValue: mockService
        }
      ]
    }).compile()

    // fetch dependencies
    balanceService = module.get<BalanceService>(BalanceService)
    balanceResolvers = module.get<BalanceResolvers>(BalanceResolvers)
  })

  describe('balanceByHash', () => {
    it('should return null if balance does not exist for a given hash', async () => {
      expect(await balanceResolvers.balanceByHash(hashThree)).toEqual(null)
    })

    it('should return an instance of BalanceDto matching the address hash provided', async () => {
      const balanceOne = await balanceResolvers.balanceByHash(hashOne)
      const balanceTwo = await balanceResolvers.balanceByHash(hashTwo)

      // check that distinct objects are returned based on hash and that they do not equal each other

      expect(balanceOne).not.toBeNull()
      expect(balanceOne).toBeInstanceOf(BalanceDto)
      expect(balanceOne).toHaveProperty('id', { balanceType: 'ETHER', address: hashOne })

      expect(balanceTwo).not.toBeNull()
      expect(balanceTwo).toBeInstanceOf(BalanceDto)
      expect(balanceTwo).toHaveProperty('id', { balanceType: 'ETHER', address: hashTwo })

      expect(balanceOne).not.toEqual(balanceTwo)
    })

    it('should convert a BalanceEntity to a BalanceDto', async () => {
      const balanceOne = await balanceResolvers.balanceByHash(hashOne)

      expect(balanceOne).toEqual(
        new BalanceDto({
          id: {
            balanceType: 'ETHER',
            address: hashOne
          },
          address: hashOne,
          amount: '',
          balanceType: 'ETHER'
        })
      )
    })
  })
})
