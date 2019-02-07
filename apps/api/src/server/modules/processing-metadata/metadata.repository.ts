import { toProcessingMetadata } from '@app/server/modules/processing-metadata'
import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'
import { ProcessingMetadata } from 'ethvm-common'

export interface ProcessingMetadataRepository {
  getMetadata(id: string): Promise<ProcessingMetadata | null>
}

export class MongoProcessingMetadataRepository extends BaseMongoDbRepository implements ProcessingMetadataRepository {
  public getMetadata(id: string): Promise<ProcessingMetadata | null> {
    return this.db
      .collection(MongoEthVM.collections.processingMetadata)
      .findOne({ _id: id })
      .then(resp => (resp ? toProcessingMetadata(resp) : null))
  }
}
