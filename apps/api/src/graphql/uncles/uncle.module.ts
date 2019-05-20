import { DaoModule } from '@app/dao/dao.module';
import { UncleResolvers } from '@app/graphql/uncles/uncle.resolvers';
import { Module } from '@nestjs/common';

@Module({
  imports: [DaoModule],
  providers: [UncleResolvers],
  exports: [],
})
export class UncleModule { }
