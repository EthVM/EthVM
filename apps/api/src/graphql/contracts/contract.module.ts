import { DaoModule } from '@app/dao/dao.module';
import { ContractResolvers } from '@app/graphql/contracts/contract.resolvers';
import { Module } from '@nestjs/common';

@Module({
  imports: [DaoModule],
  providers: [ContractResolvers],
})
export class ContractModule { }
