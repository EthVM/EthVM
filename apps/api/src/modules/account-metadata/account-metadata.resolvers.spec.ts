import { AccountMetadataResolvers } from './account-metadata.resolvers'
import { AccountMetadataService } from './account-metadata.service'
import { Test } from '@nestjs/testing'
import { AccountMetadataEntity } from '../../orm/entities/account-metadata.entity'
import { EthService } from '../../shared/eth.service'
import { AccountMetadataDto } from './account-metadata.dto'

const hashOne = '0000000000000000000000000000000000000001'
const hashTwo = '0000000000000000000000000000000000000002'
const hashThree = '0000000000000000000000000000000000000003'

const metadata = {
  '0000000000000000000000000000000000000001': {
    id: hashOne,
    inTxCount: 1,
    isContractCreator: true,
    isMiner: true,
    outTxCount: 0,
    totalTxCount: 1
  },
  '0000000000000000000000000000000000000002': {
    id: hashTwo,
    inTxCount: 15,
    isContractCreator: false,
    isMiner: false,
    outTxCount: 12,
    totalTxCount: 27
  }
}

const mockService = {
  async findAccountMetadataByHash(hash: string) {
    const data = metadata[hash];
    return data != null ? new AccountMetadataEntity(data) : null;
  }
}

describe('AccountMetadataResolvers', () => {

  let accountMetadataService: AccountMetadataService
  let accountMetadataResolvers: AccountMetadataResolvers

  beforeEach(async () => {

    // test module
    const module = await Test.createTestingModule({
      providers: [
        AccountMetadataResolvers,
        EthService,
        {
          provide: AccountMetadataService,
          useValue: mockService
        }
      ],
    }).compile()

    // fetch dependencies
    accountMetadataService = module.get<AccountMetadataService>(AccountMetadataService)
    accountMetadataResolvers = module.get<AccountMetadataResolvers>(AccountMetadataResolvers)
  })

  describe('accountMetadataByHash', () => {

    it('should return null if metadata does not exist for a given hash', async () => {
      expect(await accountMetadataResolvers.accountMetadataByHash(hashThree)).toEqual(null)
    })

    it('should return an instance of AccountMetadataDto matching the address hash provided', async () => {

      const metadataOne = await accountMetadataResolvers.accountMetadataByHash(hashOne)
      const metadataTwo = await accountMetadataResolvers.accountMetadataByHash(hashTwo)

      // check that distinct objects are returned based on hash and that they do not equal each other

      expect(metadataOne).not.toBeNull()
      expect(metadataOne).toBeInstanceOf(AccountMetadataDto)
      expect(metadataOne).toHaveProperty('id', hashOne);

      expect(metadataTwo).not.toBeNull()
      expect(metadataTwo).toBeInstanceOf(AccountMetadataDto)
      expect(metadataTwo).toHaveProperty('id', hashTwo);

      expect(metadataOne).not.toEqual(metadataTwo)

    })

    it('should convert an AccountMetadataEntity to an AccountMetadataDto', async () => {

      const metadataOne = await accountMetadataResolvers.accountMetadataByHash(hashOne)

      expect(metadataOne).toEqual(
        new AccountMetadataDto({
          id: hashOne,
          inTxCount: 1,
          isContractCreator: true,
          isMiner: true,
          outTxCount: 0,
          totalTxCount: 1
        })
      )

    })

  })

})
