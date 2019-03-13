import { Module } from '@nestjs/common'
import { BlockModule } from '@app/modules/blocks/block.module'
import { SharedModule } from '@app/shared/shared.module'
import { OrmModule } from '@app/orm/orm.module'
import { GraphQLModule } from '@app/graphql/graphql.module'
import { BalanceModule } from '@app/modules/balances/balance.module'
import { AccountMetadataModule } from '@app/modules/account-metadata/account-metadata.module'
import { BlockMetricModule } from '@app/modules/block-metrics/block-metric.module'
import { ContractModule } from '@app/modules/contracts/contract.module'

@Module({
  imports: [
    SharedModule,
    GraphQLModule,
    OrmModule,
    BlockModule,
    BalanceModule,
    AccountMetadataModule,
    BlockMetricModule,
    ContractModule
  ]
})
export class AppModule {}
