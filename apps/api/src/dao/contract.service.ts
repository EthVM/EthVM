import {forwardRef, Inject, Injectable} from '@nestjs/common'
import {InjectEntityManager, InjectRepository} from '@nestjs/typeorm'
import {EntityManager, In, LessThanOrEqual, Repository} from 'typeorm'
import {TxService} from '@app/dao/tx.service'
import {ContractSummary, TransactionSummary} from '@app/graphql/schema'
import BigNumber from 'bignumber.js'
import {MetadataService} from '@app/dao/metadata.service'
import {ContractEntity} from '@app/orm/entities/contract.entity'
import {AddressContractsCreatedCountEntity} from '@app/orm/entities/address-contracts-created-count.entity';

@Injectable()
export class ContractService {
  constructor(@InjectRepository(ContractEntity)
              private readonly contractRepository: Repository<ContractEntity>,
              @Inject(forwardRef(() => TxService))
              private readonly txService: TxService,
              @InjectEntityManager()
              private readonly entityManager: EntityManager,
              private readonly metadataService: MetadataService) {
  }

  async findContractByAddress(address: string, blockNumber?: BigNumber): Promise<ContractEntity | undefined> {

    blockNumber = blockNumber || await this.metadataService.latestBlockNumber()
    if (!blockNumber) { return undefined } // No data in DB

    const item = await this.contractRepository.createQueryBuilder('c')
      .leftJoinAndSelect('c.ethListContractMetadata', 'elcm')
      .leftJoinAndSelect('c.contractMetadata', 'cm')
      .where('c.address = :address', { address })
      .andWhere('c.createdAtBlockNumber <= :blockNumber', { blockNumber: blockNumber.toNumber() })
      .getOne()

    if (!item) {
      return undefined
    }

    // Nullify destroyed at fields if destroyed after blockNumber
    if (item.destroyedAtBlockNumber && item.destroyedAtBlockNumber.isGreaterThan(blockNumber)) {
      item.destroyedAtBlockNumber = undefined
      item.destroyedAtBlockHash = undefined
      item.destroyedAtTimestamp = undefined
      item.destroyedAtTraceAddress = undefined
      item.destroyedAtTransactionHash = undefined
    }

    return item
  }

  async findAllByAddress(entityManager: EntityManager, addresses: string[]): Promise<ContractEntity[]> {

    if (!addresses.length) return []

    return entityManager.find(ContractEntity, {
        where: { address: In(addresses) },
        relations: ['ethListContractMetadata', 'contractMetadata'],
        cache: true,
      },
    )
  }

  async findContractsCreatedBy(
    creator: string,
    blockNumber: BigNumber,
    offset: number = 0,
    limit: number = 10,
  ): Promise<[ContractSummary[], boolean, BigNumber]> {

    return this.entityManager.transaction(
      'READ COMMITTED',
      async (txn): Promise<[ContractSummary[], boolean, BigNumber]> => {

        // Get count
        const contractsCreatedCount = await txn.findOne(AddressContractsCreatedCountEntity, {
          where: { address: creator, blockNumber: LessThanOrEqual(blockNumber) },
          order: { blockNumber: 'DESC' },
          cache: true,
        })
        const count = contractsCreatedCount ? contractsCreatedCount.count : undefined

        if (!count) {
          return [[], false, new BigNumber(0)]
        }

        // Get items

        const where = { creator, createdAtBlockNumber: LessThanOrEqual(blockNumber) }

        const contracts = await txn.find(ContractEntity, {
          select: ['address', 'creator', 'createdAtBlockNumber', 'createdAtTransactionHash'],
          where,
          order: { createdAtBlockNumber: 'DESC' },
          skip: offset,
          take: limit + 1,
          cache: true,
        })

        const hasMore = contracts.length > limit
        if (hasMore) {
          contracts.pop()
        }

        // Get tx summaries
        const txSummaries = await this.txService
          .findSummariesByHash(
            contracts.map(c => c.createdAtTransactionHash),
            txn,
          )

        // Map summaries to contracts
        const summariesByHash = new Map<string, TransactionSummary>()
        txSummaries.forEach(tx => {
          summariesByHash.set(tx.hash, tx)
        })

        const contractSummaries = contracts.map(c => {
          const txSummary = summariesByHash.get(c.createdAtTransactionHash)
          return {
            address: c.address,
            creator: c.creator,
            txFee: txSummary!.fee,
            timestamp: txSummary!.timestamp,
            blockNumber: c.createdAtBlockNumber,
            txHash: c.createdAtTransactionHash,
          } as ContractSummary
        })

        return [contractSummaries, hasMore, count]
      },
    )
  }
}
