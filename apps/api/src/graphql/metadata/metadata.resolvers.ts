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

  /**
   * Get metadata including whether or not syncing is in progress
   * @returns {Promise<MetadataDto>}
   */
  @Query()
  async metadata(): Promise<MetadataDto> {

    const isSyncing = await this.metadataService.isSyncing()

    return new MetadataDto({ isSyncing })
  }

  /**
   * Subscribe to notifications of sync status changes.
   */
  @Subscription(
    'isSyncing', {
      // TODO determine why we need to specify the resolve function for this to work
      resolve: (isSyncing: boolean) => isSyncing,
    } as SubscriptionOptions,
  )
  isSyncing() {
    return this.pubSub.asyncIterator('isSyncing')
  }

  /**
   * Subscribe to "keep alive" notifications to ensure websocket is kept open.
   */
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
