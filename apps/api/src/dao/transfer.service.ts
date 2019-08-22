import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager, FindManyOptions, Repository } from 'typeorm'
import { FungibleBalanceDeltaEntity } from '@app/orm/entities/fungible-balance-delta.entity'
import { DbConnection } from '@app/orm/config'
import { InternalTransferEntity } from '@app/orm/entities/internal-transfer.entity'
import BigNumber from 'bignumber.js'
import { BalanceDeltaEntity } from '@app/orm/entities/balance-delta.entity'
import { FilterEnum } from '@app/graphql/schema'
import { ETH_ADDRESS } from '@app/shared/eth.service'
import { TransactionEntity } from '@app/orm/entities/transaction.entity'
import { TxService } from '@app/dao/tx.service'

@Injectable()
export class TransferService {

  constructor(
    @InjectRepository(FungibleBalanceDeltaEntity, DbConnection.Principal)
    private readonly fungibleDeltaRepository: Repository<FungibleBalanceDeltaEntity>,
    @InjectEntityManager(DbConnection.Principal) private readonly entityManager: EntityManager,
    @InjectRepository(BalanceDeltaEntity, DbConnection.Principal)
    private readonly balanceDeltaRepository: Repository<BalanceDeltaEntity>,
    private readonly txService: TxService,
  ) {
  }

  async findContractTokenTransfers(contractAddress: string, offset: number = 0, limit: number = 10): Promise<[FungibleBalanceDeltaEntity[], boolean]> {
    const findOptions: FindManyOptions = {
      where: {deltaType: 'TOKEN_TRANSFER', contractAddress, isReceiving: true},
      skip: offset,
      take: limit + 1,
      order: {traceLocationBlockNumber: 'DESC', traceLocationTransactionIndex: 'DESC'},
      cache: true,
    }
    const items = await this.fungibleDeltaRepository.find(findOptions)
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
  ): Promise<[FungibleBalanceDeltaEntity[], boolean]> {

    const builder = this.fungibleDeltaRepository.createQueryBuilder('t')
      .where('t.delta_type = :deltaType')
      .andWhere('t.contract_address = :contractAddress')
      .andWhere('t.address = :address')

    switch (filter) {
      case 'in':
        builder.andWhere('t.is_receiving = true')
        break
      case 'out':
        builder.andWhere('t.is_receiving = false')
        break
      default:
        break
    }

    const items = await builder
      .setParameters({ contractAddress, deltaType: 'TOKEN_TRANSFER', address })
      .orderBy('t.traceLocationBlockNumber', 'DESC')
      .addOrderBy('t.traceLocationTransactionIndex', 'DESC')
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

  async countContractTokenTransfersForAddress(contractAddress: string, address: string): Promise<BigNumber> {

    return new BigNumber(await this.fungibleDeltaRepository.createQueryBuilder('d')
      .where('d.delta_type = :deltaType')
      .andWhere('d.contract_address = :contractAddress')
      .andWhere('d.address = :address')
      .setParameters({ deltaType: 'TOKEN_TRANSFER', address, contractAddress })
      .getCount())

  }

  async findInternalTransactionsForAddress(address: string, offset: number = 0, limit: number = 10): Promise<[InternalTransferEntity[], boolean]> {

    return this.entityManager.transaction(
      'READ COMMITTED',
      async (txn): Promise<[InternalTransferEntity[], boolean]> => {

        const items = await txn.createQueryBuilder(InternalTransferEntity, 'it')
          .where('it.address = :address', { address })
          .orderBy('trace_location_block_number', 'DESC')
          .addOrderBy('trace_location_transaction_index', 'DESC')
          .addOrderBy('trace_location_trace_address', 'DESC')
          .offset(offset)
          .limit(limit + 1)
          .getMany()

        const hasMore = items.length > limit
        if (hasMore) {
          items.pop()
        }

        return [items, hasMore]

      },
    )

  }

  async findBalanceDeltas(
    addresses: string[],
    contracts: string[] = [],
    filter: FilterEnum = FilterEnum.all,
    timestampTo?: number,
    timestampFrom?: number,
    offset: number = 0,
    limit: number = 10,
  ): Promise<[BalanceDeltaEntity[], TransactionEntity[], boolean]> {

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

    if (timestampTo) {
      qb.andWhere('bd.timestamp < :timestampTo', { timestampTo: new Date(timestampTo * 1000).toISOString() })
    }
    if (timestampFrom) {
      qb.andWhere('bd.timestamp > :timestampFrom', { timestampFrom: new Date(timestampFrom * 1000).toISOString() })
    }

    const transfers = await qb.orderBy('bd.trace_location_block_number', 'DESC')
      .addOrderBy('bd.trace_location_transaction_index', 'DESC')
      .addOrderBy('bd.trace_location_trace_address', 'DESC')
      .offset(offset)
      .limit(limit + 1) // Request one extra item to determine if there are more pages
      .getMany()

    const hasMore = transfers.length > limit
    if (hasMore) {
      transfers.pop()
    }

    const txHashes = transfers.reduce((memo, next) => {
      if (next.traceLocationTransactionHash) {
        memo.push(next.traceLocationTransactionHash)
      }
      return memo
    }, [] as string [])

    // Find related txs and receipts
    const txs = await this.txService.findByHash(txHashes, false)

    return [transfers, txs, hasMore]

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
    const builder = this.fungibleDeltaRepository.createQueryBuilder('t')
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
          isReceiving: item.t_is_receiving,
          // transaction: item.transaction
        } as FungibleBalanceDeltaEntity
      }),

      count as number,

    ]
  }

}
