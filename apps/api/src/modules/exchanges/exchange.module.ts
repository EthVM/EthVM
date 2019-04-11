import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TokenExchangeRateEntity } from '@app/orm/entities-mongo/token-exchange-rate.entity'
import { ExchangeService } from '@app/modules/exchanges/exchange.service'
import { TokenExchangeRateResolvers } from '@app/modules/exchanges/token-exchange-rate.resolvers'
import { TokenTransferModule } from '@app/modules/token-transfers/token-transfer.module'

@Module({
  imports: [TypeOrmModule.forFeature([TokenExchangeRateEntity]), forwardRef(() => TokenTransferModule)],
  providers: [ExchangeService, TokenExchangeRateResolvers],
  exports: [ExchangeService],
})
export class ExchangeModule {}
