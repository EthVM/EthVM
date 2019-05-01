import {TransactionTraceEntity} from '@app/orm/entities/transaction-trace.entity'
import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {In, Repository} from 'typeorm'

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

  async findByBlockNumber(blockNumbers: string[]): Promise<TransactionTraceEntity[]> {
    return this.traceRepository.find({where: {blockNumber: In(blockNumbers)}})
  }

  async findByBlockHash(blockHashes: string[]): Promise<TransactionTraceEntity[]> {
    return this.traceRepository.find({where: {blockHash: In(blockHashes)}})
  }

  async findByTxHash(txHashes: string[]): Promise<TransactionTraceEntity[]> {
    return this.traceRepository.find({where: {transactionHash: In(txHashes)}})
  }

  async findTxStatusByTxHash(txHashes: string[]): Promise<TransactionStatus[]> {

    if (txHashes.length === 0) return []

    // find root level call trace and use it's error field to determine transaction status

    const entities = await this.traceRepository.find({
      select: ['blockHash', 'transactionHash', 'error'],
      where: {
        transactionHash: In(txHashes),
        traceAddress: '[]',
      },
    })

    return entities.map(e => {
      const {blockHash, transactionHash, error} = e
      return {blockHash, transactionHash, successful: error === null} as TransactionStatus
    })

  }

  async findTxStatusByBlockHash(blockHashes: string[]): Promise<TransactionStatus[]> {

    if(blockHashes.length === 0) return []

    // find root level call trace and use it's error field to determine transaction status

    const entities = await this.traceRepository.find({
      select: ['blockHash', 'transactionHash', 'error'],
      where: {
        blockHash: In(blockHashes),
        traceAddress: '[]',
      },
    })

    return entities.map(e => {
      const {blockHash, transactionHash, error} = e
      return {blockHash, transactionHash, successful: error === null} as TransactionStatus
    })

  }

}
