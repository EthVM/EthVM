import { Streamer } from '@app/server/core/streams/streamer'
import { ChangeStream, ChangeStreamOptions, Collection, Cursor, Db, Long } from 'mongodb'
import EventEmitter from 'eventemitter3'

import { Block } from '@app/server/modules/blocks'
import { Tx } from '@app/server/modules/txs'
import { MongoEthVM } from '@app/server/repositories'
import Timer = NodeJS.Timer

export class MongoStreamer implements Streamer {

  private blocksReader: MongoCollectionChangeStreamReader<Block>;
  private txReader: MongoCollectionChangeStreamReader<Tx>;

  constructor(private readonly db: Db, private readonly emitter: EventEmitter) {
  }


  async initialize(): Promise<boolean> {

    const { db, emitter } = this

    this.blocksReader = new MongoCollectionChangeStreamReader(
      db.collection<Block>(MongoEthVM.collections.blocks),
      100, 'block', emitter
    );

    this.txReader = new MongoCollectionChangeStreamReader(
      db.collection<Tx>(MongoEthVM.collections.transactions),
      100, 'transaction', emitter
    );

    await this.blocksReader.start();
    await this.txReader.start();

    return true
  }

  onNewBlock(block: Block) {
  }

  onNewPendingTx(tx: Tx) {
  }

  onNewTx(tx: Tx) {
  }

  addListener(eventName: string, fn: EventEmitter.ListenerFn) {
    this.emitter.addListener(eventName, fn)
  }

  removeListener(eventName: string, fn?: EventEmitter.ListenerFn) {
    this.emitter.removeListener(eventName, fn)
  }

}

class MongoCollectionChangeStreamReader<T> {

  private changeStream: ChangeStream
  private cursor: Cursor<T>

  constructor(private readonly collection: Collection<T>,
              private readonly intervalMs: number,
              private readonly eventType: string,
              private readonly emitter: EventEmitter) {
  }

  start() {
    const changeStream = this.changeStream = this.collection
      .watch([], {
        fullDocument: 'updateLookup'
      });

    this.cursor = changeStream.stream();

    this.pull()
  }

  async pull() {

    const { cursor, eventType, emitter } = this;

    try{

      console.log('Attempting to pull', eventType);

      while (!cursor.isClosed()) {

        const next = await cursor.next();

        if (next != null) {
          console.log('New mongo event', eventType, next);
          emitter.emit(eventType, next)
        } else {
          console.log('Empty mongo event');
        }

      }

    } catch (e) {
      console.error('Failed to pull', eventType, e);
    }

  }

  async stop() {
    await this.changeStream.close();
  }

}
