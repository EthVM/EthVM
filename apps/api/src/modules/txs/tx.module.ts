import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TransactionEntity } from '@app/orm/entities/transaction.entity'
import { TxService } from '@app/modules/txs/tx.service'
import { TxResolvers } from '@app/modules/txs/tx.resolvers'
import { SubscriptionsModule } from '@app/subscriptions/subscriptions.module'

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity]), SubscriptionsModule],
  providers: [TxService, TxResolvers],
  exports: [TxService]
})
export class TxModule {}
