import {TransactionReceiptEntity} from '@app/orm/entities/transaction-receipt.entity'
import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {FindManyOptions, In, Repository} from 'typeorm'

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

  async findByTxHash(txHashes: string[], select: string[] = []): Promise<TransactionReceiptEntity[]> {

    const options: FindManyOptions = {
      where: {transactionHash: In(txHashes)},
    }

    if (select.length > 0) {
      options.select = select
    }

    return this.receiptRepository.find(options)
  }
}
