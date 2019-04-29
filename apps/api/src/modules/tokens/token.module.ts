import { TokenResolvers } from '@app/modules/tokens/token.resolvers'
import { TokenService } from '@app/modules/tokens/token.service'
import { CoinExchangeRateEntity } from '@app/orm/entities/coin-exchange-rate.entity'
import { ContractEntity } from '@app/orm/entities/contract.entity'
import { Erc20BalanceEntity } from '@app/orm/entities/erc20-balance.entity'
import { Erc721BalanceEntity } from '@app/orm/entities/erc721-balance.entity'
import { Erc20MetadataEntity } from '@app/orm/entities/erc20-metadata.entity'
import { Erc721MetadataEntity } from '@app/orm/entities/erc721-metadata.entity'
import { TokenExchangeRateEntity } from '@app/orm/entities/token-exchange-rate.entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([Erc20BalanceEntity, Erc721BalanceEntity, Erc20MetadataEntity, Erc721MetadataEntity, TokenExchangeRateEntity, CoinExchangeRateEntity, ContractEntity])],
  providers: [TokenService, TokenResolvers],
  exports: [TokenService],
})
export class TokenModule {}
