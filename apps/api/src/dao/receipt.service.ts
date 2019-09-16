import {Injectable} from '@nestjs/common'
import {EntityManager, FindManyOptions, In} from 'typeorm'
import {TransactionReceiptEntity} from '@app/orm/entities/transaction-receipt.entity';

@Injectable()
export class ReceiptService {

  constructor() {
  }

  async findByTxHash(entityManager: EntityManager, txHashes: string[], select: string[] = []): Promise<TransactionReceiptEntity[]> {

    if (!(txHashes && txHashes.length)) {
      return []
    }

    const options: FindManyOptions = {
      where: { transactionHash: In(txHashes) },
      cache: true,
    }

    if (select.length > 0) {
      options.select = select
    }

    return entityManager.find(TransactionReceiptEntity, options)
  }
}
