import { DaoModule } from '@app/dao/dao.module';
import { BlockResolvers } from '@app/graphql/blocks/block.resolvers';
import { SubscriptionsModule } from '@app/subscriptions/subscriptions.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [DaoModule, SubscriptionsModule],
  providers: [BlockResolvers],
  exports: []
})
export class BlockModule { }
