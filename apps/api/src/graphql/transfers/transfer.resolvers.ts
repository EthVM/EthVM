import {Args, Query, Resolver} from '@nestjs/graphql'
import {TransferService} from '@app/dao/transfer.service'
import {ParseAddressPipe} from '@app/shared/pipes/parse-address.pipe'
import {ParseAddressesPipe} from '@app/shared/pipes/parse-addresses.pipe'
import {UseInterceptors} from '@nestjs/common'
import {SyncingInterceptor} from '@app/shared/interceptors/syncing-interceptor'
import BigNumber from 'bignumber.js'
import {FilterEnum} from '@app/graphql/schema'
import {BalanceDeltaPageDto} from '@app/graphql/transfers/dto/balance-delta-page.dto'
import {BlockNumberPipe} from '@app/shared/pipes/block-number.pipe';

@Resolver('Transfer')
@UseInterceptors(SyncingInterceptor)
export class TransferResolvers {

  constructor(private readonly transferService: TransferService) {}

  /**
   * Get a page of balance transfers for a given token
   * @param {string} contractAddress - The address hash of the token.
   * @param {number} offset - The number of items to skip.
   * @param {number} limit - The page size.
   * @param {BigNumber} [blockNumber=latest block number] - Any transfers at a block number higher than this will be ignored.
   * @returns {Promise<BalanceDeltaPageDto>} A page object with an array of balance transfers and a boolean representing whether there are more items.
   */
  @Query()
  async tokenTransfersByContractAddress(
    @Args('contractAddress', ParseAddressPipe) contractAddress: string,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<BalanceDeltaPageDto> {
    if (!blockNumber) { // No latest block number was found so there are no valid balance transfers.
      return new BalanceDeltaPageDto([], false)
    }
    const [items, hasMore] = await this.transferService.findContractTokenTransfers(contractAddress, offset, limit, blockNumber)
    return new BalanceDeltaPageDto(items, hasMore)
  }

  /**
   * Get a page of balance transfers for a given token and holder.
   * @param {string} contractAddress - The address hash of the token.
   * @param {string} holderAddress - The address hash of the token holder.
   * @param {FilterEnum} [filter=all] - The transfer direction to filter by (in, out or all).
   * @param {number} offset - The number of items to skip.
   * @param {number} limit - The page size.
   * @param {BigNumber} [blockNumber=latest block number] - Any transfers at a block number higher than this will be ignored.
   * @returns {Promise<BalanceDeltaPageDto>} A page object with an array of balance transfers and a boolean representing whether there are more items.
   */
  @Query()
  async tokenTransfersByContractAddressForHolder(
    @Args('contractAddress', ParseAddressPipe) contractAddress: string,
    @Args('holderAddress', ParseAddressPipe) holderAddress: string,
    @Args('filter') filter: FilterEnum,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<BalanceDeltaPageDto> {
    if (!blockNumber) { // No latest block number was found so there are no valid balance transfers.
      return new BalanceDeltaPageDto([], false)
    }
    const [items, hasMore] = await this.transferService.findContractTokenTransfersForAddress(contractAddress, holderAddress, filter, offset, limit, blockNumber)
    return new BalanceDeltaPageDto(items, hasMore)
  }

  /**
   * Get the total number of balance transfers for a given token and holder.
   * @param {string} contractAddress - The address hash of the token.
   * @param {string} holderAddress - The address hash of the holder.
   * @param {BigNumber} [blockNumber=latest block number] - Any transfers at a block number higher than this will be ignored.
   * @returns {Promise<BigNumber>}
   */
  @Query()
  async totalTokenTransfersByContractAddressForHolder(
    @Args('contractAddress', ParseAddressPipe) contractAddress: string,
    @Args('holderAddress', ParseAddressPipe) holderAddress: string,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<BigNumber> {
    if (!blockNumber) { // No latest block number was found so there are no valid balance transfers.
      return new BigNumber(0)
    }
    return this.transferService.countContractTokenTransfersForAddress(contractAddress, holderAddress, blockNumber)
  }

  /**
   * Get a page of internal transactions for a given address.
   * @param {string} address - The address hash to filter by.
   * @param {number} offset - The number of items to skip.
   * @param {number} limit - The page size.
   * @param {BigNumber} [blockNumber=latest block number] - Any transfers at a block number higher than this will be ignored.
   * @returns {Promise<BalanceDeltaPageDto>} A page object with an array of balance transfers, a boolean representing whether there are more items and the
   * total count of internal txs this address has been part of.
   */
  @Query()
  async internalTransactionsByAddress(
    @Args('address', ParseAddressPipe) address: string,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<BalanceDeltaPageDto> {
    if (!blockNumber) { // No latest block number was found so there are no valid balance transfers.
      return new BalanceDeltaPageDto([], false, new BigNumber(0))
    }
    const [items, hasMore, totalCount] = await this.transferService.findInternalTransactionsForAddress(address, offset, limit, blockNumber)
    return new BalanceDeltaPageDto(items, hasMore, totalCount)
  }

  /**
   * Get a page of balance transfers for a given array of addresses.
   * @param {string[]} addresses - Array of address hashes to filter by.
   * @param {BigNumber} [blockNumber=latest block number] - Any transfers at a block number higher than this will be ignored.
   * @param {string[]} [contracts] - An optional array of contract address hashes to filter by. 0x0000000000000000000000000000000000000000 will be treated as
   * Ether address if provided.
   * @param {FilterEnum} [filter] - An optional directional filter e.g. in, out.
   * @param {number} [timestampFrom] - An optional "start" timestamp to filter by.
   * @param {number} [timestampTo] - An optional "end" timestamp to filter by.
   * @param {number} [offset] - The number of items to skip.
   * @param {number} [limit] - The page size.
   * @returns {BalanceDeltaPageDto} A page object with an array of balance transfers and a boolean representing whether there are more items.
   */
  @Query()
  async balanceDeltas(
    @Args({name: 'addresses', type: () => [String]}, ParseAddressesPipe) addresses: string[],
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
    @Args({name: 'contracts', type: () => [String]}, ParseAddressesPipe) contracts?: string[],
    @Args('filter') filter?: FilterEnum,
    @Args('timestampFrom') timestampFrom?: number,
    @Args('timestampTo') timestampTo?: number,
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
  ): Promise<BalanceDeltaPageDto> {
    if (!blockNumber) { // No latest block number was found so there are no valid balance transfers.
      return new BalanceDeltaPageDto([], false)
    }
    const [items, hasMore] = await this.transferService.findBalanceDeltas(addresses, contracts, filter, offset, limit, blockNumber, timestampTo, timestampFrom)
    return new BalanceDeltaPageDto(items, hasMore)
  }
}
