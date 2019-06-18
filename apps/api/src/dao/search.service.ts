import { SearchType } from '@app/graphql/schema'
import { BlockService } from '@app/dao/block.service'
import { SearchDto } from '@app/graphql/search/dto/search.dto'
import { TxService } from '@app/dao/tx.service'
import { EthService } from '@app/shared/eth.service'
import { Injectable } from '@nestjs/common'
import { TxDto } from '@app/graphql/txs/dto/tx.dto'
import { BlockDto } from '@app/graphql/blocks/dto/block.dto'
import { UncleService } from '@app/dao/uncle.service'
import { AccountService } from '@app/dao/account.service'
import { AccountDto } from '@app/graphql/accounts/account.dto'
import { UncleDto } from '@app/graphql/uncles/dto/uncle.dto'

@Injectable()
export class SearchService {
  constructor(
    private readonly blockService: BlockService,
    private readonly accountService: AccountService,
    private readonly uncleService: UncleService,
    private readonly txService: TxService,
    private readonly ethService: EthService,
  ) {
  }

  async search(query: string = ''): Promise<SearchDto | null> {
    const s: SearchDto = {type: SearchType.None}
    if (query.substring(0, 2) !== '0x') {
      query = `0x${query}`
    }

    // Check Accounts
    if (this.ethService.isValidAddress(query)) {
      const accountResult = await this.searchForAccount(query)
      if (accountResult) { return accountResult }
    }

    // Check Block, Uncle or Tx
    if (this.ethService.isValidHash(query)) {
      const blockResult = await this.searchForBlock(query)
      if (blockResult) { return blockResult }

      const uncleResult = await this.searchForUncle(query)
      if (uncleResult) { return uncleResult }

      const txResult = await this.searchForTx(query)
      if (txResult) { return txResult }
    }

    return s
  }

  private async searchForAccount(query: string): Promise<SearchDto | undefined> {

    const account = await this.accountService.findAccountByAddress(query)

    if (!account) return undefined

    const isMiner = await this.accountService.findIsMiner(account.address)
    const isContractCreator = await this.accountService.findIsContractCreator(account.address)

    return new SearchDto({ account: new AccountDto({...account, isMiner, isContractCreator}), type: SearchType.Address })

  }

  private async searchForBlock(query: string): Promise<SearchDto | undefined> {

    const block = await this.blockService.findOne({hash: query})

    if (!block) return undefined

    return new SearchDto({ block: new BlockDto(block), type: SearchType.Block })

  }

  private async searchForUncle(query: string): Promise<SearchDto | undefined> {

    const uncle = await this.uncleService.findUncleByHash(query)

    if (!uncle) return undefined

    return new SearchDto({ uncle: new UncleDto(uncle), type: SearchType.Uncle })

  }

  private async searchForTx(query: string): Promise<SearchDto | undefined> {

    const tx = await this.txService.findOneByHash(query)

    if (!tx) return undefined

    return new SearchDto({ tx: new TxDto(tx), type: SearchType.Tx })

  }

}
