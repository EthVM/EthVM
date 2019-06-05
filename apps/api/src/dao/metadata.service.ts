import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MetadataEntity } from '@app/orm/entities/metadata.entity'

@Injectable()
export class MetadataService {

  constructor(
    @InjectRepository(MetadataEntity)
    private readonly metadataRepository: Repository<MetadataEntity>,
  ) {
  }

  async isSyncing(): Promise<boolean | undefined> {
    const entry = await this.metadataRepository.findOne('sync_status')
    return entry ? JSON.parse(entry.value) : undefined
  }

}
