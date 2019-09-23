import { SearchType } from '@app/graphql/schema'
import { BlockService } from '@app/dao/block.service'
import { SearchDto } from '@app/graphql/search/search.dto'
import { TxService } from '@app/dao/tx.service'
import { EthService } from '@app/shared/eth.service'
import { Injectable } from '@nestjs/common'
import { TxDto } from '@app/graphql/txs/dto/tx.dto'
import { BlockDto } from '@app/graphql/blocks/dto/block.dto'
import { UncleService } from '@app/dao/uncle.service'
import { AccountService } from '@app/dao/account.service'
import { AccountDto } from '@app/graphql/accounts/account.dto'
import { UncleDto } from '@app/graphql/uncles/dto/uncle.dto'
import { BlockMetricsService } from '@app/dao/block-metrics.service'
import BigNumber from 'bignumber.js'
import {AddressTransactionCountEntity} from '@app/orm/entities/address-transaction-count.entity';

@Injectable()
export class SearchService {
  constructor(
    private readonly blockService: BlockService,
    private readonly blockMetricsService: BlockMetricsService,
    private readonly accountService: AccountService,
    private readonly uncleService: UncleService,
    private readonly txService: TxService,
    private readonly ethService: EthService,
  ) {
  }

  /**
   * Search for a block, tx, uncle or account matching a query string.
   * @param {string} [query=''] - The query string.
   * @param {BigNumber} blockNumber - Entities created after this block number will be ignored.
   * @returns {Promise<SearchDto>} - An object with the type of entity returned (e.g. Tx, None) and the entity itself.
   */
  async search(query: string = '', blockNumber: BigNumber): Promise<SearchDto> {

    // Create the object to return and default the search type to "None".
    const result: SearchDto = { type: SearchType.None }

    // Add "0x" to the start of the query string if it is not set.
    if (query.substring(0, 2) !== '0x') {
      query = `0x${query}`
    }

    // If the query string is a valid address hash, search for an account with that address.

    if (this.ethService.isValidAddress(query)) {
      const account = await this.accountService.findEtherBalanceByAddress(query.toLowerCase(), blockNumber)
      if (account != null) {

        // Build "Account" object to return.

        const { address } = account
        const isMiner = await this.accountService.findIsMiner(address, blockNumber)
        const isContractCreator = await this.accountService.findIsContractCreator(address, blockNumber)
        const txCounts = await this.accountService.findTransactionCounts(address, blockNumber) ||
          new AddressTransactionCountEntity({ total: 0, totalIn: 0, totalOut: 0, address, blockNumber })
        const hasInternalTransfers = await this.accountService.findHasInternalTransfers(address, blockNumber)
        const isContract = await this.accountService.findIsContract(address, blockNumber)

        result.address = new AccountDto(account, isMiner, isContractCreator, hasInternalTransfers, isContract, txCounts)
        result.type = SearchType.Address
        return result
      }
    }

    // If the query string is a valid hash, search for a block, uncle or tx with that hash.

    if (this.ethService.isValidHash(query)) {

      query = query.toLowerCase() // Ensure query string is sanitized to lowercase before querying DB

      // Search for blocks.
      const block = await this.blockService.findByHash(query, blockNumber)
      if (block != null) {
        const [txFees] = await this.blockMetricsService.findBlockMetricsTraces([block.hash], block.timestamp, block.timestamp)
        result.block = new BlockDto(block, txFees)
        result.type = SearchType.Block
        return result
      }

    // Search for uncles.
      const uncle = await this.uncleService.findUncleByHash(query, blockNumber)
      if (uncle != null) {
        result.uncle = new UncleDto(uncle)
        result.type = SearchType.Uncle
        return result
      }

      // Search for txs.
      const tx = await this.txService.findOneByHash(query, blockNumber)
      if (tx != null) {
        result.tx = new TxDto(tx)
        result.type = SearchType.Tx
        return result
      }
    }

    // Return the empty SearchDto object with type "None" if no matches have been found.
    return result
  }
}
