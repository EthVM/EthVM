import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ContractEntity } from '@app/orm/entities-mongo/contract.entity'
import { MongoRepository } from 'typeorm'

@Injectable()
export class ContractService {
  constructor(@InjectRepository(ContractEntity) private readonly contractRepository: MongoRepository<ContractEntity>) {}

  async findContractByHash(hash: string): Promise<ContractEntity | undefined> {
    return this.contractRepository.findOne({ where: { _id: hash } })
  }

  async findContractsCreatedBy(creator: string, take: number = 10, page: number = 0): Promise<ContractEntity[]> {
    const skip = take * page
    return this.contractRepository.find({ where: { creator }, take, skip })
  }
}
