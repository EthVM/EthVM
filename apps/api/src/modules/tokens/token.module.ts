import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TokenService } from '@app/modules/tokens/token.service'
import { TokenResolvers } from '@app/modules/tokens/token.resolvers'
import { Erc20BalanceEntity } from '@app/orm/entities/erc20-balance.entity'
import { Erc721BalanceEntity } from '@app/orm/entities/erc721-balance.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Erc20BalanceEntity, Erc721BalanceEntity]),
  ],
  providers: [TokenService, TokenResolvers],
  exports: [TokenService],
})
export class TokenModule {}
