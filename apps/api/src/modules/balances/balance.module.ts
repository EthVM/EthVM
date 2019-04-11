import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BalanceService } from '@app/modules/balances/balance.service'
import { BalanceResolvers } from '@app/modules/balances/balance.resolvers'
import { BalanceEntity } from '@app/orm/entities-mongo/balance.entity'

@Module({
  imports: [TypeOrmModule.forFeature([BalanceEntity])],
  providers: [BalanceService, BalanceResolvers],
  exports: [BalanceService],
})
export class BalanceModule {}
