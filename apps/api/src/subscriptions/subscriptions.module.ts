import { Module } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'
import { MongoSubscriptionService } from '@app/subscriptions/mongo-subscription.service'

const pubSubProvider = {
  provide: 'PUB_SUB',
  useValue: new PubSub(),
}

@Module({
  imports: [],
  providers: [pubSubProvider, MongoSubscriptionService],
  exports: [pubSubProvider],
})
export class SubscriptionsModule {}
