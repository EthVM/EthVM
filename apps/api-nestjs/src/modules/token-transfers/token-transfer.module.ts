import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TokenTransferEntity } from '@app/orm/entities/token-transfer.entity'
import { TokenTransferService } from '@app/modules/token-transfers/token-transfer.service'
import { TokenTransferResolvers } from '@app/modules/token-transfers/token-transfer.resolvers'

@Module({
  imports: [TypeOrmModule.forFeature([TokenTransferEntity])],
  providers: [TokenTransferService, TokenTransferResolvers]
})
export class TokenTransferModule {}
