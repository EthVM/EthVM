import { Module } from '@nestjs/common'
import { SearchService } from '@app/modules/search/search.service'
import { BlockModule } from '@app/modules/blocks/block.module'
import { TxModule } from '@app/modules/txs/tx.module'
import { BalanceModule } from '@app/modules/balances/balance.module'
import { SearchResolvers } from '@app/modules/search/search.resolvers'

@Module({
  imports: [
    BlockModule,
    TxModule,
    BalanceModule
  ],
  providers: [SearchService, SearchResolvers],
})
export class SearchModule {}
