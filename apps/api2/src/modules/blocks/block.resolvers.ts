
import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {BlockService} from './block.service';
@Resolver('Block')
export class BlockResolvers {

  constructor(private readonly blockService: BlockService) {}
  @Query()
    async blocks(@Args('page') page: number,@Args('limit') limit: number) {
        const entities = await this.blockService.getBlocks(page, limit);
        return entities;
    }

    @Query()
    async block(@Args('hash') hash: string) {
        const entities = await this.blockService.getBlock(hash);
        return entities;
    }
}

