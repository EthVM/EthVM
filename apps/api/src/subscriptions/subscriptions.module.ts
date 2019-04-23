import { Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PgSubscriptionService } from './pg-subscription.service';

const pubSubProvider = {
  provide: 'PUB_SUB',
  useValue: new PubSub(),
}

@Module({
  imports: [],
  providers: [pubSubProvider, PgSubscriptionService],
  exports: [pubSubProvider],
})
export class SubscriptionsModule { }
