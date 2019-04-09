import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BalanceEntity } from '@app/orm/entities/balance.entity'
import { BalanceService } from '@app/modules/balances/balance.service'
import { BalanceResolvers } from '@app/modules/balances/balance.resolvers'

@Module({
  imports: [TypeOrmModule.forFeature([BalanceEntity])],
  providers: [BalanceService, BalanceResolvers],
  exports: [BalanceService]
})
export class BalanceModule {}
