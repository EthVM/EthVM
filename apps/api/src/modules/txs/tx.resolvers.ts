import { Args, Query, Resolver } from '@nestjs/graphql'
import { TxService } from '@app/modules/txs/tx.service'
import { ParseHashPipe } from '@app/shared/validation/parse-hash.pipe'
import { ParseAddressPipe } from '@app/shared/validation/parse-address.pipe'
import { ParseLimitPipe } from '@app/shared/validation/parse-limit.pipe'
import { ParsePagePipe } from '@app/shared/validation/parse-page.pipe'
import { TxDto } from '@app/modules/txs/dto/tx.dto'

@Resolver('Transaction')
export class TxResolvers {
  constructor(private readonly txService: TxService,
              // @Inject('PUB_SUB') private pubSub: PubSub
  ) {}

  @Query()
  async tx(@Args('hash', ParseHashPipe) hash: string): Promise<TxDto | null> {
    const entity = await this.txService.findTx(hash)
    return entity ? new TxDto(entity) : null
  }

  @Query()
  async txs(@Args('limit', ParseLimitPipe) limit?: number, @Args('page') page?: number, @Args('fromBlock') fromBlock?: number): Promise<TxDto[]> {
    const entities = await this.txService.findTxs(limit, page, fromBlock)
    return entities.map(e => new TxDto(e))
  }

  @Query()
  async txsForAddress(
    @Args('hash', ParseAddressPipe) hash: string,
    @Args('filter') filter?: string,
    @Args('limit', ParseLimitPipe) limit?: number,
    @Args('page', ParsePagePipe) page?: number,
  ): Promise<TxDto[]> {
    const entities = await this.txService.findTxsForAddress(hash, filter, limit, page)
    return entities.map(e => new TxDto(e))
  }

  @Query()
  async totalNumberOfTransactions(): Promise<number> {
    return await this.txService.countTransactions()
  }

  // @Subscription()
  // newTxs() {
  //   return {
  //     resolve: payload => {
  //       return new TxDto(payload.value)
  //     },
  //     subscribe: () => this.pubSub.asyncIterator('txs'),
  //   }
  // }
}
