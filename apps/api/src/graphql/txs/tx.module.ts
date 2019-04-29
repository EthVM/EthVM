import { DaoModule } from '@app/dao/dao.module';
import { TxResolvers } from '@app/graphql/txs/tx.resolvers';
import { Module } from '@nestjs/common';
import {SubscriptionsModule} from "@app/subscriptions/subscriptions.module";

@Module({
  imports: [DaoModule, SubscriptionsModule],
  providers: [TxResolvers],
  exports: [],
})
export class TxModule { }
