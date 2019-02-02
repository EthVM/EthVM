import { ContractsRepository } from '@app/server/modules/contracts'
import { Contract } from 'ethvm-common'


export interface ContractsService {
  getContract(hash: string): Promise<Contract | null>
  getContractsCreatedBy(hash: string, limit: number, page: number): Promise<Contract[]>
}

export class ContractsServiceImpl implements ContractsService {
  constructor(private readonly contractsRepository: ContractsRepository) {}

  public getContract(hash: string): Promise<Contract | null> {
    return this.contractsRepository.getContract(hash)
  }

  public getContractsCreatedBy(hash: string, limit: number = 10, page: number = 0): Promise<Contract[]> {
    return this.contractsRepository.getContractsCreatedBy(hash, limit, page)
  }
}
