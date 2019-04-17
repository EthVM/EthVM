import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountEntity } from '@app/orm/entities/account.entity'
import { AccountService } from '@app/modules/accounts/account.service'
import { AccountResolvers } from '@app/modules/accounts/account.resolvers'

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity])],
  providers: [AccountService, AccountResolvers],
  exports: [AccountService],
})
export class AccountModule {}
