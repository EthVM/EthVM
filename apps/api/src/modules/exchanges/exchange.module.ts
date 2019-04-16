import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TokenExchangeRateEntity } from '@app/orm/entities-mongo/token-exchange-rate.entity'
import { ExchangeService } from '@app/modules/exchanges/exchange.service'
import { TokenExchangeRateResolvers } from '@app/modules/exchanges/token-exchange-rate.resolvers'
import { TokenModule } from '@app/modules/tokens/token.module'

@Module({
  imports: [TypeOrmModule.forFeature([TokenExchangeRateEntity]), forwardRef(() => TokenModule)],
  providers: [ExchangeService, TokenExchangeRateResolvers],
  exports: [ExchangeService],
})
export class ExchangeModule {}
