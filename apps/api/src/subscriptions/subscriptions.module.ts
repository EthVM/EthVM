import { Module } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'
import { MongoSubscriptionService } from '@app/subscriptions/mongo-subscription.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProcessingMetadataEntity } from '@app/orm/entities/processing-metadata.entity'

const pubSubProvider = {
  provide: 'PUB_SUB',
  useValue: new PubSub(),
}

@Module({
  imports: [TypeOrmModule.forFeature([ProcessingMetadataEntity])],
  providers: [pubSubProvider, MongoSubscriptionService],
  exports: [pubSubProvider],
})
export class SubscriptionsModule {}
