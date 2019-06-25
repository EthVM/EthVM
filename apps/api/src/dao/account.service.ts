import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { AccountEntity } from '@app/orm/entities/account.entity'
import { BlockHeaderEntity } from '@app/orm/entities/block-header.entity'
import { ContractEntity } from '@app/orm/entities/contract.entity'
import { CONNECTION } from '@app/orm/config'

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity, CONNECTION.PRINCIPAL)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(BlockHeaderEntity, CONNECTION.PRINCIPAL)
    private readonly blockHeaderRepository: Repository<BlockHeaderEntity>,
    @InjectRepository(ContractEntity, CONNECTION.PRINCIPAL)
    private readonly contractRepository: Repository<ContractEntity>,
  ) {
  }

  async findAccountByAddress(address: string): Promise<AccountEntity | undefined> {
    return this.accountRepository.findOne({ where: { address }, cache: true })
  }

  async findIsMiner(address: string): Promise<boolean> {

    const header = await this.blockHeaderRepository.findOne({
      select: ['number'],
      where: {
        author: address,
      },
      cache: true,
    })

    return !!header
  }

  async findIsContractCreator(address: string): Promise<boolean> {

    const contract = await this.contractRepository.findOne({
      select: ['creator'],
      where: {
        creator: address,
      },
      cache: true,
    })

    return !!contract
  }
}
