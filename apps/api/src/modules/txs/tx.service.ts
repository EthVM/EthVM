import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TransactionEntity } from '@app/orm/entities-mongo/transaction.entity'
import { MongoRepository } from 'typeorm'

@Injectable()
export class TxService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: MongoRepository<TransactionEntity>,
  ) {}

  async findTx(hash: string): Promise<TransactionEntity | undefined> {
    return this.transactionRepository.findOne({ where: { hash } })
  }

  async findTxs(take: number = 10, page: number = 0, fromBlock: number = -1): Promise<TransactionEntity[]> {
    const skip = page * take
    const where = fromBlock !== -1 ? { blockNumber: { $lte: fromBlock } } : {}

    return this.transactionRepository.find({
      where,
      order: { blockNumber: -1, index: -1, timestamp: -1 },
      take,
      skip,
    })
  }

  async findTxsForBlock(hash: string): Promise<TransactionEntity[]> {
    return this.transactionRepository.find({ where: { blockHash: hash } })
  }

  async findTxsForAddress(hash: string, filter?: string, take: number = 10, page: number = 0): Promise<TransactionEntity[]> {
    const skip = page * take
    let where
    switch (filter) {
      case 'in':
        where = { to: hash }
        break
      case 'out':
        where = { from: hash }
        break
      default:
        where = { $or: [{ from: hash }, { to: hash }] }
        break
    }
    return this.transactionRepository.find({ where, take, skip })
  }

  async countTransactions(): Promise<number> {
    return this.transactionRepository.count()
  }
}
