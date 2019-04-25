import { DaoModule } from '@app/dao/dao.module';
import { TxResolvers } from '@app/graphql/txs/tx.resolvers';
import { Module } from '@nestjs/common';

@Module({
  imports: [DaoModule],
  providers: [TxResolvers],
  exports: [],
})
export class TxModule { }
