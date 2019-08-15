import { Query, Resolver, Subscription, SubscriptionOptions } from '@nestjs/graphql'
import { MetadataService } from '@app/dao/metadata.service'
import { MetadataDto } from '@app/graphql/metadata/dto/metadata.dto'
import { Inject } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'

@Resolver('Metadata')
export class MetadataResolvers {

  constructor(
    private readonly metadataService: MetadataService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {
  }

  @Query()
  async metadata() {
    const isSyncing = await this.metadataService.isSyncing()
    return new MetadataDto({ isSyncing })
  }

  @Subscription(
    'isSyncing', {
      // TODO determine why we need to specify the resolve function for this to work
      resolve: (isSyncing: boolean) => isSyncing,
    } as SubscriptionOptions,
  )
  isSyncing() {
    return this.pubSub.asyncIterator('isSyncing')
  }

  @Subscription(
    'keepAlive', {
      // TODO determine why we need to specify the resolve function for this to work
      resolve: (keepAlive: boolean) => keepAlive,
    } as SubscriptionOptions,
  )
  keepAlive() {
    return this.pubSub.asyncIterator('keepAlive')
  }

}
