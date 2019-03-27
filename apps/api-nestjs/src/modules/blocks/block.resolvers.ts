import { Args, Query, Resolver, Subscription } from '@nestjs/graphql'
import { BlockService } from '@app/modules/blocks/block.service'
import { BlockDto } from '@app/modules/blocks/block.dto'
import { ParseHashPipe } from '@app/shared/validation/parse-hash.pipe'
import { ParseAddressPipe } from '@app/shared/validation/parse-address.pipe'
import { ParseLimitPipe } from '@app/shared/validation/parse-limit.pipe'
import { ParsePagePipe } from '@app/shared/validation/parse-page.pipe'
import { PubSub, withFilter } from 'graphql-subscriptions'
import { Inject } from '@nestjs/common'

@Resolver('Block')
export class BlockResolvers {
  constructor(private readonly blockService: BlockService, @Inject('PUB_SUB') private pubSub: PubSub) {}

  @Query()
  async blocks(@Args('page', ParsePagePipe) page: number, @Args('limit', ParseLimitPipe) limit: number) {
    const entities = await this.blockService.findBlocks(limit, page)
    return entities.map(e => new BlockDto(e))
  }

  @Query()
  async blockByHash(@Args('hash', ParseHashPipe) hash: string) {
    const entity = await this.blockService.findBlockByHash(hash)
    return entity ? new BlockDto(entity) : null
  }

  @Query()
  async blockByNumber(@Args('number') number: number) {
    const entity = await this.blockService.findBlockByNumber(number)
    return entity ? new BlockDto(entity) : null
  }

  @Query()
  async minedBlocksByAddress(
    @Args('address', ParseAddressPipe) address: string,
    @Args('limit', ParseLimitPipe) limit: number,
    @Args('page', ParsePagePipe) page: number
  ) {
    const entities = await this.blockService.findMinedBlocksByAddress(address, limit, page)
    return entities.map(e => new BlockDto(e))
  }

  @Query()
  async totalNumberOfBlocks() {
    return await this.blockService.findTotalNumberOfBlocks()
  }

  @Subscription()
  newBlock() {
    // TODO use withFilter to filter by event type
    return {
      resolve: (payload) => {

        // Publish 'txs' event if block has txs

        const { value } = payload
        if (value.txs && value.txs.length) {
          this.pubSub.publish('txs', value.txs)
        }

        return new BlockDto(value)
      },
      subscribe: () => this.pubSub.asyncIterator('blocks')
    }
  }
}
