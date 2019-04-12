import { SearchType } from '@app/graphql/schema'
import { BlockService } from '@app/modules/blocks/block.service'
import { SearchDto } from '@app/modules/search/search.dto'
import { TxService } from '@app/modules/txs/tx.service'
import { EthService } from '@app/shared/eth.service'
import { Injectable } from '@nestjs/common'
import { TxDto } from '@app/modules/txs/dto/tx.dto'
import { BlockDto } from '@app/modules/blocks/dto/block.dto'

@Injectable()
export class SearchService {
  constructor(
    private readonly blockService: BlockService,
    // private readonly balanceService: BalanceService,
    // private readonly uncleService: UncleService,
    private readonly txService: TxService,
    private readonly ethService: EthService,
  ) {}

  async search(query: string = ''): Promise<SearchDto | null> {
    const s: SearchDto = { type: SearchType.None }
    if (query.substring(0, 2) !== '0x') {
      query = `0x${query}`
    }

    // TODO reactivate address search
    // Check Address
    // if (this.ethService.isValidAddress(hash)) {
    //   const address = await this.balanceService.findBalanceByHash(hash)
    //   if (address != null) {
    //     s.address = address
    //     s.type = SearchType.Address
    //     return s
    //   }
    // }

    // Check Block, Uncle or Tx
    if (this.ethService.isValidHash(query)) {
      const block = await this.blockService.findBlockByHash(query)
      if (block != null) {
        s.block = new BlockDto(block)
        s.type = SearchType.Block
        return s
      }

      // TODO reactivate uncle search
      // const uncle = await this.uncleService.findUncleByHash(query)
      // if (uncle != null) {
      //   s.uncle = uncle
      //   s.type = SearchType.Uncle
      //   return s
      // }

      const tx = await this.txService.findTx(query)
      if (tx != null) {
        s.tx = new TxDto(tx)
        s.type = SearchType.Tx
        return s
      }
    }

    return s
  }
}
