import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {EntityManager, FindOneOptions, Repository} from 'typeorm'
import { BigNumber } from 'bignumber.js'
import {SyncStatusEntity} from '@app/orm/entities/sync-status.entity';

@Injectable()
export class MetadataService {

  private minIsSyncingRange = 10 // TODO make configurable or update logic

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

  async isSyncing(): Promise<boolean> {
    const latestSyncStatus = await this.latestSyncStatus()
    const blockNumbers = latestSyncStatus.map(item => item.blockNumber)

    return this.calculateIsSyncing(blockNumbers)
  }

  calculateIsSyncing(blockNumbers: BigNumber[]): boolean {
    if (!blockNumbers.length) {
      return true
    }

    const lowestBlockNumber = BigNumber.minimum(...blockNumbers)
    const highestBlockNumber = BigNumber.maximum(...blockNumbers)

    return highestBlockNumber.minus(lowestBlockNumber).gte(this.minIsSyncingRange)
  }

}
