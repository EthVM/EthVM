import { DaoModule } from '@app/dao/dao.module';
import { SearchResolvers } from '@app/graphql/search/search.resolvers';
import { Module } from '@nestjs/common';

@Module({
  imports: [DaoModule],
  providers: [SearchResolvers],
})
export class SearchModule { }
