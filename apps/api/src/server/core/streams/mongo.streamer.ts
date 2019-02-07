import { logger } from '@app/logger'
import { Streamer, StreamingEvent } from '@app/server/core/streams/streamer'
import { toProcessingMetadata } from '@app/server/modules/processing-metadata'
import { MongoEthVM } from '@app/server/repositories'
import { SocketRooms } from 'ethvm-common'
import EventEmitter from 'eventemitter3'
import { ChangeStream, Collection, Cursor, Db } from 'mongodb'

const INTERNAL_PROCESSING_METADATA_EVENT = 'internal-processing-metadata-event'

export class MongoStreamer implements Streamer {
  private blocksReader: MongoChangeStreamReader
  private pendingTxReader: MongoChangeStreamReader
  private blockMetricsReader: MongoChangeStreamReader
  private processingMetadataReader: MongoChangeStreamReader

  constructor(private readonly db: Db, private readonly emitter: EventEmitter) {}

  public async initialize(): Promise<boolean> {
    const { db, emitter } = this
    const { Blocks, PendingTxs, BlockMetrics, ProcessingMetadata } = SocketRooms

    // Register internal processing metadata event (so we can turn on/off remaining events)
    const checkSyncingStatusFn = (event: StreamingEvent) => {
      if (event.key === 'syncing') {
        const status = event.value.boolean
        if (status) {
          this.disableEventsStreaming()
        } else {
          this.enableEventsStreaming()
        }
        this.emitter.emit(ProcessingMetadata, event)
      }
    }
    this.emitter.addListener(INTERNAL_PROCESSING_METADATA_EVENT, checkSyncingStatusFn)

    // Create stream readers
    this.blocksReader = new MongoChangeStreamReader(db.collection(MongoEthVM.collections.blocks), Blocks, emitter)
    this.pendingTxReader = new MongoChangeStreamReader(db.collection(MongoEthVM.collections.pendingTxs), PendingTxs, emitter)
    this.blockMetricsReader = new MongoChangeStreamReader(db.collection(MongoEthVM.collections.blocks), BlockMetrics, emitter)
    this.processingMetadataReader = new MongoChangeStreamReader(
      db.collection(MongoEthVM.collections.processingMetadata),
      INTERNAL_PROCESSING_METADATA_EVENT,
      emitter
    )

    // Start only processing metadata reader to listen for events
    await this.processingMetadataReader.start()

    // Check initial syncing state
    const syncStatus = await this.db
      .collection(MongoEthVM.collections.processingMetadata)
      .findOne({ _id: 'syncing' })
      .then(res => toProcessingMetadata(res))
    const isSyncing = syncStatus.value

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
    this.blocksReader.start()
    this.pendingTxReader.start()
    this.blockMetricsReader.start()
  }

  private async disableEventsStreaming() {
    this.blocksReader.stop()
    this.pendingTxReader.stop()
    this.blockMetricsReader.stop()
  }
}

class MongoChangeStreamReader {
  private changeStream: ChangeStream
  private cursor: Cursor<any>

  constructor(private readonly collection: Collection, private readonly eventType: string, private readonly emitter: EventEmitter) {}

  public start() {
    const changeStream = (this.changeStream = this.collection.watch([], { fullDocument: 'updateLookup' }))
    this.cursor = changeStream.stream()
    this.pull()
  }

  public async pull() {
    const { cursor, eventType, emitter } = this

    try {
      logger.info('Attempting to pull', eventType)

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
      logger.error('Failed to pull', this.eventType, e)
    }
  }

  public async stop() {
    if (this.changeStream) {
      await this.changeStream.close()
    }
  }
}
