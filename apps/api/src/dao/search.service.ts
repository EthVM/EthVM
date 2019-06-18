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
import { TokenService } from '@app/dao/token.service'

@Injectable()
export class SearchService {
  constructor(
    private readonly blockService: BlockService,
    private readonly accountService: AccountService,
    private readonly uncleService: UncleService,
    private readonly txService: TxService,
    private readonly ethService: EthService,
    private readonly tokenService: TokenService,
  ) {
  }

  async search(query: string = ''): Promise<SearchDto | null> {

    // Check Accounts
    if (this.ethService.isValidAddress(query)) {
      const accountResult = await this.searchForAccount(this.convertToHex(query))
      if (accountResult) { return accountResult }
    }

    // Check Block, Uncle or Tx
    if (this.ethService.isValidHash(query)) {
      const q = this.convertToHex(query)
      const blockResult = await this.searchForBlock(q)
      if (blockResult) { return blockResult }

      const uncleResult = await this.searchForUncle(q)
      if (uncleResult) { return uncleResult }

      const txResult = await this.searchForTx(q)
      if (txResult) { return txResult }
    }

    // Check Tokens
    const tokenResult = await this.searchForTokens(query)
    if (tokenResult) { return tokenResult }

    return {type: SearchType.None}
  }

  private convertToHex(query: string): string {

    // Add "0x" to query string if not present
    if (query.substring(0, 2) !== '0x') {
      query = `0x${query}`
    }

    return query
  }

  private async searchForAccount(query: string): Promise<SearchDto | undefined> {

    const account = await this.accountService.findAccountByAddress(query)

    if (!account) return undefined

    const isMiner = await this.accountService.findIsMiner(account.address)
    const isContractCreator = await this.accountService.findIsContractCreator(account.address)

    return new SearchDto({ address: new AccountDto({...account, isMiner, isContractCreator}), type: SearchType.Address })
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

  private async searchForTokens(query: string): Promise<SearchDto | undefined> {

    const tokens = await this.tokenService.findByNameOrSymbol(query)

    if (!tokens.length) return undefined

    return new SearchDto({ tokens, type: SearchType.Token })

  }

}
