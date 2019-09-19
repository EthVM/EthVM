import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, In, Repository } from 'typeorm'
import {TraceEntity} from '@app/orm/entities/trace.entity'

/**
 * Interface for transaction statuses
 * @interface
 */
export interface TransactionStatus {
  blockHash: string
  transactionHash: string
  successful: boolean
}

@Injectable()
export class TraceService {

  constructor(
    @InjectRepository(TraceEntity)
    private readonly traceRepository: Repository<TraceEntity>,
  ) {
  }

  /**
   * Find trace entities matching an array of transaction hashes.
   * @param {string[]} txHashes - The array of transaction hashes.
   * @returns {Promise<TraceEntity[]>}
   */
  async findByTxHash(txHashes: string[]): Promise<TraceEntity[]> {
    return this.traceRepository.find({ where: { transactionHash: In(txHashes) }, cache: true })
  }

  /**
   * Find transaction statuses matching an array of transaction hashes.
   * @param {EntityManager} entityManager - The txn within which to perform the query.
   * @param {string[]} txHashes - The array of transaction hashes.
   * @returns {Promise<TransactionStatus[]>}
   */
  async findTxStatusByTxHash(entityManager: EntityManager, txHashes: string[]): Promise<TransactionStatus[]> {

    if (txHashes.length === 0) return []

    // Find root level call trace and use it's error field to determine transaction status.

    const entities = await entityManager.find(
      TraceEntity, {
        select: ['blockHash', 'transactionHash', 'rootError'],
        where: {
          transactionHash: In(txHashes),
        },
        cache: true,
      })

    // Map trace entities to TransactionStatus objects before returning.
    return entities.map(e => {
      const { blockHash, transactionHash, rootError } = e
      return { blockHash, transactionHash, successful: rootError === null } as TransactionStatus
    })

  }

  /**
   * Find transaction statuses matching an array of block hashes.
   * @param {EntityManager} tx - The txn within which to perform the query.
   * @param {string[]} blockHashes - The array of block hashes.
   * @param {boolean} [cache=true] - Whether to use the cache.
   * @returns {Promise<TransactionStatus[]>}
   */
  async findTxStatusByBlockHash(tx: EntityManager, blockHashes: string[], cache: boolean = true): Promise<TransactionStatus[]> {

    if (blockHashes.length === 0) return []

    // find root level call trace and use it's error field to determine transaction status.

    const entities = await tx.find(TraceEntity, {
      select: ['blockHash', 'transactionHash', 'rootError'],
      where: {
        blockHash: In(blockHashes),
      },
      cache,
    })

    // Map trace entities to TransactionStatus objects before returning.
    return entities.map(e => {
      const { blockHash, transactionHash, rootError } = e
      return { blockHash, transactionHash, successful: rootError === null } as TransactionStatus
    })

  }

}
