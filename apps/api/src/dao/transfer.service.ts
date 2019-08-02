import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { Brackets, EntityManager, FindManyOptions, Repository } from 'typeorm'
import { FungibleBalanceTransferEntity } from '@app/orm/entities/fungible-balance-transfer.entity'
import { FungibleBalanceDeltaEntity } from '@app/orm/entities/fungible-balance-delta.entity'
import { DbConnection } from '@app/orm/config'
import { InternalTransferEntity } from '@app/orm/entities/internal-transfer.entity'
import BigNumber from 'bignumber.js'
import { BalanceDeltaEntity } from '@app/orm/entities/balance-delta.entity'
import { FilterEnum } from '@app/graphql/schema'
import { ETH_ADDRESS } from '@app/shared/eth.service'

@Injectable()
export class TransferService {

  constructor(
    @InjectRepository(FungibleBalanceTransferEntity, DbConnection.Principal)
    private readonly transferRepository: Repository<FungibleBalanceTransferEntity>,
    @InjectRepository(FungibleBalanceDeltaEntity, DbConnection.Principal)
    private readonly deltaRepository: Repository<FungibleBalanceDeltaEntity>,
    @InjectEntityManager(DbConnection.Principal) private readonly entityManager: EntityManager,
    @InjectRepository(BalanceDeltaEntity, DbConnection.Principal)
    private readonly balanceDeltaRepository: Repository<BalanceDeltaEntity>,
  ) {
  }

  async findTokenTransfersByContractAddress(address: string, offset: number = 0, limit: number = 10): Promise<[FungibleBalanceTransferEntity[], number]> {
    const findOptions: FindManyOptions = {
      where: {deltaType: 'TOKEN_TRANSFER', contractAddress: address},
      skip: offset,
      take: limit,
      order: {traceLocationBlockNumber: 'DESC', traceLocationTransactionIndex: 'DESC'},
      cache: true,
    }
    return this.transferRepository.findAndCount(findOptions)
  }

  async findTokenTransfersByContractAddressForHolder(
    address: string,
    holder: string,
    filter: string = 'all',
    offset: number = 0,
    limit: number = 10,
  ): Promise<[FungibleBalanceTransferEntity[], number]> {

    const builder = this.transferRepository.createQueryBuilder('t')
      .where('t.contract_address = :address')
      .andWhere('t.delta_type = :deltaType')

    switch (filter) {
      case 'in':
        builder.andWhere('t.from = :holder')
        break
      case 'out':
        builder.andWhere('t.to = :holder')
        break
      default:
        builder.andWhere(new Brackets(sqb => {
          sqb.where('t.from = :holder')
          sqb.orWhere('t.to = :holder')
        }))
        break
    }

    return builder
      .setParameters({ address, deltaType: 'TOKEN_TRANSFER', holder })
      .orderBy('t.traceLocationBlockNumber', 'DESC')
      .addOrderBy('t.traceLocationTransactionIndex', 'DESC')
      .offset(offset)
      .take(limit)
      .cache(true)
      .getManyAndCount()

  }

  async findTotalTokenTransfersByContractAddressForHolder(contractAddress: string, holderAddress: string): Promise<BigNumber> {

    return new BigNumber(await this.deltaRepository.createQueryBuilder('d')
      .where('d.delta_type = :deltaType')
      .andWhere('d.address = :holderAddress')
      .andWhere('d.contract_address = :contractAddress')
      .setParameters({ deltaType: 'TOKEN_TRANSFER', holderAddress, contractAddress })
      .getCount())

  }

  async findInternalTransactionsByAddress(address: string, offset: number = 0, limit: number = 10): Promise<[InternalTransferEntity[], number]> {

    return this.entityManager.transaction(
      'READ COMMITTED',
      async (txn): Promise<[InternalTransferEntity[], number]> => {

        const count = await txn.count(InternalTransferEntity, { where: { address }, cache: true })

        const items = await txn.createQueryBuilder(InternalTransferEntity, 'it')
          .where('it.address = :address', { address })
          .orderBy('trace_location_block_number', 'DESC')
          .addOrderBy('trace_location_transaction_index', 'DESC')
          .addOrderBy('trace_location_trace_address', 'DESC')
          .offset(offset)
          .limit(limit)
          .getMany()

        return [items, count]

      },
    )

  }

  async findBalanceDeltas(
    addresses: string[],
    contracts: string[] = [],
    filter: FilterEnum = FilterEnum.all,
    offset: number = 0,
    limit: number = 10,
  ): Promise<[BalanceDeltaEntity[], number]> {

    const qb = this.balanceDeltaRepository.createQueryBuilder('bd')
      .where('bd.address IN (:...addresses)', { addresses })

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

    const count = await qb.getCount()

    const items = await qb.orderBy('bd.trace_location_block_number', 'DESC')
      .addOrderBy('bd.trace_location_transaction_index', 'DESC')
      .addOrderBy('bd.trace_location_trace_address', 'DESC')
      .offset(offset)
      .limit(limit)
      .getMany()

    return [items, count]

  }

  async findTokenBalancesByContractAddressForHolder(
    address: string,
    holder: string,
    timestampFrom: number = 0,
    timestampTo: number = 0,
  ): Promise<[FungibleBalanceDeltaEntity[], number]>{

    // Need to make subQuery somehow?? //
    // SEE: https://github.com/typeorm/typeorm/blob/17f3224c58b7126a9c1360ce21f43cda83a35e04/test/functional
    // /query-builder/subquery/query-builder-subquery.ts#L328-L327
    // https://github.com/typeorm/typeorm/blob/master/docs/select-query-builder.md#partial-selection
    // https://dba.stackexchange.com/questions/192553/calculate-running-sum-of-each-row-from-start-even-when-filtering-records
    const builder = this.deltaRepository.createQueryBuilder('t')
      .leftJoinAndSelect('t.transaction', 'transaction')
      .addSelect('*, SUM(t.amount) OVER (ORDER BY transaction.timestamp) AS balance')
      .where('t.contract_address = :address')
      .andWhere('t.address = :holder')
      .cache(true)

    const items = await builder
      .setParameters({ address, holder, timestampFrom, timestampTo })
      .getRawMany()

    const count = items.length

    // Need to cast items as FungibleBalanceDeltaEntity because of getRawMany() //
    return [

      items.map(item => {
        return {
          id: item.t_id,
          address: item.t_address,
          counterpartAddress: item.t_counterpartAddress,
          deltaType: item.t_deltaType,
          contractAddress: item.t_contractAddress,
          tokenType: item.t_tokenType,
          amount: item.t_amount,
          balance: item.balance,
          timestamp: item.transaction_timestamp,
          traceLocationBlockHash: item.t_trace_location_block_hash,
          traceLocationBlockNumber: item.t_trace_location_block_number,
          traceLocationTransactionHash: item.t_trace_location_transaction_hash,
          traceLocationTransactionIndex: item.t_trace_location_transaction_index,
          traceLocationLogIndex: item.t_trace_location_log_index,
          traceLocationTraceAddress: item.t_trace_location_trace_address,
          // transaction: item.transaction
        } as FungibleBalanceDeltaEntity
      }),

      count as number,

    ]
  }

}
