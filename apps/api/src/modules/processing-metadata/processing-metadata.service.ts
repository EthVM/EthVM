import { Injectable } from '@nestjs/common'
import { ProcessingMetadataEntity } from '@app/orm/entities-mongo/processing-metadata.entity'
import { MongoRepository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class ProcessingMetadataService {
  constructor(
    @InjectRepository(ProcessingMetadataEntity)
    private readonly processingMetadataRepository: MongoRepository<ProcessingMetadataEntity>,
  ) {}

  async findProcessingMetaDataById(id: string): Promise<ProcessingMetadataEntity | undefined> {
    return this.processingMetadataRepository.findOne({ where: { id } })
  }
}
