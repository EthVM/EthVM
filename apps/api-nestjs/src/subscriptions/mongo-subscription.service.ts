import { ChangeStream, Cursor, getMongoManager, MongoRepository } from 'typeorm'
import { Inject, Injectable } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'
import { Logger } from 'winston'
import { InjectRepository } from '@nestjs/typeorm'
import { ProcessingMetadataEntity } from '@app/orm/entities/processing-metadata.entity'

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

  constructor(@Inject('PUB_SUB') private readonly pubSub: PubSub, @Inject('winston') private readonly logger: Logger,
              @InjectRepository(ProcessingMetadataEntity) private readonly processingMetadataRepository: MongoRepository<ProcessingMetadataEntity>) {
    this.initialize()
  }

  public async initialize() {

    const { logger, pubSub } = this

    // TODO Register internal processing metadata event (so we can turn on/off remaining events)

    // Create stream readers
    logger.info('MongoStreamer - initialize() / Generating stream readers')
    this.blocksReader = new ChangeStreamReader('blocks', pubSub, logger)
    this.blockMetricsReader = new ChangeStreamReader('blockMetrics', pubSub, logger)
    this.processingMetadataReader = new ChangeStreamReader('processingMetadata', pubSub, logger)

    // Check initial syncing state
    logger.info('MongoStreamer - initialize() / Checking status of syncing')
    const syncingStatus = await this.processingMetadataRepository.findOne({where: {_id: 'syncing'}})

    const isSyncing = syncingStatus ? this.isSyncing(syncingStatus) : true

    logger.info(`MongoStreamer - initialize() / Current syncing status is: ${isSyncing}`)

    // Enable / Disable accordingly
    if (isSyncing) {
      this.disableEventsStreaming()
    } else {
      this.enableEventsStreaming()
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

}

class ChangeStreamReader {
  private changeStream: ChangeStream
  private cursor: Cursor<any>

  constructor(private readonly collectionName: string, private readonly pubSub: PubSub, private readonly logger: Logger) {}

  public start() {
    this.logger.info(`MongoChangeStreamReader - start() / Starting to listen change events on: ${this.collectionName}`)
    const manager = getMongoManager()
    const changeStream = (this.changeStream = manager.queryRunner.watch(this.collectionName, [], { fullDocument: 'updateLookup' }))
    this.cursor = changeStream.stream()
    this.pull()
  }

  public async stop() {
    this.logger.info(`MongoChangeStreamReader - start() / Stopping to listen change events on: ${this.collectionName}`)
    if (this.changeStream) {
      await this.changeStream.close()
    }
  }

  private async pull() {
    const { cursor, pubSub, collectionName } = this

    try {
      this.logger.info('MongoChangeStreamReader - pull() / Waiting for event:', collectionName)

      while (!cursor.isClosed()) {
        const next = await cursor.next()

        if (next != null) {
          const { operationType, fullDocument, documentKey } = next
          const event: StreamingEvent = {
            op: operationType,
            key: documentKey._id,
            value: fullDocument
          }
          await pubSub.publish(collectionName, event)
        }
      }
    } catch (e) {
      this.logger.error('MongoChangeStreamReader - pull() / Failed to pull', this.collectionName, ' with error:', e)
    }
  }
}
