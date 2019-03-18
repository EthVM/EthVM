import { Injectable } from '@nestjs/common'
import { BlockService } from '@app/modules/blocks/block.service'
import { SearchDto } from '@app/modules/search/search.dto'
import { SearchType } from '@app/graphql/schema'
import { EthService } from '@app/shared/eth.service'
import { BalanceService } from '@app/modules/balances/balance.service'
import { TxService } from '@app/modules/txs/tx.service'

@Injectable()
export class SearchService {
  constructor(
    private readonly blockService: BlockService,
    private readonly balanceService: BalanceService,
    private readonly txService: TxService,
    private readonly ethService: EthService,
  ) {}

  async search(hash: string): Promise<SearchDto | null> {
    const s: SearchDto = { type: SearchType.None }

    const hashWith0x = this.convertToHashWith0x(hash)

    if (this.ethService.isValidAddress(hashWith0x)) {
      const address = await this.balanceService.findBalanceByHash(hash)
      if (address != null) {
        s.address = address
        s.type = SearchType.Address
        return s
      }
    }

    if (this.ethService.isValidHash(hash)) {
      const block = await this.blockService.findBlockByHash(hash)
      if (block != null) {
        s.block = block
        s.type = SearchType.Block
        return s
      }

      const tx = await this.txService.findTx(hash)
      if (tx != null) {
        s.tx = tx
        s.type = SearchType.Transaction
        return s
      }
    }

    return s
  }

  private convertToHashWith0x(hash: string): string {
    let hashWith0x = ''
    hash.slice(0, 2) === '0x' ? (hashWith0x = hash.replace('0x', '')) : (hashWith0x = '0x' + hash)
    return hashWith0x
  }
}
