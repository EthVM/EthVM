import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, FindManyOptions, Repository } from 'typeorm'
import { FungibleBalanceTransferEntity } from '@app/orm/entities/fungible-balance-transfer.entity'
import { FungibleBalanceDeltaEntity } from '@app/orm/entities/fungible-balance-delta.entity'

@Injectable()
export class TransferService {

  constructor(
    @InjectRepository(FungibleBalanceTransferEntity)
    private readonly transferRepository: Repository<FungibleBalanceTransferEntity>,
    @InjectRepository(FungibleBalanceDeltaEntity)
    private readonly deltaRepository: Repository<FungibleBalanceDeltaEntity>,
  ) {
  }

  async findTokenTransfersByContractAddress(address: string, offset: number = 0, limit: number = 10): Promise<[FungibleBalanceTransferEntity[], number]> {
    const findOptions: FindManyOptions = {
      where: {deltaType: 'TOKEN_TRANSFER', contractAddress: address},
      skip: offset,
      take: limit,
      order: {traceLocationBlockNumber: 'DESC', traceLocationTransactionIndex: 'DESC'},
      cache: true
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

  async findInternalTransactionsByAddress(address: string, offset: number = 0, limit: number = 10): Promise<[FungibleBalanceTransferEntity[], number]> {
    const deltaTypes = ['INTERNAL_TX', 'CONTRACT_CREATION', 'CONTRACT_DESTRUCTION']

    return this.transferRepository.createQueryBuilder('t')
      .where('t.delta_type IN (:...deltaTypes)')
      .andWhere(new Brackets(sqb => {
        sqb.where('t.from = :address')
        sqb.orWhere('t.to = :address')
      }))
      .setParameters({ deltaTypes, address })
      .orderBy('t.traceLocationBlockNumber', 'DESC')
      .addOrderBy('t.traceLocationTransactionIndex', 'DESC')
      .offset(offset)
      .limit(limit)
      .cache(true)
      .getManyAndCount()

  }

  /**
   * The difference between this query and findTokenTransfersByContractAddressForHolder
   * is that this query:
   *
   * 1) Accepts an array of possible token contractAddresses
   * 2) Accepts timestampTo/timestampFrom and sorts accordingly
   */
  async findTokenTransfersByContractAddressesForHolder(
    addresses: string[],
    holder: string,
    filter: string = 'all',
    take: number = 10,
    page: number = 0,
    timestampFrom: number = 0,
    timestampTo: number = 0,
  ): Promise<[FungibleBalanceTransferEntity[], number]> {
    const skip = take * page

    const builder = this.transferRepository.createQueryBuilder('t')
      .where('t.contract_address = ANY(:addresses)')
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

    if (timestampFrom > 0) {
      builder.andWhere(new Brackets(sqb => {
        sqb.where('t.timestamp > :timestampFrom')
      }))
    }

    if (timestampTo > 0) {
      builder.andWhere(new Brackets(sqb => {
        sqb.where('t.timestamp < :timestampTo')
      }))
    }

    return builder
      .setParameters({ addresses, deltaType: 'TOKEN_TRANSFER', holder, timestampFrom, timestampTo })
      .orderBy('t.timestamp', 'DESC')
      .offset(skip)
      .take(take)
      .cache(true)
      .getManyAndCount()

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
