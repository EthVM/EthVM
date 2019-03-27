import { Module } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'
import { MongoSubscriptionService } from '@app/subscriptions/mongo-subscription.service'
import { BlockEntity } from '@app/orm/entities/block.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BlockMetricEntity } from '@app/orm/entities/block-metric.entity'

@Module({
  imports: [TypeOrmModule.forFeature([BlockEntity, BlockMetricEntity])],
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
