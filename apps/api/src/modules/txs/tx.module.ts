import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TransactionEntity } from '@app/orm/entities/transaction.entity'
import { TxService } from '@app/modules/txs/tx.service'
import { TxResolvers } from '@app/modules/txs/tx.resolvers'
import { TransactionTraceEntity } from '@app/orm/entities/transaction-trace.entity'

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity, TransactionTraceEntity])],
  providers: [TxService, TxResolvers],
  exports: [TxService],
})
export class TxModule {}
