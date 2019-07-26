import { Injectable } from '@nestjs/common'
import { In, Not, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { AccountEntity } from '@app/orm/entities/account.entity'
import { BlockHeaderEntity } from '@app/orm/entities/block-header.entity'
import { ContractEntity } from '@app/orm/entities/contract.entity'
import { DbConnection } from '@app/orm/config'
import { InternalTransferEntity } from '@app/orm/entities/internal-transfer.entity'
import BigNumber from 'bignumber.js'

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity, DbConnection.Principal)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(BlockHeaderEntity, DbConnection.Principal)
    private readonly blockHeaderRepository: Repository<BlockHeaderEntity>,
    @InjectRepository(ContractEntity, DbConnection.Principal)
    private readonly contractRepository: Repository<ContractEntity>,
    @InjectRepository(InternalTransferEntity, DbConnection.Principal)
    private readonly internalTransferRepository: Repository<InternalTransferEntity>,
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

    const transfer = await this.internalTransferRepository.findOne({
      select: ['id'],
      where: { address, amount: Not(new BigNumber(0)) },
      cache: true,
    })

    return !!transfer

  }
}
