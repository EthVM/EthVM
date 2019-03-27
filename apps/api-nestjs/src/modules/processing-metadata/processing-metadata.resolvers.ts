import { Args, Query, Resolver, Subscription } from '@nestjs/graphql'
import { ProcessingMetadataService } from '@app/modules/processing-metadata/processing-metadata.service'
import { ProcessingMetadataDto } from '@app/modules/processing-metadata/processing-metadata.dto'
import { BlockDto } from '@app/modules/blocks/block.dto'
import { Inject } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'

@Resolver('ProcessingMetadata')
export class ProcessingMetadataResolvers {
  constructor(private readonly processingMetadataService: ProcessingMetadataService, @Inject('PUB_SUB') private pubSub: PubSub) {}

  @Query()
  async processingMetadataById(@Args('id') id: string) {
    const entity = await this.processingMetadataService.findProcessingMetaDataById(id)
    return entity ? new ProcessingMetadataDto(entity) : null
  }

  @Subscription()
  newProcessingMetadata() {
    // TODO use withFilter to filter by event type
    return {
      resolve: (payload) => {
        return new BlockDto(payload.value)
      },
      subscribe: () => this.pubSub.asyncIterator('blocks')
    }
  }
}
