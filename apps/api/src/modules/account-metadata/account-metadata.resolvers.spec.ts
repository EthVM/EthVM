import { AccountMetadataResolvers } from './account-metadata.resolvers'
import { AccountMetadataService } from './account-metadata.service'
import { Test } from '@nestjs/testing'
import { AccountMetadataEntity } from '../../orm/entities/account-metadata.entity'
import { ParseAddressPipe } from '../../shared/validation/parse-address.pipe'
import { EthService } from '../../shared/eth.service'
import { AccountMetadataDto } from './account-metadata.dto'

const mockService = {
  async findAccountMetadataByHash(hash: string) {}
}

describe('AccountMetadataResolvers', () => {

  let accountMetadataService: AccountMetadataService
  let accountMetadataResolvers: AccountMetadataResolvers

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AccountMetadataResolvers,
        EthService,
        ParseAddressPipe,
        {
          provide: AccountMetadataService,
          useValue: mockService
        }
      ],
    }).compile()
    accountMetadataService = module.get<AccountMetadataService>(AccountMetadataService)
    accountMetadataResolvers = module.get<AccountMetadataResolvers>(AccountMetadataResolvers)
  })

  describe('accountMetadataByHash', () => {
    it('should return an instance of AccountMetadataDto matching the address hash provided', async () => {
      const hash = '0000000000000000000000000000000000000000'
      const result = {
        id: hash,
        inTxCount: 1,
        isContractCreator: true,
        isMiner: true,
        outTxCount: 0,
        totalTxCount: 1
      }
      jest.spyOn(accountMetadataService, 'findAccountMetadataByHash')
        .mockImplementation((hash) => new Promise(resolve => {
          resolve(new AccountMetadataEntity(result))
        }))

      expect(await accountMetadataResolvers.accountMetadataByHash(hash)).toEqual(new AccountMetadataDto(result))

    })
  })

})
