import { Args, Query, Resolver } from '@nestjs/graphql'
import { TxService } from '@app/modules/txs/tx.service'
import { TxDto } from '@app/modules/txs/tx.dto'

@Resolver('Transaction')
export class TxResolvers {
  constructor(private readonly txService: TxService) {}

  @Query()
  async tx(@Args('hash') hash: string) {
    const entity = await this.txService.findTx(hash)
    return entity ? new TxDto(entity) : null
  }

  @Query()
  async txs(@Args('limit') limit?: number,
            @Args('order') order?: string,
            @Args('fromBlock') fromBlock?: number) {
    const entities = await this.txService.findTxs(limit, order, fromBlock)
    return entities.map(e => new TxDto(e))
  }

  @Query()
  async txsForBlock(@Args('hash') hash: string) {
    const entities = await this.txService.findTxsForBlock(hash)
    return entities.map(e => new TxDto(e))
  }

  @Query()
  async txsForAddress(@Args('hash') hash: string,
                      @Args('filter') filter?: string,
                      @Args('limit') limit?: number,
                      @Args('page') page?: number) {
    const entities = await this.txService.findTxsForAddress(hash, filter, limit, page)
    return entities.map(e => new TxDto(e))
  }

  @Query()
  async totalNumberOfTransactions() {
    return await this.txService.countTransactions()
  }
}
