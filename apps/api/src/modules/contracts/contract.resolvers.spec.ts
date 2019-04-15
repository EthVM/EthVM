import { Test } from '@nestjs/testing'
import { ContractService } from './contract.service'
import { ContractResolvers } from './contract.resolvers'
import { ContractEntity } from '../../orm/entities/contract.entity'
import { ContractDto } from './contract.dto'
import { EthService } from '../../shared/eth.service'

const hashOne = '0000000000000000000000000000000000000001'
const hashTwo = '0000000000000000000000000000000000000002'
const hashThree = '0000000000000000000000000000000000000003'
const hashFour = '0000000000000000000000000000000000000004'
const hashFive = '0000000000000000000000000000000000000005'
const hashSix = '0000000000000000000000000000000000000006'
const hashSeven = '0000000000000000000000000000000000000007'

const creatorOne = '0000000000000000000000000000000000000004'
const creatorTwo = '0000000000000000000000000000000000000005'
const creatorThree = '0000000000000000000000000000000000000006'

const contracts = {
  '0000000000000000000000000000000000000001': {
    id: hashOne,
    address: hashOne,
    creator: creatorOne
  },
  '0000000000000000000000000000000000000002': {
    id: hashTwo,
    address: hashTwo,
    creator: creatorTwo
  },
  '0000000000000000000000000000000000000003': {
    id: hashThree,
    address: hashThree,
    creator: creatorOne
  },
  '0000000000000000000000000000000000000004': {
    id: hashFour,
    address: hashFour,
    creator: creatorTwo
  },
  '0000000000000000000000000000000000000005': {
    id: hashFive,
    address: hashFive,
    creator: creatorOne
  },
  '0000000000000000000000000000000000000006': {
    id: hashSix,
    address: hashSix,
    creator: creatorOne
  }
}

const mockService = {
  async findContractByHash(hash) {
    const data = contracts[hash]
    return data ? new ContractEntity(data) : null
  },
  async findContractsCreatedBy(creator, limit = 10, page = 0) {
    const contractsCreatedBy = Object.values(contracts).filter(b => b.creator === creator)
    const start = page * limit
    const end = start + limit
    const items = contractsCreatedBy.slice(start, end)
    return items.map(i => new ContractEntity(i))
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
      expect(await contractResolvers.contractByHash(hashSeven)).toEqual(null)
    })

    it('should return an instance of ContractDto matching the address hash provided', async () => {
      const contractOne = await contractResolvers.contractByHash(hashOne)
      const contractTwo = await contractResolvers.contractByHash(hashTwo)

      // check that distinct objects are returned based on hash and that they do not equal each other

      expect(contractOne).not.toBeNull()
      expect(contractOne).toBeInstanceOf(ContractDto)
      expect(contractOne).toHaveProperty('id', hashOne)

      expect(contractTwo).not.toBeNull()
      expect(contractTwo).toBeInstanceOf(ContractDto)
      expect(contractTwo).toHaveProperty('id', hashTwo)

      expect(contractOne).not.toEqual(contractTwo)
    })

    it('should convert a ContractEntity to a ContractDto', async () => {
      const contractOne = await contractResolvers.contractByHash(hashOne)

      expect(contractOne).toEqual(
        new ContractDto({
          id: hashOne,
          address: hashOne,
          creator: creatorOne
        })
      )
    })
  })

  describe('contractsCreatedBy', () => {
    it('should return an array of ContractDto instances created by the address provided', async () => {
      const contractsCreatedByCreatorOne = await contractResolvers.contractsCreatedBy(creatorOne)
      const contractsCreatedByCreatorTwo = await contractResolvers.contractsCreatedBy(creatorTwo)

      expect(contractsCreatedByCreatorOne).toHaveLength(4)
      expect(contractsCreatedByCreatorOne[0]).toHaveProperty('id', hashOne)

      expect(contractsCreatedByCreatorTwo).toHaveLength(2)
      expect(contractsCreatedByCreatorTwo[0]).toHaveProperty('id', hashTwo)

      expect(contractsCreatedByCreatorOne).not.toEqual(contractsCreatedByCreatorTwo)
    })

    it('should respect given limit and page parameters', async () => {
      const contractsOne = await contractResolvers.contractsCreatedBy(creatorOne, 2, 0)
      expect(contractsOne).toHaveLength(2)
      expect(contractsOne[0]).toHaveProperty('id', hashOne)
      expect(contractsOne[1]).toHaveProperty('id', hashThree)

      const contractsTwo = await contractResolvers.contractsCreatedBy(creatorOne, 2, 1)
      expect(contractsTwo).toHaveLength(2)
      expect(contractsTwo[0]).toHaveProperty('id', hashFive)
      expect(contractsTwo[1]).toHaveProperty('id', hashSix)

      // Check an empty array is returned if no items available for requested page
      const contractsThree = await contractResolvers.contractsCreatedBy(creatorThree, 10, 1)
      expect(contractsThree).toHaveLength(0)
    })

    it('should convert an array of ContractEntity instances to an array of ContractDto instances', async () => {
      const contracts = await contractResolvers.contractsCreatedBy(creatorOne)
      const expected = [
        new ContractDto({ id: hashOne, address: hashOne, creator: creatorOne }),
        new ContractDto({ id: hashThree, address: hashThree, creator: creatorOne }),
        new ContractDto({ id: hashFive, address: hashFive, creator: creatorOne }),
        new ContractDto({ id: hashSix, address: hashSix, creator: creatorOne })
      ]
      expect(contracts).toEqual(expect.arrayContaining(expected))
    })
  })
})
