import { DaoModule } from '@app/dao/dao.module';
import { TokenResolvers } from '@app/graphql/tokens/token.resolvers';
import { Module } from '@nestjs/common';

@Module({
  imports: [DaoModule],
  providers: [TokenResolvers],
  exports: [],
})
export class TokenModule { }
