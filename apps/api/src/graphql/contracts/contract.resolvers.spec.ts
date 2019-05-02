import { Test } from '@nestjs/testing'
import { ContractResolvers } from './contract.resolvers'
import { ContractEntity } from '../../orm/entities/contract.entity'
import { ContractDto } from './dto/contract.dto'
import { EthService } from '../../shared/eth.service'
import { ContractService } from '../../dao/contract.service'

const address1 = '0000000000000000000000000000000000000001'
const address2 = '0000000000000000000000000000000000000002'
const address3 = '0000000000000000000000000000000000000003'
const address4 = '0000000000000000000000000000000000000004'
const address5 = '0000000000000000000000000000000000000005'
const address6 = '0000000000000000000000000000000000000006'
const address7 = '0000000000000000000000000000000000000007'

const creator1 = '0000000000000000000000000000000000000004'
const creator2 = '0000000000000000000000000000000000000005'
const creator3 = '0000000000000000000000000000000000000006'

const contracts = {
  '0000000000000000000000000000000000000001': {
    id: address1,
    address: address1,
    creator: creator1
  },
  '0000000000000000000000000000000000000002': {
    id: address2,
    address: address2,
    creator: creator2
  },
  '0000000000000000000000000000000000000003': {
    id: address3,
    address: address3,
    creator: creator1
  },
  '0000000000000000000000000000000000000004': {
    id: address4,
    address: address4,
    creator: creator2
  },
  '0000000000000000000000000000000000000005': {
    id: address5,
    address: address5,
    creator: creator1
  },
  '0000000000000000000000000000000000000006': {
    id: address6,
    address: address6,
    creator: creator1
  }
}

const mockService = {
  async findContractByAddress(address) {
    const data = contracts[address]
    return data ? new ContractEntity(data) : null
  },
  async findContractsCreatedBy(creator, limit = 10, page = 0) {
    const contractsCreatedBy = Object.values(contracts).filter(b => b.creator === creator)
    const start = page * limit
    const end = start + limit
    const items = contractsCreatedBy.slice(start, end)
    return [
      items.map(i => new ContractEntity(i)),
      contractsCreatedBy.length
    ]
  }
}

describe('ContractResolvers', () => {
  let contractService: ContractService
  let contractResolvers: ContractResolvers

  beforeEach(async () => {
    // test module
    const module = await Test.createTestingModule({
      providers: [
        ContractResolvers,
        EthService,
        {
          provide: ContractService,
          useValue: mockService
        }
      ]
    }).compile()

    // fetch dependencies
    contractService = module.get<ContractService>(ContractService)
    contractResolvers = module.get<ContractResolvers>(ContractResolvers)
  })

  describe('contractByHash', () => {
    it('should return null if contract does not exist for a given hash', async () => {
      expect(await contractResolvers.contractByAddress(address7)).toEqual(null)
    })

    it('should return an instance of ContractDto matching the address hash provided', async () => {
      const contractOne = await contractResolvers.contractByAddress(address1)
      const contractTwo = await contractResolvers.contractByAddress(address2)

      // check that distinct objects are returned based on hash and that they do not equal each other

      expect(contractOne).not.toBeNull()
      expect(contractOne).toBeInstanceOf(ContractDto)
      expect(contractOne).toHaveProperty('id', address1)

      expect(contractTwo).not.toBeNull()
      expect(contractTwo).toBeInstanceOf(ContractDto)
      expect(contractTwo).toHaveProperty('id', address2)

      expect(contractOne).not.toEqual(contractTwo)
    })

    it('should convert a ContractEntity to a ContractDto', async () => {
      const contractOne = await contractResolvers.contractByAddress(address1)

      expect(contractOne).toEqual(
        new ContractDto({
          id: address1,
          address: address1,
          creator: creator1
        })
      )
    })
  })

  describe('contractsCreatedBy', () => {
    it('should return a page with items (array of ContractDto instances) and totalCount created by the address provided', async () => {
      const contractsCreatedByCreatorOne = await contractResolvers.contractsCreatedBy(creator1)
      const contractsCreatedByCreatorTwo = await contractResolvers.contractsCreatedBy(creator2)

      expect(contractsCreatedByCreatorOne).toHaveProperty('items')
      expect(contractsCreatedByCreatorOne).toHaveProperty('totalCount', 4)
      if (contractsCreatedByCreatorOne.items) {
        expect(contractsCreatedByCreatorOne.items).toHaveLength(4)
        expect(contractsCreatedByCreatorOne.items[0]).toHaveProperty('id', address1)
      }

      expect(contractsCreatedByCreatorTwo).toHaveProperty('items')
      expect(contractsCreatedByCreatorTwo).toHaveProperty('totalCount', 2)
      if (contractsCreatedByCreatorTwo.items) {
        expect(contractsCreatedByCreatorTwo.items).toHaveLength(2)
        expect(contractsCreatedByCreatorTwo.items[0]).toHaveProperty('id', address2)
      }

      expect(contractsCreatedByCreatorOne).not.toEqual(contractsCreatedByCreatorTwo)
    })

    it('should respect given limit and page parameters', async () => {
      const contractsOne = await contractResolvers.contractsCreatedBy(creator1, 2, 0)

      expect(contractsOne).toHaveProperty('totalCount', 4)
      expect(contractsOne).toHaveProperty('items')
      if (contractsOne.items) {
        expect(contractsOne.items).toHaveLength(2)
        expect(contractsOne.items[0]).toHaveProperty('id', address1)
        expect(contractsOne.items[1]).toHaveProperty('id', address3)
      }

      const contractsTwo = await contractResolvers.contractsCreatedBy(creator1, 2, 1)

      expect(contractsTwo).toHaveProperty('totalCount', 4)
      expect(contractsTwo).toHaveProperty('items')
      if (contractsTwo.items) {
        expect(contractsTwo.items).toHaveLength(2)
        expect(contractsTwo.items[0]).toHaveProperty('id', address5)
        expect(contractsTwo.items[1]).toHaveProperty('id', address6)
      }

      // Check an empty array is returned if no items available for requested page
      const contractsThree = await contractResolvers.contractsCreatedBy(creator3, 10, 1)
      expect(contractsThree).toHaveProperty('totalCount', 0)
      expect(contractsThree).toHaveProperty('items')
      expect(contractsThree.items).toHaveLength(0)
    })

    it('should convert an array of ContractEntity instances to an array of ContractDto instances', async () => {
      const contracts = await contractResolvers.contractsCreatedBy(creator1)
      const expected = [
        new ContractDto({ id: address1, address: address1, creator: creator1 }),
        new ContractDto({ id: address3, address: address3, creator: creator1 }),
        new ContractDto({ id: address5, address: address5, creator: creator1 }),
        new ContractDto({ id: address6, address: address6, creator: creator1 })
      ]
      expect(contracts.items).toEqual(expect.arrayContaining(expected))
    })
  })
})
