import {Injectable} from '@nestjs/common'
import {EntityManager, FindManyOptions, In} from 'typeorm'
import {TransactionReceiptEntity} from '@app/orm/entities/transaction-receipt.entity'

@Injectable()
export class ReceiptService {

  constructor() {
  }

  /**
   * Find many receipt entities matching an array of transaction hashes.
   * @param {EntityManager} entityManager - The txn within which to perform the query.
   * @param {string[]} txHashes - The array of transaction hashes.
   * @param {string[]} [select=[]] - An optional array of fields to select.
   * @returns {Promise<TransactionReceiptEntity[]>}
   */
  async findByTxHash(entityManager: EntityManager, txHashes: string[], select: string[] = []): Promise<TransactionReceiptEntity[]> {

    if (!(txHashes && txHashes.length)) {
      return []
    }

    const options: FindManyOptions = {
      where: { transactionHash: In(txHashes) },
      cache: true,
    }

    if (select.length > 0) {
      options.select = select // Only add the select clause if fields are given, otherwise select all fields.
    }

    return entityManager.find(TransactionReceiptEntity, options)
  }
}
