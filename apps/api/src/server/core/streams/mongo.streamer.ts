import { logger } from '@app/logger'
import { Streamer, StreamingEvent } from '@app/server/core/streams/streamer'
import { toProcessingMetadata } from '@app/server/modules/processing-metadata'
import { MongoEthVM } from '@app/server/repositories'
import { SocketEvent, SocketRooms } from 'ethvm-common'
import * as EventEmitter from 'eventemitter3'
import { ChangeStream, Collection, Cursor, Db } from 'mongodb'

const INTERNAL_PROCESSING_METADATA_EVENT = 'internal-processing-metadata-event'

export class MongoStreamer implements Streamer {
  private blocksReader: ChangeStreamReader
  private pendingTxReader: ChangeStreamReader
  private blockMetricsReader: ChangeStreamReader
  private processingMetadataReader: ChangeStreamReader

  constructor(private readonly db: Db, private readonly emitter: EventEmitter) {}

  public async initialize(): Promise<boolean> {
    const { db, emitter } = this
    const { Blocks, PendingTxs, BlockMetrics, ProcessingMetadata } = SocketRooms

    // Register internal processing metadata event (so we can turn on/off remaining events)
    emitter.addListener(INTERNAL_PROCESSING_METADATA_EVENT, (event: SocketEvent) => {
      logger.info(`MongoStreamer - CheckSyncingStatusFn() / Procesing new Processing Metadata internal event with key: ${event.key}`)

      if (event.key === 'syncing') {
        const status = event.value.boolean
        if (status) {
          this.disableEventsStreaming()
        } else {
          this.enableEventsStreaming()
        }

        emitter.emit(ProcessingMetadata, event)
      }
    })

    // Create stream readers
    logger.info('MongoStreamer - initialize() / Generating stream readers')
    this.blocksReader = new ChangeStreamReader(db.collection(MongoEthVM.collections.blocks), Blocks, emitter)
    this.pendingTxReader = new ChangeStreamReader(db.collection(MongoEthVM.collections.pendingTxs), PendingTxs, emitter)
    this.blockMetricsReader = new ChangeStreamReader(db.collection(MongoEthVM.collections.blocks), BlockMetrics, emitter)
    this.processingMetadataReader = new ChangeStreamReader(
      db.collection(MongoEthVM.collections.processingMetadata),
      INTERNAL_PROCESSING_METADATA_EVENT,
      emitter
    )

    // Start only processing metadata reader to listen for events
    logger.info('MongoStreamer - initialize() / Enabling Processing Metadata streamer')
    await this.processingMetadataReader.start()

    // Check initial syncing state
    logger.info('MongoStreamer - initialize() / Checking status of syncing')
    const syncStatus = await this.db
      .collection(MongoEthVM.collections.processingMetadata)
      .findOne({ _id: 'syncing' })
      .then(res => res ? toProcessingMetadata(res) : { value: true })
    const isSyncing = syncStatus.value
    logger.info(`MongoStreamer - initialize() / Current syncing status is: ${isSyncing}`)

    // Enable / Disable accordingly
    if (isSyncing) {
      this.disableEventsStreaming()
    } else {
      this.enableEventsStreaming()
    }

    return Promise.resolve(true)
  }

  public addListener(eventName: string, fn: EventEmitter.ListenerFn) {
    this.emitter.addListener(eventName, fn)
  }

  public removeListener(eventName: string, fn?: EventEmitter.ListenerFn) {
    this.emitter.removeListener(eventName, fn)
  }

  private async enableEventsStreaming() {
    logger.info('MongoStreamer - enableEventsStreaming() / Enabling streaming events')
    this.blocksReader.start()
    this.pendingTxReader.start()
    this.blockMetricsReader.start()
  }

  private async disableEventsStreaming() {
    logger.info('MongoStreamer - disableEventsStreaming() / Disabling streaming events')
    this.blocksReader.stop()
    this.pendingTxReader.stop()
    this.blockMetricsReader.stop()
  }
}

class ChangeStreamReader {
  private changeStream: ChangeStream
  private cursor: Cursor<any>

  constructor(private readonly collection: Collection, private readonly eventType: string, private readonly emitter: EventEmitter) {}

  public start() {
    logger.info(`MongoChangeStreamReader - start() / Starting to listen change events on: ${this.eventType}`)
    const changeStream = (this.changeStream = this.collection.watch([], { fullDocument: 'updateLookup' }))
    this.cursor = changeStream.stream()
    this.pull()
  }

  public async stop() {
    logger.info(`MongoChangeStreamReader - start() / Stopping to listen change events on: ${this.eventType}`)
    if (this.changeStream) {
      await this.changeStream.close()
    }
  }

  private async pull() {
    const { cursor, eventType, emitter } = this

    try {
      logger.info('MongoChangeStreamReader - pull() / Waiting for event:', eventType)

      while (!cursor.isClosed()) {
        const next = await cursor.next()

        if (next != null) {
          const { operationType, fullDocument, documentKey } = next
          const event: StreamingEvent = {
            op: operationType,
            key: documentKey._id,
            value: fullDocument
          }
          emitter.emit(eventType, event)
        }
      }
    } catch (e) {
      logger.error('MongoChangeStreamReader - pull() / Failed to pull', this.eventType, ' with error:', e)
    }
  }
}
