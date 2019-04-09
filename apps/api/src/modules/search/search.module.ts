import { BalanceModule } from '@app/modules/balances/balance.module'
import { BlockModule } from '@app/modules/blocks/block.module'
import { SearchResolvers } from '@app/modules/search/search.resolvers'
import { SearchService } from '@app/modules/search/search.service'
import { TxModule } from '@app/modules/txs/tx.module'
import { UncleModule } from '@app/modules/uncles/uncle.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [BlockModule, TxModule, BalanceModule, UncleModule],
  providers: [SearchService, SearchResolvers]
})
export class SearchModule {}
