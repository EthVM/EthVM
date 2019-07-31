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

  async search(query: string = ''): Promise<SearchDto | null> {
    const s: SearchDto = { type: SearchType.None }
    if (query.substring(0, 2) !== '0x') {
      query = `0x${query}`
    }

    // Check Accounts
    if (this.ethService.isValidAddress(query)) {
      const account = await this.accountService.findAccountByAddress(query.toLowerCase())
      if (account != null) {

        const isMiner = await this.accountService.findIsMiner(account.address)
        const isContractCreator = await this.accountService.findIsContractCreator(account.address)

        s.address = new AccountDto({ ...account, isMiner, isContractCreator })
        s.type = SearchType.Address
        return s
      }
    }

    // Check Block, Uncle or Tx
    if (this.ethService.isValidHash(query)) {

      query = query.toLowerCase() // Ensure query string is sanitized to lowercase before querying DB

      const block = await this.blockService.findByHash(query)
      if (block != null) {
        const txFees = await this.blockMetricsService.findBlockMetricsTransactionFeeByBlockHash(query)
        s.block = new BlockDto(block, txFees)
        s.type = SearchType.Block
        return s
      }

      const uncle = await this.uncleService.findUncleByHash(query)
      if (uncle != null) {
        s.uncle = new UncleDto(uncle)
        s.type = SearchType.Uncle
        return s
      }

      const tx = await this.txService.findOneByHash(query)
      if (tx != null) {
        s.tx = new TxDto(tx)
        s.type = SearchType.Tx
        return s
      }
    }

    return s
  }
}
