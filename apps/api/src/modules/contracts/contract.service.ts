import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ContractEntity } from '@app/orm/entities/contract.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ContractService {
  constructor(@InjectRepository(ContractEntity) private readonly contractRepository: Repository<ContractEntity>) {}

  async findContractByAddress(address: string): Promise<ContractEntity | undefined> {
    return this.contractRepository.findOne({ where: { address }, relations: ['metadata', 'erc20Metadata'] })
  }

  async findContractsCreatedBy(creator: string, take: number = 10, page: number = 0): Promise<ContractEntity[]> {
    const skip = take * page
    return this.contractRepository.find({ where: { creator }, take, skip, relations: ['metadata', 'erc20Metadata'] })
  }
}
