import { ChangeStream, Cursor, getMongoManager, MongoRepository } from 'typeorm'
import { Inject, Injectable } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'
import { Logger } from 'winston'
import { InjectRepository } from '@nestjs/typeorm'
import { ProcessingMetadataEntity } from '@app/orm/entities/processing-metadata.entity'
import { BlockEntity } from '@app/orm/entities/block.entity'
import { BlockMetricEntity } from '@app/orm/entities/block-metric.entity'

export interface StreamingEvent {
  op: 'insert' | 'delete' | 'replace' | 'updated' | 'invalidate'
  key: any
  value: any
}

@Injectable()
export class MongoSubscriptionService {
  blocksReader
  blockMetricsReader
  processingMetadataReader

  constructor(
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
    @Inject('winston') private readonly logger: Logger,
    @InjectRepository(ProcessingMetadataEntity) private readonly processingMetadataRepository: MongoRepository<ProcessingMetadataEntity>,
  ) {
    this.initialize()
  }

  public async initialize() {
    const { logger, pubSub } = this

    // Register internal processing metadata event (so we can turn on/off remaining events)
    pubSub.subscribe('internalProcessingMetadata', (event: StreamingEvent) => {
      logger.info(`MongoStreamer - CheckSyncingStatusFn() / Procesing new Processing Metadata internal event with key: ${event.key}`)

      if (event.key === 'syncing') {
        const status = event.value.boolean
        if (status) {
          this.disableEventsStreaming()
        } else {
          this.enableEventsStreaming()
        }

        // Re-publish event with triggerName for graphQL subscription
        pubSub.publish('processingMetadata', event)
      }
    })

    // Create stream readers
    logger.info('MongoStreamer - initialize() / Generating stream readers')
    this.blocksReader = new ChangeStreamReader('blocks', pubSub, logger)
    this.blockMetricsReader = new ChangeStreamReader('block_metrics', pubSub, logger)
    this.processingMetadataReader = new ChangeStreamReader('processing_metadata', pubSub, logger, 'internalProcessingMetadata')

    // Check initial syncing state
    logger.info('MongoStreamer - initialize() / Checking status of syncing')
    const syncingStatus = await this.processingMetadataRepository.findOne({ where: { _id: 'syncing' } })

    const isSyncing = syncingStatus ? this.isSyncing(syncingStatus) : false // TODO set to true

    logger.info(`MongoStreamer - initialize() / Current syncing status is: ${isSyncing}`)

    // Enable / Disable accordingly
    if (isSyncing) {
      this.disableEventsStreaming()
    } else {
      this.enableEventsStreaming()

      // TODO remove this
      // this.testBlockSubscription()
      // this.testBlockMetricSubscription()
    }

    logger.info('MongoStreamer - initialize() / Enabling Processing Metadata streamer')
    this.processingMetadataReader.start()

    return Promise.resolve(true)
  }

  private async enableEventsStreaming() {
    this.logger.info('MongoStreamer - enableEventsStreaming() / Enabling streaming events')
    this.blocksReader.start()
    this.blockMetricsReader.start()
  }

  private async disableEventsStreaming() {
    this.logger.info('MongoStreamer - disableEventsStreaming() / Disabling streaming events')
    this.blocksReader.stop()
    this.blockMetricsReader.stop()
  }

  private isSyncing(syncingStatus: ProcessingMetadataEntity): boolean {
    if (syncingStatus.boolean) return syncingStatus.boolean
    const value = syncingStatus.int || syncingStatus.long || syncingStatus.float || syncingStatus.double || syncingStatus.bigInteger
    return !!value
  }

  private async testBlockSubscription() {
    const asyncTimeout = async ms => {
      return new Promise(resolve => setTimeout(resolve, ms))
    }

    const manager = getMongoManager()

    for await (const i of [1, 2, 3, 4, 5]) {
      this.logger.info('MongoStreamer - testBlockSubscription() / Testing block subscription')
      await asyncTimeout(10000)

      const block = await manager.findOne(BlockEntity)
      let prevId = +block.id
      const newBlock = { ...block }
      newBlock.id = prevId++
      newBlock.header.hash = Math.random()
        .toString(36)
        .substring(7)

      const entity = manager.create(BlockEntity, newBlock)
      await manager.save(entity)
    }
  }

  private async testBlockMetricSubscription() {
    const asyncTimeout = async ms => {
      return new Promise(resolve => setTimeout(resolve, ms))
    }

    const manager = getMongoManager()

    for await (const i of [1, 2, 3, 4, 5]) {
      this.logger.info('MongoStreamer - testBlockMetricSubscription() / Testing block metric subscription')
      await asyncTimeout(10000)

      const blockMetric = await manager.findOne(BlockMetricEntity, { order: { number: 'DESC' } })
      const newBlockMetric = { ...blockMetric }
      const nextNumber = blockMetric.number + 1
      delete newBlockMetric.id
      newBlockMetric.number = nextNumber

      const entity = manager.create(BlockMetricEntity, newBlockMetric)
      await manager.save(entity)
    }
  }
}

class ChangeStreamReader {
  private changeStream: ChangeStream
  private cursor: Cursor<any>

  constructor(
    private readonly collectionName: string,
    private readonly pubSub: PubSub,
    private readonly logger: Logger,
    private readonly triggerName?: string,
  ) {}

  public start() {
    this.logger.info(`MongoChangeStreamReader - start() / Starting to listen change events on: ${this.collectionName}`)
    const manager = getMongoManager()
    const changeStream = (this.changeStream = manager.queryRunner.watch(this.collectionName, [], { fullDocument: 'updateLookup' }))
    this.cursor = changeStream.stream()
    this.pull()
  }

  public async stop() {
    this.logger.info(`MongoChangeStreamReader - stop() / Stopping to listen change events on: ${this.collectionName}`)
    if (this.changeStream) {
      await this.changeStream.close()
    }
  }

  private async pull() {
    const { cursor, pubSub, collectionName, triggerName } = this

    try {
      this.logger.info(`MongoChangeStreamReader - pull() / Waiting for event: ${collectionName}`)

      while (!cursor.isClosed()) {
        const next = await cursor.next()

        if (next != null) {
          const { operationType, fullDocument, documentKey } = next
          const event: StreamingEvent = {
            op: operationType,
            key: documentKey._id,
            value: fullDocument,
          }
          const trigger = triggerName || collectionName
          await pubSub.publish(trigger, event)
        }
      }
    } catch (e) {
      this.logger.error('MongoChangeStreamReader - pull() / Failed to pull', this.collectionName, ' with error:', e)
    }
  }
}
