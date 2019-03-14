import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { BalanceEntity } from '@app/orm/entities/balance.entity'

@Injectable()
export class BalanceService {
  constructor(@InjectRepository(BalanceEntity) private readonly balanceRepository: MongoRepository<BalanceEntity>) {}

  async findBalanceByHash(hash: string): Promise<BalanceEntity | null> {
    return this.balanceRepository.findOne({ where: { address: hash } })
  }
}
