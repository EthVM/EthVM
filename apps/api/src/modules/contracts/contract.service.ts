import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ContractEntity } from '@app/orm/entities/contract.entity'
import { FindManyOptions, In, Repository } from 'typeorm'
import { TransactionEntity } from '@app/orm/entities/transaction.entity'
import { TransactionReceiptEntity } from '@app/orm/entities/transaction-receipt.entity'

@Injectable()
export class ContractService {
  constructor(@InjectRepository(ContractEntity) private readonly contractRepository: Repository<ContractEntity>,
              @InjectRepository(TransactionEntity) private readonly txRepository: Repository<TransactionEntity>,
              @InjectRepository(TransactionReceiptEntity) private readonly txReceiptRepository: Repository<TransactionReceiptEntity>) {}

  async findContractByAddress(address: string): Promise<ContractEntity | undefined> {
    return this.contractRepository.findOne({ where: { address }, relations: ['metadata', 'erc20Metadata'] })
  }

  async findContractsCreatedBy(creator: string, take: number = 10, page: number = 0): Promise<[ContractEntity[], number]> {
    const skip = take * page
    const contractsPage = await this.contractRepository.findAndCount({ where: { creator }, take, skip, relations: ['metadata', 'erc20Metadata'] })
    contractsPage[0] = await this.findTxsForContracts(contractsPage[0])
    return contractsPage
  }

  private async findTxsForContracts(contracts: ContractEntity[]): Promise<ContractEntity[]> {

    const txHashes = contracts.map(c => c.traceCreatedAtTransactionHash)
    const txs = await this.txRepository.find({ where: { hash: In(txHashes) }, select: ['hash', 'timestamp', 'gasPrice'] } as FindManyOptions)
    const txReceipts = await this.txReceiptRepository.find({
      where: { transactionHash: In(txHashes) },
      select: ['gasUsed', 'transactionHash'],
    } as FindManyOptions)

    const contractsByTxHash = contracts.reduce((memo, next) => {
      memo[next.traceCreatedAtTransactionHash] = next
      return memo
    }, {})

    txs.forEach(tx => {
      contractsByTxHash[tx.hash].createdAtTx = tx
    })
    txReceipts.forEach(receipt => {
      contractsByTxHash[receipt.transactionHash].createdAtTx.receipt = receipt
    })

    return Object.values(contractsByTxHash)

  }
}
