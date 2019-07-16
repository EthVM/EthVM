import { DaoModule } from '@app/dao/dao.module'
import { PgSubscriptionService } from '@app/subscriptions/pg-subscription.service'
import { Module } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'

const pubSubProvider = {
  provide: 'PUB_SUB',
  useValue: new PubSub(),
}

@Module({
  imports: [DaoModule],
  providers: [pubSubProvider, PgSubscriptionService],
  exports: [pubSubProvider],
})
export class SubscriptionsModule { }
