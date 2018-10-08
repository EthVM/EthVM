import { logger } from '@app/logger'
import { Streamer, StreamingEvent, StreamingEventName } from '@app/server/core/streams/streamer'
import { MongoEthVM } from '@app/server/repositories'
import EventEmitter from 'eventemitter3'
import { ChangeStream, Collection, Cursor, Db } from 'mongodb'

export class MongoStreamer implements Streamer {
  private blocksReader: MongoCollectionChangeStreamReader
  private txReader: MongoCollectionChangeStreamReader
  private pendingTxReader: MongoCollectionChangeStreamReader
  private unclesReader: MongoCollectionChangeStreamReader
  private accountsReader: MongoCollectionChangeStreamReader

  constructor(private readonly db: Db, private readonly emitter: EventEmitter) {}

  public async initialize(): Promise<boolean> {
    const intervalMs = 1000

    this.blocksReader = new MongoCollectionChangeStreamReader(this.db.collection(MongoEthVM.collections.blocks), intervalMs, 'block', this.emitter)
    this.txReader = new MongoCollectionChangeStreamReader(this.db.collection(MongoEthVM.collections.transactions), intervalMs, 'tx', this.emitter)
    this.pendingTxReader = new MongoCollectionChangeStreamReader(this.db.collection(MongoEthVM.collections.pendingTxs), intervalMs, 'pendingTx', this.emitter)
    this.unclesReader = new MongoCollectionChangeStreamReader(this.db.collection(MongoEthVM.collections.uncles), intervalMs, 'uncle', this.emitter)
    this.accountsReader = new MongoCollectionChangeStreamReader(this.db.collection(MongoEthVM.collections.accounts), intervalMs, 'account', this.emitter)

    await this.blocksReader.start()
    await this.txReader.start()
    await this.pendingTxReader.start()

    return true
  }

  public addListener(eventName: string, fn: EventEmitter.ListenerFn) {
    this.emitter.addListener(eventName, fn)
  }

  public removeListener(eventName: string, fn?: EventEmitter.ListenerFn) {
    this.emitter.removeListener(eventName, fn)
  }
}

class MongoCollectionChangeStreamReader {
  private changeStream: ChangeStream
  private cursor: Cursor<any>

  constructor(
    private readonly collection: Collection,
    private readonly intervalMs: number,
    private readonly eventType: StreamingEventName,
    private readonly emitter: EventEmitter
  ) {}

  public start() {
    const changeStream = (this.changeStream = this.collection.watch([], {
      fullDocument: 'updateLookup'
    }))

    this.cursor = changeStream.stream()
    this.pull()
  }

  public async pull() {
    try {
      logger.info('Attempting to pull', this.eventType)

      while (!this.cursor.isClosed()) {
        const next = await this.cursor.next()

        if (next != null) {
          const { operationType, fullDocument, documentKey } = next
          const event: StreamingEvent = {
            op: operationType,
            key: documentKey._id,
            value: fullDocument
          }

          this.emitter.emit(this.eventType, event)
        } else {
          logger.warn('Empty mongo event')
        }
      }
    } catch (e) {
      logger.error('Failed to pull', this.eventType, e)
    }
  }

  public async stop() {
    await this.changeStream.close()
  }
}
