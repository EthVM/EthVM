import { Test } from '@nestjs/testing'
import { ContractService } from './contract.service'
import { ContractResolvers } from './contract.resolvers'
import { ContractEntity } from '../../orm/entities/contract.entity'
import { ContractDto } from './contract.dto'
import { EthService } from '../../shared/eth.service'

const mockService = {
  async findContractByHash(hash) {},
  async findContractsCreatedBy(creator, limit, page) {}
}

describe('ContractResolvers', () => {

  let contractService: ContractService
  let contractResolvers: ContractResolvers

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ContractResolvers,
        EthService,
        {
          provide: ContractService,
          useValue: mockService
        }
      ],
    }).compile()
    contractService = module.get<ContractService>(ContractService)
    contractResolvers = module.get<ContractResolvers>(ContractResolvers)
  })

  const hash = '0000000000000000000000000000000000000000'
  const creator = '0000000000000000000000000000000000000001'
  const result = {
    id: hash,
    address: hash,
    creator
  }

  describe('contractByHash', () => {
    it('should return an instance of ContractDto matching the address hash provided', async () => {

      jest.spyOn(contractService, 'findContractByHash')
        .mockImplementation(() => new Promise(resolve => {
          resolve(new ContractEntity(result))
        }))

      expect(await contractResolvers.contractByHash(hash)).toEqual(new ContractDto(result))
    })
  })

  describe('contractsCreatedBy', () => {
    it('should return an array of ContractDto instances matching the creator hash provided', async () => {
      jest.spyOn(contractService, 'findContractsCreatedBy')
        .mockImplementation(() => new Promise(resolve => {
          resolve([new ContractEntity(result)])
        }))
      expect(await contractResolvers.contractsCreatedBy(creator, 1, 0)).toEqual([new ContractDto(result)])
    })
  })
})
