import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProcessingMetadataEntity } from '@app/orm/entities-mongo/processing-metadata.entity'
import { ProcessingMetadataService } from '@app/modules/processing-metadata/processing-metadata.service'
import { ProcessingMetadataResolvers } from '@app/modules/processing-metadata/processing-metadata.resolvers'
import { SubscriptionsModule } from '@app/subscriptions/subscriptions.module'

@Module({
  imports: [TypeOrmModule.forFeature([ProcessingMetadataEntity]), SubscriptionsModule],
  providers: [ProcessingMetadataService, ProcessingMetadataResolvers],
})
export class ProcessingMetadataModule {}
