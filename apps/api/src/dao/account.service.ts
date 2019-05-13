import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { AccountEntity } from '@app/orm/entities/account.entity'

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>
  ) {}

  async findAccountByAddress(address: string): Promise<AccountEntity | undefined> {
    return this.accountRepository.findOne({ where: { address } })
  }
}
