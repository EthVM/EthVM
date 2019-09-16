import {Injectable} from '@nestjs/common'
import {InjectEntityManager, InjectRepository} from '@nestjs/typeorm'
import {EntityManager, FindManyOptions, LessThanOrEqual, Repository} from 'typeorm'
import BigNumber from 'bignumber.js'
import {FilterEnum} from '@app/graphql/schema'
import {ETH_ADDRESS} from '@app/shared/eth.service'
import {BalanceDeltaEntity} from '@app/orm/entities/balance-delta.entity';
import {AddressInternalTransactionCountEntity} from '@app/orm/entities/address-internal-transaction-count.entity';

@Injectable()
export class TransferService {

  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(BalanceDeltaEntity)
    private readonly balanceDeltaRepository: Repository<BalanceDeltaEntity>,
  ) {
  }

  async findContractTokenTransfers(
    contractAddress: string,
    offset: number = 0,
    limit: number = 10,
    blockNumber: BigNumber,
  ): Promise<[BalanceDeltaEntity[], boolean]> {
    const findOptions: FindManyOptions<BalanceDeltaEntity> = {
      where: {deltaType: 'TOKEN_TRANSFER', contractAddress, isReceiving: true, blockNumber: LessThanOrEqual(blockNumber)},
      skip: offset,
      take: limit + 1,
      order: {blockNumber: 'DESC', transactionIndex: 'DESC', id: 'DESC'},
      cache: true,
    }
    const items = await this.balanceDeltaRepository.find(findOptions)
    const hasMore = items.length > limit
    if (hasMore) {
      items.pop()
    }
    return [items, hasMore]
  }

  async findContractTokenTransfersForAddress(
    contractAddress: string,
    address: string,
    filter: string = 'all',
    offset: number = 0,
    limit: number = 10,
    blockNumber: BigNumber,
  ): Promise<[BalanceDeltaEntity[], boolean]> {

    const builder = this.balanceDeltaRepository.createQueryBuilder('b')
      .where('b.delta_type = :deltaType')
      .andWhere('b.contract_address = :contractAddress')
      .andWhere('b.address = :address')
      .andWhere('b.block_number <= :blockNumber')

    switch (filter) {
      case 'in':
        builder.andWhere('b.is_receiving = true')
        break
      case 'out':
        builder.andWhere('b.is_receiving = false')
        break
      default:
        break
    }

    const items = await builder
      .setParameters({ contractAddress, deltaType: 'TOKEN_TRANSFER', address, blockNumber: blockNumber.toNumber() })
      .orderBy('b.block_number', 'DESC')
      .addOrderBy('b.transaction_index', 'DESC')
      .addOrderBy('b.id', 'DESC')
      .offset(offset)
      .limit(limit + 1)
      .cache(true)
      .getMany()

    const hasMore = items.length > limit
    if (hasMore) {
      items.pop()
    }

    return [items, hasMore]
  }

  async countContractTokenTransfersForAddress(contractAddress: string, address: string, blockNumber: BigNumber): Promise<BigNumber> {

    return new BigNumber(await this.balanceDeltaRepository.createQueryBuilder('b')
      .where('b.delta_type = :deltaType')
      .andWhere('b.contract_address = :contractAddress')
      .andWhere('b.address = :address')
      .andWhere('b.block_number <= :blockNumber')
      .setParameters({ deltaType: 'TOKEN_TRANSFER', address, contractAddress, blockNumber: blockNumber.toNumber() })
      .getCount())

  }

  async findInternalTransactionsForAddress(
    address: string,
    offset: number = 0,
    limit: number = 10,
    blockNumber: BigNumber,
  ): Promise<[BalanceDeltaEntity[], boolean, BigNumber]> {

    return this.entityManager.transaction(
      'READ COMMITTED',
      async (txn): Promise<[BalanceDeltaEntity[], boolean, BigNumber]> => {

        // Get total count
        const internalTxsCount = await txn.findOne(AddressInternalTransactionCountEntity, {
          where: { address, blockNumber: LessThanOrEqual(blockNumber) },
          order: { blockNumber: 'DESC' },
          cache: true,
        })

        const count = internalTxsCount ? internalTxsCount.total : undefined
        if (!count) {
          return [[], false, new BigNumber(0)]
        }

        // Get deltas

        const deltaTypes = ['CONTRACT_CREATION', 'CONTRACT_DESTRUCTION', 'INTERNAL_TX']

        const items = await txn.createQueryBuilder(BalanceDeltaEntity, 'b')
          .where('b.address = :address')
          .andWhere('b.delta_type IN (:...deltaTypes)')
          .andWhere('b.block_number <= :blockNumber')
          .setParameters({ address, deltaTypes, blockNumber: blockNumber.toNumber() })
          .orderBy('block_number', 'DESC')
          .addOrderBy('transaction_index', 'DESC')
          .addOrderBy('id', 'DESC') // Ensure desc ordering within a transaction
          .offset(offset)
          .limit(limit + 1)
          .cache(true)
          .getMany()

        const hasMore = items.length > limit
        if (hasMore) {
          items.pop()
        }

        return [items, hasMore, count]

      },
    )

  }

  async findBalanceDeltas(
    addresses: string[],
    contracts: string[] = [],
    filter: FilterEnum = FilterEnum.all,
    offset: number = 0,
    limit: number = 10,
    blockNumber: BigNumber,
    timestampTo?: number,
    timestampFrom?: number,
  ): Promise<[BalanceDeltaEntity[], boolean]> {

    const qb = this.balanceDeltaRepository.createQueryBuilder('bd')
      .where('bd.address IN (:...addresses)', { addresses })
      .andWhere('bd.block_number <= :blockNumber', { blockNumber: blockNumber.toNumber() })

    if (contracts.length) {
      // Replace "EthAddress" with empty string
      const ethAddressIdx = contracts.indexOf(ETH_ADDRESS)
      if (ethAddressIdx > -1) {
        contracts[ethAddressIdx] = ''
      }
      qb.andWhere('bd.contract_address IN (:...contracts)', { contracts })
    }

    if (filter === FilterEnum.in) {
      qb.andWhere('bd.is_receiving = TRUE')
    } else if (filter === FilterEnum.out) {
      qb.andWhere('bd.receiving === FALSE')
    }

    if (timestampTo) {
      qb.andWhere('bd.timestamp < :timestampTo', { timestampTo: new Date(timestampTo * 1000).toISOString() })
    }
    if (timestampFrom) {
      qb.andWhere('bd.timestamp > :timestampFrom', { timestampFrom: new Date(timestampFrom * 1000).toISOString() })
    }

    const items = await qb.orderBy('bd.block_number', 'DESC')
      .addOrderBy('bd.transaction_index', 'DESC')
      .addOrderBy('bd.id', 'DESC')
      .offset(offset)
      .limit(limit + 1) // Request one extra item to determine if there are more pages
      .getMany()

    const hasMore = items.length > limit
    if (hasMore) {
      items.pop()
    }

    return [items, hasMore]

  }

}
