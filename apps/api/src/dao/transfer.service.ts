import {Injectable} from '@nestjs/common'
import {InjectEntityManager, InjectRepository} from '@nestjs/typeorm'
import {EntityManager, FindManyOptions, LessThanOrEqual, Repository} from 'typeorm'
import BigNumber from 'bignumber.js'
import {FilterEnum} from '@app/graphql/schema'
import {ETH_ADDRESS} from '@app/shared/eth.service'
import {BalanceDeltaEntity} from '@app/orm/entities/balance-delta.entity'
import {AddressInternalTransactionCountEntity} from '@app/orm/entities/address-internal-transaction-count.entity'

@Injectable()
export class TransferService {

  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(BalanceDeltaEntity)
    private readonly balanceDeltaRepository: Repository<BalanceDeltaEntity>,
  ) {
  }

  /**
   * Find a page of token transfers for a given contract address.
   * @param {string} contractAddress - The contract's address hash.
   * @param {number} [offset=0] - The number of items to skip.
   * @param {number} [limit=10] - The page size.
   * @param {BigNumber} blockNumber - Transfers after this block number will be ignored.
   * @returns {Promise<BalanceDeltaEntity[], boolean>} An array of BalanceDeltaEntities representing the transfers and a boolean indicating whether there
   * is another page of items after this one.
   */
  async findContractTokenTransfers(
    contractAddress: string,
    offset: number = 0,
    limit: number = 10,
    blockNumber: BigNumber,
  ): Promise<[BalanceDeltaEntity[], boolean]> {
    const findOptions: FindManyOptions<BalanceDeltaEntity> = {
      where: {deltaType: 'TOKEN_TRANSFER', contractAddress, isReceiving: true, blockNumber: LessThanOrEqual(blockNumber)},
      skip: offset,
      take: limit + 1, // Request an extra item to determine if there is another page after this.
      order: {blockNumber: 'DESC', transactionIndex: 'DESC', id: 'DESC'},
      cache: true,
    }
    const items = await this.balanceDeltaRepository.find(findOptions)

    // If there are more items than the limit, there is another page of items.
    const hasMore = items.length > limit
    if (hasMore) {
      items.pop() // Remove the last item from the array to ensure the page size is correct.
    }
    return [items, hasMore]
  }

  /**
   * Find a page of token transfers for a given contract address and holder address combination.
   * @param {string} contractAddress - The address hash of the contract.
   * @param {string} address - The address hash of the token holder.
   * @param {FilterEnum} [filter="all"] - A direction filter (in, out or all).
   * @param {number} [offset=0] - The number of items to skip.
   * @param {number} [limit=10] - The page size.
   * @param {BigNumber} blockNumber - Transfers after this block number will be ignored.
   * @returns {Promise<BalanceDeltaEntity[], boolean>} An array of BalanceDeltaEntities representing the transfers and a boolean indicating whether there
   * is another page of items after this one.
   */
  async findContractTokenTransfersForAddress(
    contractAddress: string,
    address: string,
    filter: FilterEnum = FilterEnum.all,
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
      .limit(limit + 1) // Request one extra item to determine if there are more pages.
      .cache(true)
      .getMany()

    const hasMore = items.length > limit // If there are more items than the limit there is another page after this.
    if (hasMore) {
      items.pop() // Remove the last item to return the correct page size.
    }

    return [items, hasMore]
  }

  /**
   * Count the total number of token transfers for a given contract address and holder address combination.
   * @param {string} contractAddress - The address hash of the contract.
   * @param {string} address - The address hash of the token holder.
   * @param {BigNumber} blockNumber - Transfers after this block number will be ignored.
   * @returns {Promise<BigNumber>}
   */
  async countContractTokenTransfersForAddress(contractAddress: string, address: string, blockNumber: BigNumber): Promise<BigNumber> {

    return new BigNumber(await this.balanceDeltaRepository.createQueryBuilder('b')
      .where('b.delta_type = :deltaType')
      .andWhere('b.contract_address = :contractAddress')
      .andWhere('b.address = :address')
      .andWhere('b.block_number <= :blockNumber')
      .setParameters({ deltaType: 'TOKEN_TRANSFER', address, contractAddress, blockNumber: blockNumber.toNumber() })
      .getCount())

  }

  /**
   * Find a page of internal transfers for a given address hash.
   * @param {string} address - The address hash.
   * @param {number} [offset=0] - The number of items to skip.
   * @param {number} [limit=10] - The page size.
   * @param {BigNumber} blockNumber - Transfers after this block number will be ignored.
   * @returns {Promise<[BalanceDeltaEntity[], boolean, BigNumber]>} An array of BalanceDeltaEntities representing the transfers, a boolean indicating whether
   * there is another page after this one and the total count of internal txs for this address.
   */
  async findInternalTransactionsForAddress(
    address: string,
    offset: number = 0,
    limit: number = 10,
    blockNumber: BigNumber,
  ): Promise<[BalanceDeltaEntity[], boolean, BigNumber]> {

    return this.entityManager.transaction(
      'READ COMMITTED',
      async (txn): Promise<[BalanceDeltaEntity[], boolean, BigNumber]> => {

        // Get total count from the count table.
        const internalTxsCount = await txn.findOne(AddressInternalTransactionCountEntity, {
          where: { address, blockNumber: LessThanOrEqual(blockNumber) },
          order: { blockNumber: 'DESC' },
          cache: true,
        })

        // If no count entry was found or the count was zero, return an empty array.
        const count = internalTxsCount ? internalTxsCount.total : undefined
        if (!count) {
          return [[], false, new BigNumber(0)]
        }

        // Get balance deltas.

        const deltaTypes = ['CONTRACT_CREATION', 'CONTRACT_DESTRUCTION', 'INTERNAL_TX'] // All internal transfer delta types.

        const items = await txn.createQueryBuilder(BalanceDeltaEntity, 'b')
          .where('b.address = :address')
          .andWhere('b.delta_type IN (:...deltaTypes)')
          .andWhere('b.block_number <= :blockNumber')
          .setParameters({ address, deltaTypes, blockNumber: blockNumber.toNumber() })
          .orderBy('block_number', 'DESC')
          .addOrderBy('transaction_index', 'DESC')
          .addOrderBy('id', 'DESC') // Ensure desc ordering within a transaction.
          .offset(offset)
          .limit(limit + 1) // Ask for an extra item for determining if there is another page after this.
          .cache(true)
          .getMany()

        const hasMore = items.length > limit // If there are more items than the limit there is another page after this one.
        if (hasMore) {
          items.pop() // Remove the last item to return the correct page size.
        }

        return [items, hasMore, count]
      },
    )
  }

  /**
   * Find a page of balance deltas.
   * @param {string[]} addresses - An array of address hashes to filter deltas by.
   * @param {string[]} [contracts=[]] - An optional array of contract addresses to filter deltas by.
   * @param {FilterEnum} [filter="all"] - A directional filter (in, out or all).
   * @param {number} [offset=0] - The number of items to skip.
   * @param {number} [limit=10] - The page size.
   * @param {BigNumber} blockNumber - Balance deltas after this block number will be ignored.
   * @param {number} [timestampTo] - An optional "end" timestamp for filtering (in seconds).
   * @param {number} [timestampFrom] - An optional "start" timestamp for filtering (in seconds).
   * @returns {Promise<BalanceDeltaEntity[], boolean>} An array of balance delta entities and a boolean representing whether there is another page after this.
   */
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

    // Add where clause for contract_addresses.

    if (contracts.length) {
      // TODO EthAddress should be replaced with "is NULL"
      // If the "EthAddress" is supplied (0x0000000000000000000000000000000000000000), replace it with an empty string.
      const ethAddressIdx = contracts.indexOf(ETH_ADDRESS)
      if (ethAddressIdx > -1) {
        contracts[ethAddressIdx] = ''
      }
      qb.andWhere('bd.contract_address IN (:...contracts)', { contracts })
    }

    // Add where clause for directional filter.

    if (filter === FilterEnum.in) {
      qb.andWhere('bd.is_receiving = TRUE')
    } else if (filter === FilterEnum.out) {
      qb.andWhere('bd.receiving === FALSE')
    }

    // Add where clause for timestamp. Convert to ms and ISOString before passing to DB.

    if (timestampTo) {
      qb.andWhere('bd.timestamp < :timestampTo', { timestampTo: new Date(timestampTo * 1000).toISOString() })
    }
    if (timestampFrom) {
      qb.andWhere('bd.timestamp > :timestampFrom', { timestampFrom: new Date(timestampFrom * 1000).toISOString() })
    }

    // Perform query

    const items = await qb.orderBy('bd.block_number', 'DESC')
      .addOrderBy('bd.transaction_index', 'DESC')
      .addOrderBy('bd.id', 'DESC')
      .offset(offset)
      .limit(limit + 1) // Request one extra item to determine if there are more pages.
      .getMany()

    const hasMore = items.length > limit // If there are more items than limit there is another page.
    if (hasMore) {
      items.pop() // Remove the last item to ensure the page size is correct.
    }

    return [items, hasMore]
  }
}
