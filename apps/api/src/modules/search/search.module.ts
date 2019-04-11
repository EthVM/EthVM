import { BlockModule } from '@app/modules/blocks/block.module'
import { SearchResolvers } from '@app/modules/search/search.resolvers'
import { SearchService } from '@app/modules/search/search.service'
import { TxModule } from '@app/modules/txs/tx.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [BlockModule, TxModule],
  providers: [SearchService, SearchResolvers],
})
export class SearchModule {}
