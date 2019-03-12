import { Injectable } from '@nestjs/common'
import { MongoRepository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { AccountMetadataEntity } from '@app/orm/entities/account-metadata.entity'

@Injectable()
export class AccountMetadataService {

  constructor(@InjectRepository(AccountMetadataEntity)
              private readonly accountMetadataRepository: MongoRepository<AccountMetadataEntity>) {}

  async findAccountMetadataByHash(id: string): Promise<AccountMetadataEntity | null> {

    return this.accountMetadataRepository.findOne({where: {_id: id}})

  }

}
