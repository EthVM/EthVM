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

  async findTokenTransfersByContractAddress(address: string, take: number = 10, page: number = 0): Promise<[FungibleBalanceTransferEntity[], number]> {
    const skip = take * page

    const findOptions: FindManyOptions = {
      where: {deltaType: 'TOKEN_TRANSFER', contractAddress: address},
      skip,
      take,
      order: {traceLocationBlockNumber: 'DESC', traceLocationTransactionIndex: 'DESC'},
    }
    return this.transferRepository.findAndCount(findOptions)
  }

  async findTokenTransfersByContractAddressForHolder(
    address: string,
    holder: string,
    filter: string = 'all',
    take: number = 10,
    page: number = 0,
  ): Promise<[FungibleBalanceTransferEntity[], number]> {
    const skip = take * page

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
      .offset(skip)
      .take(take)
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
    timestampTo: number = 0
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
      .getManyAndCount()

  }

  async findInternalTransactionsByAddress(address: string, take: number = 10, page: number = 0): Promise<[FungibleBalanceTransferEntity[], number]> {
    const skip = take * page
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
      .offset(skip)
      .limit(take)
      .getManyAndCount()

  }

  async findTokenBalancesByContractAddressesForHolder(
    addresses: string[],
    holder: string,
    timestampFrom: number = 0,
    timestampTo: number = 0
  ): Promise<[FungibleBalanceDeltaEntity[], number]>{


    /**
     * Notes: DISTINCT?
     * https://github.com/typeorm/typeorm/pull/3065
     */
    const builder = this.deltaRepository.createQueryBuilder('t')
      .innerJoinAndSelect("t.transaction", "transaction")
      .addSelect("SUM(t.amount) OVER (ORDER BY transaction.timestamp) AS balance")
      .where('t.contract_address = ANY(:addresses)')
      .andWhere('t.address = :holder')
      .groupBy('t.id, t.address, t.counterpartAddress, t.deltaType, t.contractAddress, t.tokenType, t.amount, t.traceLocationBlockHash, t.traceLocationBlockNumber, t.traceLocationTransactionHash, t.traceLocationTransactionIndex, t.traceLocationLogIndex, t.traceLocationTraceAddress, transaction.hash, transaction.nonce, transaction.blockHash, transaction.blockNumber, transaction.transactionIndex, transaction.from, transaction.to, transaction.value, transaction.gas, transaction.gasPrice, transaction.input, transaction.v, transaction.r, transaction.s, transaction.timestamp, transaction.creates, transaction.chainId')


    const items = await builder
      .setParameters({ addresses, holder, timestampFrom, timestampTo })
      .getRawMany()

      console.log('items', items)

    const count = await builder
      .setParameters({ addresses, holder, timestampFrom, timestampTo })
      .getCount()

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

      count as number

    ]

      // .addSelect('t.id, t.address, t.counterpartAddress, t.deltaType, t.contractAddress, t.tokenType, t.amount, t.traceLocationBlockHash, t.traceLocationBlockNumber, t.traceLocationTransactionHash, t.traceLocationTransactionIndex, t.traceLocationLogIndex, t.traceLocationTraceAddress, t.transaction, SUM(t.amount) AS balance')
      // .groupBy('t.id, t.address, t.counterpartAddress, t.deltaType, t.contractAddress, t.tokenType, t.amount, t.traceLocationBlockHash, t.traceLocationBlockNumber, t.traceLocationTransactionHash, t.traceLocationTransactionIndex, t.traceLocationLogIndex, t.traceLocationTraceAddress, t.transaction')
      // .innerJoinAndSelect("t.transaction", "transaction")

      // .addSelect(qb => {
      //     const subQuery = qb.subQuery()
      //         .select('t.id, t.trace_location_block_number, SUM(t.amount) AS balance')
      //         .groupBy('t.id, t.trace_location_block_number, t.amount')
      //         .getQuery();
      //     return subQuery;
      // })

      // .select('t.id, t.trace_location_block_number, SUM(t.amount)', 'balance')
      // .groupBy('t.id, t.trace_location_block_number, t.amount')


    //   .select('SUM(t.amount)', 'balance')
    // .groupBy('id, amount, transaction')
    // .where('balance.contract_address = ANY(:addresses)')

    //   // .where(qb => {
    //   //   const subQuery = new qb.subQuery()
    //   //     .select('SUM(t.amount)', 'balance')
    //   //     .where('t.contract_address = ANY(:addresses)')
    //   //     .getQuery()
    //   //   return subQuery
    //   // })
    //   .innerJoinAndSelect("balance.transaction", "transaction")

    // switch (filter) {
    //   case 'in':
    //     builder.andWhere('t.from = :holder')
    //     break
    //   case 'out':
    //     builder.andWhere('t.to = :holder')
    //     break
    //   default:
    //     builder.andWhere(new Brackets(sqb => {
    //       sqb.where('t.from = :holder')
    //       sqb.orWhere('t.to = :holder')
    //     }))
    //     break
    // }

    // if (timestampFrom > 0) {
    //   builder.andWhere(new Brackets(sqb => {
    //     sqb.where('transaction.timestamp > :timestampFrom')
    //   }))
    // }

    // if (timestampTo > 0) {
    //   builder.andWhere(new Brackets(sqb => {
    //     sqb.where('transaction.timestamp < :timestampTo')
    //   }))
    // }

  }

}
