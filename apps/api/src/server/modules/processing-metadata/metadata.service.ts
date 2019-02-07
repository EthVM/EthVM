import { ProcessingMetadataRepository } from '@app/server/modules/processing-metadata'
import { ProcessingMetadata } from 'ethvm-common'

export interface ProcessingMetadataService {
  getMetadata(id: string): Promise<ProcessingMetadata>
}

export class ProcessingMetadataServiceImpl implements ProcessingMetadataService {
  constructor(private readonly processingRepository: ProcessingMetadataRepository) {}

  public getMetadata(id: string): Promise<any> {
    return this.processingRepository.getMetadata(id)
  }
}
