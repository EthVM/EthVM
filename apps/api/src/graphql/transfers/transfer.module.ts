import { DaoModule } from '@app/dao/dao.module';
import { TransferResolvers } from '@app/graphql/transfers/transfer.resolvers';
import { Module } from '@nestjs/common';

@Module({
  imports: [DaoModule],
  providers: [TransferResolvers],
  exports: [],
})
export class TransferModule { }
