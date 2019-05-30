import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { AccountEntity } from '@app/orm/entities/account.entity'
import { BlockHeaderEntity } from '@app/orm/entities/block-header.entity'
import { ContractEntity } from '@app/orm/entities/contract.entity'

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(BlockHeaderEntity)
    private readonly blockHeaderRepository: Repository<BlockHeaderEntity>,
    @InjectRepository(ContractEntity)
    private readonly contractRepository: Repository<ContractEntity>
  ) {
  }

  async findAccountByAddress(address: string): Promise<AccountEntity | undefined> {
    return this.accountRepository.findOne({ where: { address } })
  }

  async findIsMiner(address: string): Promise<boolean> {

    const header = await this.blockHeaderRepository.findOne({
      select: ['number'],
      where: {
        author: address
      }
    })

    return !!header
  }

  async findIsContractCreator(address: string): Promise<boolean> {

    const contract = await this.contractRepository.findOne({
      select: ['creator'],
      where: {
        creator: address
      }
    })

    return !!contract
  }
}
