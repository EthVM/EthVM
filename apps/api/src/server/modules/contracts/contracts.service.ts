import { ContractsRepository } from '@app/server/modules/contracts'
import { Contract } from 'ethvm-common'


export interface ContractsService {
  getContract(hash: string): Promise<Contract | null>
}

export class ContractsServiceImpl implements ContractsService {
  constructor(private readonly contractsRepository: ContractsRepository) {}

  getContract(hash: string): Promise<any> {
    return this.contractsRepository.getContract(hash)
  }
}
