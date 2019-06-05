import { DaoModule } from '@app/dao/dao.module'
import { SubscriptionsModule } from '@app/subscriptions/subscriptions.module'
import { Module } from '@nestjs/common'
import { MetadataResolvers } from '@app/graphql/metadata/metadata.resolvers'

@Module({
  imports: [DaoModule, SubscriptionsModule],
  providers: [MetadataResolvers],
  exports: [],
})
export class MetadataModule { }
