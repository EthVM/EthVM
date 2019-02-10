import { ProcessingMetadataRepository } from '@app/server/modules/processing-metadata'
import { ProcessingMetadata } from 'ethvm-common'

export interface ProcessingMetadataService {
  getMetadata(id: string): Promise<ProcessingMetadata | null>
}

export class ProcessingMetadataServiceImpl implements ProcessingMetadataService {
  constructor(private readonly processingRepository: ProcessingMetadataRepository) {}

  public getMetadata(id: string): Promise<ProcessingMetadata | null> {
    return this.processingRepository.getMetadata(id)
  }
}
