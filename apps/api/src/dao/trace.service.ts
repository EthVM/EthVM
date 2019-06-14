import { TransactionTraceEntity } from '@app/orm/entities/transaction-trace.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, In, Repository } from 'typeorm'

export interface TransactionStatus {
  blockHash: string
  transactionHash: string
  successful: boolean
}

@Injectable()
export class TraceService {

  constructor(
    @InjectRepository(TransactionTraceEntity)
    private readonly traceRepository: Repository<TransactionTraceEntity>,
  ) {
  }

  async findByTxHash(txHashes: string[]): Promise<TransactionTraceEntity[]> {
    return this.traceRepository.find({ where: { transactionHash: In(txHashes) } })
  }

  async findTxStatusByTxHash(entityManager: EntityManager, txHashes: string[]): Promise<TransactionStatus[]> {

    if (txHashes.length === 0) return []

    // find root level call trace and use it's error field to determine transaction status

    const entities = await entityManager.find(
      TransactionTraceEntity, {
        select: ['blockHash', 'transactionHash', 'rootError'],
        where: {
          transactionHash: In(txHashes),
        },
        cache: true
      })

    return entities.map(e => {
      const { blockHash, transactionHash, rootError } = e
      return { blockHash, transactionHash, successful: rootError === null } as TransactionStatus
    })

  }

  async findTxStatusByBlockHash(tx: EntityManager, blockHashes: string[]): Promise<TransactionStatus[]> {

    if (blockHashes.length === 0) return []

    // find root level call trace and use it's error field to determine transaction status

    const entities = await tx.find(TransactionTraceEntity, {
      select: ['blockHash', 'transactionHash', 'rootError'],
      where: {
        blockHash: In(blockHashes),
      },
      cache: true
    })

    return entities.map(e => {
      const { blockHash, transactionHash, rootError } = e
      return { blockHash, transactionHash, successful: rootError === null } as TransactionStatus
    })

  }

}
