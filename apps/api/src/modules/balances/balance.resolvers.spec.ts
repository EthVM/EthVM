import { BalanceService } from './balance.service'
import { BalanceResolvers } from './balance.resolvers'
import { Test } from '@nestjs/testing'
import { EthService } from '../../shared/eth.service'
import { ParseAddressPipe } from '../../shared/validation/parse-address.pipe'
import { BalanceEntity } from '../../orm/entities/balance.entity'
import { BalanceDto } from './balance.dto'

const mockService = {
  async findBalanceByHash(hash: string) {}
}

describe('BalanceResolvers', () => {

  let balanceService: BalanceService
  let balanceResolvers: BalanceResolvers

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        BalanceResolvers,
        EthService,
        ParseAddressPipe,
        {
          provide: BalanceService,
          useValue: mockService
        }
      ],
    }).compile()
    balanceService = module.get<BalanceService>(BalanceService)
    balanceResolvers = module.get<BalanceResolvers>(BalanceResolvers)
  })

  describe('balanceByHash', () => {
    it('should return an instance of BalanceDto matching the address hash provided', async () => {
      const hash = '0000000000000000000000000000000000000000'
      const result = {
        id: {
          balanceType: 'ETHER',
          address: hash
        },
        address: hash,
        amount: '',
        balanceType: 'ETHER'
      }
      jest.spyOn(balanceService, 'findBalanceByHash')
        .mockImplementation((hash) => new Promise(resolve => {
          resolve(new BalanceEntity(result))
        }))

      expect(await balanceResolvers.balanceByHash(hash)).toEqual(new BalanceDto(result))
    })
  })
})
