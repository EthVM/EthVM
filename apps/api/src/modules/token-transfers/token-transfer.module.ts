import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TokenTransferEntity } from '@app/orm/entities/token-transfer.entity'
import { TokenTransferService } from '@app/modules/token-transfers/token-transfer.service'
import { TokenTransferResolvers } from '@app/modules/token-transfers/token-transfer.resolvers'
import { ExchangeModule } from '@app/modules/exchanges/exchange.module'

@Module({
  imports: [TypeOrmModule.forFeature([TokenTransferEntity]), forwardRef(() => ExchangeModule)],
  providers: [TokenTransferService, TokenTransferResolvers],
  exports: [TokenTransferService],
})
export class TokenTransferModule {}
