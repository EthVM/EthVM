import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ContractService } from '@app/modules/contracts/contract.service'
import { ContractResolvers } from '@app/modules/contracts/contract.resolvers'
import { ContractEntity } from '@app/orm/entities/contract.entity'
import { TransactionEntity } from '@app/orm/entities/transaction.entity'
import { TransactionReceiptEntity } from '@app/orm/entities/transaction-receipt.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity, TransactionEntity, TransactionReceiptEntity])],
  providers: [ContractService, ContractResolvers],
})
export class ContractModule {}
