import {TransactionReceiptEntity} from '@app/orm/entities/transaction-receipt.entity'
import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import { EntityManager, FindManyOptions, In, Repository } from 'typeorm'

@Injectable()
export class ReceiptService {

  constructor(
    @InjectRepository(TransactionReceiptEntity) private readonly receiptRepository: Repository<TransactionReceiptEntity>,
  ) {
  }

  async findByBlockNumber(...blockNumbers: string[]): Promise<TransactionReceiptEntity[]> {
    return this.receiptRepository.find({where: {blockNumber: In(blockNumbers)}})
  }

  async findByBlockHash(...blockHashes: string[]): Promise<TransactionReceiptEntity[]> {
    return this.receiptRepository.find({where: {blockHash: In(blockHashes)}})
  }

  async findByTxHash(entityManager: EntityManager, txHashes: string[], select: string[] = []): Promise<TransactionReceiptEntity[]> {

    if (!(txHashes && txHashes.length)) {
      return []
    }

    const options: FindManyOptions = {
      where: {transactionHash: In(txHashes)},
    }

    if (select.length > 0) {
      options.select = select
    }

    return entityManager.find(TransactionReceiptEntity, options)
  }
}
