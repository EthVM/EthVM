import { BlockModule } from '@app/modules/blocks/block.module'
import { SearchResolvers } from '@app/modules/search/search.resolvers'
import { SearchService } from '@app/modules/search/search.service'
import { TxModule } from '@app/modules/txs/tx.module'
import { Module } from '@nestjs/common'
import { UncleModule } from '@app/modules/uncles/uncle.module'
import { AccountModule } from '@app/modules/accounts/account.module'

@Module({
  imports: [BlockModule, TxModule, UncleModule, AccountModule],
  providers: [SearchService, SearchResolvers],
})
export class SearchModule {}
