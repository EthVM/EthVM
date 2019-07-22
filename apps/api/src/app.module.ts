import { GraphQLModule } from '@app/graphql/graphql.module'
import { AccountModule } from '@app/graphql/accounts/account.module'
import { BlockMetricsModule } from '@app/graphql/block-metrics/block-metrics.module'
import { BlockModule } from '@app/graphql/blocks/block.module'
import { ContractModule } from '@app/graphql/contracts/contract.module'
import { SearchModule } from '@app/graphql/search/search.module'
import { TokenModule } from '@app/graphql/tokens/token.module'
import { TransferModule } from '@app/graphql/transfers/transfer.module'
import { TxModule } from '@app/graphql/txs/tx.module'
import { UncleModule } from '@app/graphql/uncles/uncle.module'
import { OrmModule } from '@app/orm/orm.module'
import { LoggerModule } from '@app/shared/logger.module'
import { SharedModule } from '@app/shared/shared.module'
import { Module } from '@nestjs/common'
import { SubscriptionsModule } from '@app/subscriptions/subscriptions.module'
import { MetadataModule } from '@app/graphql/metadata/metadata.module'

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
    MetadataModule,
    // SubscriptionsModule,
  ],
})
export class AppModule { }
