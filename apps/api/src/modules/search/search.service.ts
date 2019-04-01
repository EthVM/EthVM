import { SearchType } from '@app/graphql/schema'
import { BalanceService } from '@app/modules/balances/balance.service'
import { BlockService } from '@app/modules/blocks/block.service'
import { SearchDto } from '@app/modules/search/search.dto'
import { TxService } from '@app/modules/txs/tx.service'
import { UncleService } from '@app/modules/uncles/uncle.service'
import { EthService } from '@app/shared/eth.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class SearchService {
  constructor(
    private readonly blockService: BlockService,
    private readonly balanceService: BalanceService,
    private readonly uncleService: UncleService,
    private readonly txService: TxService,
    private readonly ethService: EthService
  ) {}

  async search(query: string = ''): Promise<SearchDto | null> {
    const s: SearchDto = { type: SearchType.None }
    const hash = query.replace('0x', '')

    // Check Address
    if (this.ethService.isValidAddress(hash)) {
      const address = await this.balanceService.findBalanceByHash(hash)
      if (address != null) {
        s.address = address
        s.type = SearchType.Address
        return s
      }
    }

    // Check Block, Uncle or Tx
    if (this.ethService.isValidHash(hash)) {
      const block = await this.blockService.findBlockByHash(hash)
      if (block != null) {
        s.block = block
        s.type = SearchType.Block
        return s
      }

      const uncle = await this.uncleService.findUncleByHash(hash)
      if (uncle != null) {
        s.uncle = uncle
        s.type = SearchType.Uncle
        return s
      }

      const tx = await this.txService.findTx(hash)
      if (tx != null) {
        s.tx = tx
        s.type = SearchType.Tx
        return s
      }
    }

    return s
  }
}
