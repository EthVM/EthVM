import { Args, Query, Resolver } from '@nestjs/graphql'
import { ProcessingMetadataService } from '@app/modules/processing-metadata/processing-metadata.service'
import { ProcessingMetadataDto } from '@app/modules/processing-metadata/processing-metadata.dto'

@Resolver('ProcessingMetadata')
export class ProcessingMetadataResolvers {
  constructor(private readonly processingMetadataService: ProcessingMetadataService) {}

  @Query()
  async processingMetadataById(@Args('id') id: string) {
    const entity = await this.processingMetadataService.findProcessingMetaDataById(id)
    return entity ? new ProcessingMetadataDto(entity) : null
  }
}
