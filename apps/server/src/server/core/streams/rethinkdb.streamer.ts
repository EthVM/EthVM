import { logger } from '@app/logger'
import { Streamer, StreamerEvents } from '@app/server/core/streams'
import { Block } from '@app/server/modules/blocks'
import { Tx } from '@app/server/modules/txs'
import { RethinkEthVM } from '@app/server/repositories'
import EventEmitter, { ListenerFn } from 'eventemitter3'
import * as r from 'rethinkdb'

export class RethinkDbStreamer implements Streamer {
  constructor(private readonly conn: any, private readonly emitter: EventEmitter) {}

  public async initialize(): Promise<boolean> {
    try {
      logger.debug('RethinkDbStreamer - initialize() / Registering events')
      await this.registerEventListener()

      return Promise.resolve(true)
    } catch (error) {
      logger.error(`RethinkDbStreamer - initialize() / Error issued while registering events: ${error}`)
      return Promise.reject(error)
    }
  }

  public addListener(eventName: string, fn: ListenerFn) {
    this.emitter.addListener(eventName, fn)
  }

  public removeListener(eventName: string, fn?: ListenerFn) {
    this.emitter.removeListener(eventName, fn)
  }

  public onNewBlock(block: Block) {
    this.emitter.emit(StreamerEvents.newBlock, block)
  }

  public onNewTx(tx: Tx) {
    // Fill with content and logic
  }

  public onNewPendingTx(tx: Tx) {
    this.emitter.emit(StreamerEvents.pendingTx, tx)
  }

  private registerEventListener(): Promise<any[]> {
    const blocksPromise = r
      .table(RethinkEthVM.tables.blocks)
      .changes()
      .map(change => change('new_val'))
      .merge(block => {
        return {
          transactions: r
            .table(RethinkEthVM.tables.txs)
            .getAll(r.args(block('transactionHashes')))
            .coerceTo('array'),
          blockStats: {
            pendingTxs: r
              .table('data')
              .get('cached')
              .getField('pendingTxs')
          }
        }
      })
      .run(this.conn)
      .then(
        (cursor: r.CursorResult<any>): void => {
          if (!cursor) {
            return
          }

          cursor.each(
            (err: Error | null | undefined, res: Block): void => {
              if (err) {
                logger.error(`RethinkDbStreamer - onNewblock / Error: ${err}`)
                return
              }

              logger.info('RethinkDbStreamer - onNewBlock / Emitting new block!')
              this.onNewBlock(res)
            }
          )
        }
      )
      .catch(error => {
        logger.error(`RethinkDbStreamer - onNewblock / Error: ${error}`)
      })

    const txsPromise = r
      .table(RethinkEthVM.tables.txs)
      .changes()
      .filter(
        r
          .row('new_val')('pending')
          .eq(true)
      )
      .run(this.conn)
      .then(cursor => {
        if (!cursor) {
          return
        }

        cursor.each(
          (e: Error | null | undefined, cs: any): void => {
            if (e) {
              logger.error(`RethinkDbStreamer - onPendingTxs / Error: ${e}`)
              return
            }

            const tx = cs.new_val
            if (tx) {
              this.onNewPendingTx(tx)
            }
          }
        )
      })
      .catch(error => {
        logger.error(`RethinkDbStreamer - onPendingTxs / Error: ${error}`)
      })

    return Promise.all([blocksPromise, txsPromise])
  }
}
