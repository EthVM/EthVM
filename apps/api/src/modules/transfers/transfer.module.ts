import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FungibleBalanceTransferEntity } from '@app/orm/entities/fungible-balance-transfer.entity'
import { TransferService } from '@app/modules/transfers/transfer.service'
import { TransferResolvers } from '@app/modules/transfers/transfer.resolvers'

@Module({
  imports: [
    TypeOrmModule.forFeature([FungibleBalanceTransferEntity]),
  ],
  providers: [TransferService, TransferResolvers],
  exports: []
})
export class TransferModule {}
