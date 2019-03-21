import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProcessingMetadataEntity } from '@app/orm/entities/processing-metadata.entity'
import { ProcessingMetadataService } from '@app/modules/processing-metadata/processing-metadata.service'
import { ProcessingMetadataResolvers } from '@app/modules/processing-metadata/processing-metadata.resolvers'

@Module({
  imports: [TypeOrmModule.forFeature([ProcessingMetadataEntity])],
  providers: [ProcessingMetadataService, ProcessingMetadataResolvers],
})
export class ProcessingMetadataModule {}
