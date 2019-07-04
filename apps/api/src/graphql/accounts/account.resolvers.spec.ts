import { AccountEntity } from '../../orm/entities/account.entity'
import { AccountResolvers } from './account.resolvers'
import { Test } from '@nestjs/testing'
import { AccountDto } from './account.dto'
import { EthService } from '../../shared/eth.service'
import { AccountService } from '../../dao/account.service'
import { MetadataService } from '../../dao/metadata.service'

const address1 = '0000000000000000000000000000000000000001'
const address2 = '0000000000000000000000000000000000000002'
const address3 = '0000000000000000000000000000000000000003'

const accounts = {
  '0000000000000000000000000000000000000001': {
    address: address1
  },
  '0000000000000000000000000000000000000002': {
    address: address2
  }
}

const metadataServiceMock = {
  async isSyncing() {
    return false
  }
}

const accountServiceMock = {
  async findAccountByAddress(address: string) {
    const data = accounts[address]
    return data ? new AccountEntity(data) : null
  },
  async findIsMiner(address: string) {
    return false
  },
  async findIsContractCreator(address: string) {
    return false
  },
  async findHasInternalTransfers(address: string) {
    return false
  }
}

describe('AccountResolvers', () => {

  let accountService: AccountService
  let accountResolvers: AccountResolvers

  beforeEach(async () => {
    // test module
    const module = await Test.createTestingModule({
      providers: [
        AccountResolvers,
        EthService,
        {
          provide: AccountService,
          useValue: accountServiceMock
        },
        {
          provide: MetadataService,
          useValue: metadataServiceMock
        }
      ]
    }).compile()

    // fetch dependencies
    accountService = module.get<AccountService>(AccountService)
    accountResolvers = module.get<AccountResolvers>(AccountResolvers)
  })

  describe('accountByAddress', () => {

    it('should return null if account does not exist for a given address', async () => {
      expect(await accountResolvers.accountByAddress(address3)).toEqual(null)
    })

    it('should return an instance of AccountDto matching the address hash provided', async () => {
      const account1 = await accountResolvers.accountByAddress(address1)
      const account2 = await accountResolvers.accountByAddress(address2)

      // check that distinct objects are returned based on hash and that they do not equal each other

      expect(account1).not.toBeNull()
      expect(account1).toBeInstanceOf(AccountDto)
      expect(account1).toHaveProperty('address', address1)

      expect(account2).not.toBeNull()
      expect(account2).toBeInstanceOf(AccountDto)
      expect(account2).toHaveProperty('address', address2)

      expect(account1).not.toEqual(account2)
    })

    it('should convert an AccountEntity to an AccountDto', async () => {
      const account1 = await accountResolvers.accountByAddress(address1)

      expect(account1).toEqual(
        new AccountDto({
          address: address1,
          isContractCreator: false,
          isMiner: false,
          hasInternalTransfers: false
        })
      )
    })

  })

})
