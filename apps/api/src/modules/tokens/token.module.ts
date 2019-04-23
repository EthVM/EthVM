import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TokenService } from '@app/modules/tokens/token.service'
import { TokenResolvers } from '@app/modules/tokens/token.resolvers'
import { Erc20BalanceEntity } from '@app/orm/entities/erc20-balance.entity'
import { Erc721BalanceEntity } from '@app/orm/entities/erc721-balance.entity'
import { TokenExchangeRateEntity } from '@app/orm/entities/token-exchange-rate.entity'
import { ContractEntity } from '@app/orm/entities/contract.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Erc20BalanceEntity, Erc721BalanceEntity, TokenExchangeRateEntity, ContractEntity]),
  ],
  providers: [TokenService, TokenResolvers],
  exports: [TokenService],
})
export class TokenModule {}
