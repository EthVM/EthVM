import { GraphQLModule } from '@app/graphql/graphql.module'
import { AccountModule } from '@app/modules/accounts/account.module'
import { BlockMetricsModule } from '@app/modules/block-metrics/block-metrics.module'
import { BlockModule } from '@app/modules/blocks/block.module'
import { ContractModule } from '@app/modules/contracts/contract.module'
import { SearchModule } from '@app/modules/search/search.module'
import { TokenModule } from '@app/modules/tokens/token.module'
import { TransferModule } from '@app/modules/transfers/transfer.module'
import { TxModule } from '@app/modules/txs/tx.module'
import { UncleModule } from '@app/modules/uncles/uncle.module'
import { OrmModule } from '@app/orm/orm.module'
import { LoggerModule } from '@app/shared/logger.module'
import { SharedModule } from '@app/shared/shared.module'
import { Module } from '@nestjs/common'
import { SubscriptionsModule } from '@app/subscriptions/subscriptions.module'

@Module({
  imports: [
    SharedModule,
    GraphQLModule,
    OrmModule,
    BlockModule,
    AccountModule,
    ContractModule,
    TokenModule,
    TxModule,
    UncleModule,
    SearchModule,
    LoggerModule,
    TransferModule,
    BlockMetricsModule,
    SubscriptionsModule,
  ],
})
export class AppModule { }
