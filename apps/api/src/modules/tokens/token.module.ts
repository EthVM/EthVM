import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TokenTransferEntity } from '@app/orm/entities-mongo/token-transfer.entity'
import { TokenService } from '@app/modules/tokens/token.service'
import { TokenResolvers } from '@app/modules/tokens/token.resolvers'
import { ExchangeModule } from '@app/modules/exchanges/exchange.module'

@Module({
  imports: [TypeOrmModule.forFeature([TokenTransferEntity]), forwardRef(() => ExchangeModule)],
  providers: [TokenService, TokenResolvers],
  exports: [TokenService],
})
export class TokenModule {}
