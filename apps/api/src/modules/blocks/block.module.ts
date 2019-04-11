import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BlockService } from '@app/modules/blocks/block.service'
import { BlockResolvers } from '@app/modules/blocks/block.resolvers'
import { BlockHeaderEntity } from '@app/orm/entities/block-header.entity'
import { TransactionEntity } from '@app/orm/entities/transaction.entity'
import { TransactionTraceEntity } from '@app/orm/entities/transaction-trace.entity'

@Module({
  imports: [TypeOrmModule.forFeature([BlockHeaderEntity, TransactionEntity, TransactionTraceEntity])],
  providers: [BlockService, BlockResolvers],
  exports: [BlockService],
})
export class BlockModule {}
