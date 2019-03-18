import { Module } from '@nestjs/common'
import { BlockModule } from '@app/modules/blocks/block.module'
import { SharedModule } from '@app/shared/shared.module'
import { OrmModule } from '@app/orm/orm.module'
import { GraphQLModule } from '@app/graphql/graphql.module'
import { BalanceModule } from '@app/modules/balances/balance.module'
import { AccountMetadataModule } from '@app/modules/account-metadata/account-metadata.module'
import { BlockMetricModule } from '@app/modules/block-metrics/block-metric.module'
import { ContractModule } from '@app/modules/contracts/contract.module'
import { ExchangeModule } from '@app/modules/exchanges/exchange.module'
import { ProcessingMetadataModule } from '@app/modules/processing-metadata/processing-metadata.module'
import { TokenTransferModule } from '@app/modules/token-transfers/token-transfer.module'
import { TxModule } from '@app/modules/txs/tx.module'
import { UncleModule } from '@app/modules/uncles/uncle.module'
import { StatisticModule } from '@app/modules/statistics/statistic.module'
import { SearchModule } from '@app/modules/search/search.module'

@Module({
  imports: [
    SharedModule,
    GraphQLModule,
    OrmModule,
    BlockModule,
    BalanceModule,
    AccountMetadataModule,
    BlockMetricModule,
    ContractModule,
    ExchangeModule,
    ProcessingMetadataModule,
    TokenTransferModule,
    TxModule,
    UncleModule,
    StatisticModule,
    SearchModule,
  ],
})
export class AppModule {}
