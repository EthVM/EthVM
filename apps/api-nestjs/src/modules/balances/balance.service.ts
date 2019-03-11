import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { BalanceEntity } from '@app/orm/entities/balance.entity'

@Injectable()
export class BalanceService {
  constructor(@InjectRepository(BalanceEntity) private readonly balanceRepository: MongoRepository<BalanceEntity>) {}

  async getBalances(limit: number = 10, page: number = 1): Promise<BalanceEntity[]> {
    let s = page * limit
    return this.balanceRepository.find({ take: limit, skip: s })
  }
}
