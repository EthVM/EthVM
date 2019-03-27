import { Module } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'
import { MongoSubscriptionService } from '@app/subscriptions/mongo-subscription.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProcessingMetadataEntity } from '@app/orm/entities/processing-metadata.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ProcessingMetadataEntity])],
  providers: [
    {
      provide: 'PUB_SUB',
      useValue: new PubSub()
    },
    MongoSubscriptionService
  ]
})
export class SubscriptionsModule {

}
