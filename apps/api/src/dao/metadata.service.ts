import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {EntityManager, FindOneOptions, Repository} from 'typeorm'
import { BigNumber } from 'bignumber.js'
import {SyncStatusEntity} from '@app/orm/entities/sync-status.entity';

@Injectable()
export class MetadataService {

  constructor(
    @InjectRepository(SyncStatusEntity)
    private readonly syncStatusRepository: Repository<SyncStatusEntity>,
  ) {
  }

  async latestBlockNumber(entityManager?: EntityManager, cache: boolean = true): Promise<BigNumber | undefined> {

    let syncStatus
    const findOptions: FindOneOptions = { order: { blockNumber: 'ASC' }, cache }

    // Get the latest block number for the component which has synced the least
    if (entityManager) {
      syncStatus = await entityManager.findOne(SyncStatusEntity, findOptions)
    } else {
      syncStatus = await this.syncStatusRepository.findOne(findOptions)
    }

    return syncStatus ? new BigNumber(syncStatus.blockNumber) : undefined

  }

  async latestSyncStatus(): Promise<SyncStatusEntity[]> {
    return await this.syncStatusRepository.find()
  }

}
