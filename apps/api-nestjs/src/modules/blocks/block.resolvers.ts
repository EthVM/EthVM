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
    const entities = await this.blockService.findBlocks(limit, page)
    return entities.map(e => new BlockDto(e))
  }

  @Query()
  async blockByHash(@Args('hash') hash: string) {
    const entity = await this.blockService.findBlockByHash(hash)
    return entity ? new BlockDto(entity) : null
  }

  @Query()
  async blockByNumber(@Args('number') number: number) {
    const entity = await this.blockService.findBlockByNumber(number)
    return entity ? new BlockDto(entity) : null
  }

  @Query()
  async minedBlocksByAddress(@Args('address') address: string, @Args('limit') limit: number, @Args('page') page: number) {
    const entities = await this.blockService.findMinedBlocksByAddress(address, limit, page)
    return entities.map(e => new BlockDto(e))
  }

  @Query()
  async totalNumberOfBlocks() {
    return await this.blockService.findTotalNumberOfBlocks()
  }

  @Subscription()
  newBlock() {
    return {
      //TODO publish newBlock from mongo
      subscribe: () => pubSub.asyncIterator('newBlock')
    }
  }
}
