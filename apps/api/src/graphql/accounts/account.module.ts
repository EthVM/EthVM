import { DaoModule } from '@app/dao/dao.module';
import { AccountResolvers } from '@app/graphql/accounts/account.resolvers';
import { Module } from '@nestjs/common';

@Module({
  imports: [DaoModule],
  providers: [AccountResolvers],
  exports: [],
})
export class AccountModule { }
