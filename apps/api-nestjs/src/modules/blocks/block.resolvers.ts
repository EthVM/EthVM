import { Args, Query, Resolver, Subscription } from '@nestjs/graphql'
import { BlockService } from '@app/modules/blocks/block.service'
import { PubSub } from 'graphql-subscriptions'
import { BlockDto } from '@app/modules/blocks/block.dto'

const pubSub = new PubSub()
@Resolver('Block')
export class BlockResolvers {
  constructor(private readonly blockService: BlockService) {}

  @Query()
  async blocks(@Args('page') page: number, @Args('limit') limit: number) {
    const entities = await this.blockService.getBlocks(limit, page)
    return entities.map(e => new BlockDto(e))
  }

  @Query()
  async block(@Args('hash') hash: string) {
    const entity = await this.blockService.getBlock(hash)
    return entity ? new BlockDto(entity) : null
  }

  @Subscription()
  newBlock() {
    return {
      //TODO publish newBlock from mongo
      subscribe: () => pubSub.asyncIterator('newBlock')
    }
  }
}
