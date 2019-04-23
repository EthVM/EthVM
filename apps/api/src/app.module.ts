import { GraphQLModule } from '@app/graphql/graphql.module'
import { BlockModule } from '@app/modules/blocks/block.module'
import { SearchModule } from '@app/modules/search/search.module'
import { TxModule } from '@app/modules/txs/tx.module'
import { OrmModule } from '@app/orm/orm.module'
import { SharedModule } from '@app/shared/shared.module'
import { Module } from '@nestjs/common'
import { LoggerModule } from '@app/shared/logger.module'
import { AccountModule } from '@app/modules/accounts/account.module'
import { ContractModule } from '@app/modules/contracts/contract.module'
import { UncleModule } from '@app/modules/uncles/uncle.module'
import { TokenModule } from '@app/modules/tokens/token.module'
import { TransferModule } from '@app/modules/transfers/transfer.module'
import {BlockMetricsModule} from '@app/modules/block-metrics/block-metrics.module';

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
  ],
})
export class AppModule {}
