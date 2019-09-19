import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {EntityManager, FindOneOptions, Repository} from 'typeorm'
import { BigNumber } from 'bignumber.js'
import {SyncStatusEntity} from '@app/orm/entities/sync-status.entity'

@Injectable()
export class MetadataService {

  /**
   * @private
   * @default
   */
  private minIsSyncingRange = 10 // TODO make configurable or update logic

  constructor(
    @InjectRepository(SyncStatusEntity)
    private readonly syncStatusRepository: Repository<SyncStatusEntity>,
  ) {
  }

  /**
   * Get the latest valid block number (all processors have synced as far as this block).
   * @param {EntityManager} [entityManager] - Txn within which to perform the query.
   * @param {boolean} [cache=true] - Whether to use the cache.
   * @returns {Promise<BigNumber | undefined>}
   */
  async latestBlockNumber(entityManager?: EntityManager, cache: boolean = true): Promise<BigNumber | undefined> {

    let syncStatus
    const findOptions: FindOneOptions = { order: { blockNumber: 'ASC' }, cache }

    // Get the latest block number for the component which has synced the least.
    if (entityManager) {
      syncStatus = await entityManager.findOne(SyncStatusEntity, findOptions)
    } else {
      syncStatus = await this.syncStatusRepository.findOne(findOptions)
    }

    return syncStatus ? new BigNumber(syncStatus.blockNumber) : undefined

  }

  /**
   * Get the latest sync status entries (one entry per processor).
   * @returns {Promise<SyncStatusEntity[]>}
   */
  async latestSyncStatus(): Promise<SyncStatusEntity[]> {
    return await this.syncStatusRepository.find()
  }

  /**
   * Get whether or not syncing is in progress.
   * @returns {Promise<boolean>}
   */
  async isSyncing(): Promise<boolean> {

    // Get the latest synced block numbers for each processor.
    const latestSyncStatus = await this.latestSyncStatus()
    const blockNumbers = latestSyncStatus.map(item => item.blockNumber)

    // Determine whether syncing is in process by using the difference between the most and least synced processors.
    return this.calculateIsSyncing(blockNumbers)
  }

  calculateIsSyncing(blockNumbers: BigNumber[]): boolean {
    if (!blockNumbers.length) {
      // If no block numbers are provided, syncing has not yet begun but return true to indicate it must still happen.
      return true
    }

    // Calculate the difference between the highest and lowest block numbers and return true if the difference is greater than or equal to "minIsSyncingRange".

    const lowestBlockNumber = BigNumber.minimum(...blockNumbers)
    const highestBlockNumber = BigNumber.maximum(...blockNumbers)

    return highestBlockNumber.minus(lowestBlockNumber).gte(this.minIsSyncingRange)
  }

}
