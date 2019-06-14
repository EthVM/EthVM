import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { ContractEntity } from '@app/orm/entities/contract.entity'
import { EntityManager, FindManyOptions, In, Repository } from 'typeorm'
import { TxService } from '@app/dao/tx.service'
import { ContractSummary, TransactionSummary } from '@app/graphql/schema'

@Injectable()
export class ContractService {
  constructor(@InjectRepository(ContractEntity)
              private readonly contractRepository: Repository<ContractEntity>,
              @Inject(forwardRef(() => TxService))
              private readonly txService: TxService,
              @InjectEntityManager()
              private readonly entityManager: EntityManager) {
  }

  async findContractByAddress(address: string): Promise<ContractEntity | undefined> {
    return this.contractRepository.findOne({where: {address}, relations: ['metadata', 'erc20Metadata']})
  }

  async findAllByAddress(entityManager: EntityManager, addresses: string[]): Promise<ContractEntity[]> {

    if (!addresses.length) return []

    return entityManager.find(ContractEntity, {
        where: {address: In(addresses)},
        relations: ['metadata', 'erc20Metadata', 'erc721Metadata'],
        cache: true,
      },
    )
  }

  async findContractsCreatedBy(creator: string, offset: number = 0, limit: number = 10): Promise<[ContractSummary[], number]> {

    return this.entityManager.transaction(
      'READ COMMITTED',
      async (txn): Promise<[ContractSummary[], number]> => {

        const where = {creator}

        const count = await txn.count(ContractEntity, {where, cache: true})

        const contracts = await txn.find(ContractEntity, {
          select: ['address', 'creator', 'traceCreatedAtBlockNumber', 'traceCreatedAtTransactionHash'],
          where,
          skip: offset,
          take: limit,
          cache: true,
        })

        // Get tx summaries
        const txSummaries = await this.txService
          .findSummariesByHash(
            contracts.map(c => c.traceCreatedAtTransactionHash),
            txn,
          )

        // Map summaries to contracts
        const summariesByHash = new Map<string, TransactionSummary>()
        txSummaries.forEach(tx => {
          summariesByHash.set(tx.transactionHash, tx)
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
      },
    )
  }
}
