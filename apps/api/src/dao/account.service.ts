import { Injectable } from '@nestjs/common'
import { In, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { AccountEntity } from '@app/orm/entities/account.entity'
import { BlockHeaderEntity } from '@app/orm/entities/block-header.entity'
import { ContractEntity } from '@app/orm/entities/contract.entity'
import { DbConnection } from '@app/orm/config'
import { FungibleBalanceTransferEntity } from '@app/orm/entities/fungible-balance-transfer.entity'

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity, DbConnection.Principal)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(BlockHeaderEntity, DbConnection.Principal)
    private readonly blockHeaderRepository: Repository<BlockHeaderEntity>,
    @InjectRepository(ContractEntity, DbConnection.Principal)
    private readonly contractRepository: Repository<ContractEntity>,
    @InjectRepository(FungibleBalanceTransferEntity, DbConnection.Principal)
    private readonly transferRepository: Repository<FungibleBalanceTransferEntity>,
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

  async findHasInternalTransfers(address: string): Promise<boolean> {

    const deltaTypes = ['INTERNAL_TX', 'CONTRACT_CREATION', 'CONTRACT_DESTRUCTION']

    const transfer = await this.transferRepository.findOne({
      where: [{ to: address, deltaType: In(deltaTypes) }, { from: address, deltaType: In(deltaTypes) }],
      cache: true,
    })

    return !!transfer;

  }
}
