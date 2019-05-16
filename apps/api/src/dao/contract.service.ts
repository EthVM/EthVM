import { forwardRef, Inject, Injectable } from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {ContractEntity} from '@app/orm/entities/contract.entity'
import {FindManyOptions, In, Repository} from 'typeorm'
import {TransactionReceiptEntity} from '@app/orm/entities/transaction-receipt.entity'
import {TransactionEntity} from '@app/orm/entities/transaction.entity'
import { TxService } from '@app/dao/tx.service'
import { ContractSummary, TransactionSummary } from '@app/graphql/schema'

@Injectable()
export class ContractService {
  constructor(@InjectRepository(ContractEntity) private readonly contractRepository: Repository<ContractEntity>,
              @Inject(forwardRef(() => TxService)) private readonly txService: TxService) {
  }

  async findContractByAddress(address: string): Promise<ContractEntity | undefined> {
    return this.contractRepository.findOne({where: {address}, relations: ['metadata', 'erc20Metadata']})
  }

  async findAllByAddress(addresses: string[]): Promise<ContractEntity[]> {

    if (!addresses.length) return []

    return this.contractRepository.find(
      {
        where: {address: In(addresses)},
        relations: ['metadata', 'erc20Metadata', 'erc721Metadata'],
      },
    )
  }

  async findContractsCreatedBy(creator: string, offset: number = 0, limit: number = 10): Promise<[ContractSummary[], number]> {
    const [contracts, count] = await this.contractRepository.findAndCount({
      where: {creator},
      take: limit,
      skip: offset,
      select: ['address', 'creator', 'traceCreatedAtBlockNumber', 'traceCreatedAtTransactionHash'],
    })

    // Get tx summaries
    const txSummaries = await this.txService.findSummariesByHash(contracts.map(c => c.traceCreatedAtTransactionHash))

    // Map summaries to contracts
    const summariesByHash = new Map<string, TransactionSummary>()
    txSummaries.forEach(tx => {
      summariesByHash.set(tx.hash, tx)
    })

    const contractSummaries = contracts.map(c => {
      const txSummary = summariesByHash.get(c.traceCreatedAtTransactionHash)
      return {
        address: c.address,
        creator: c.creator,
        txFee: txSummary!.fee,
        timestamp: txSummary!.timestamp,
        blockNumber: c.traceCreatedAtBlockNumber,
        txHash: c.traceCreatedAtTransactionHash,
      } as ContractSummary
    })

    return [contractSummaries, count]
  }
}
