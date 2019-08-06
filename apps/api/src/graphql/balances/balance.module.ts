import { DaoModule } from '@app/dao/dao.module'
import { Module } from '@nestjs/common'
import { BalanceResolvers } from '@app/graphql/balances/balance.resolvers'

@Module({
  imports: [DaoModule],
  providers: [BalanceResolvers],
  exports: [],
})
export class BalanceModule { }
