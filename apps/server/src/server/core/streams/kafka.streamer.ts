import Kafka from 'node-rdkafka'
import { Streamer } from '@app/server/core/streams'
import { Block } from '@app/server/modules/blocks'
import { Tx } from '@app/server/modules/txs'
import EventEmitter, { ListenerFn } from 'eventemitter3'
import { logger } from '@app/logger'

export interface KafkaStreamerOpts {
  groupId: string
  brokers: string
  blocksTopic: string
  pendingTxsTopic: string
}

export class KafkaStreamer implements Streamer {
  private blocksStream: Kafka.ConsumerStream

  constructor(private readonly opts: KafkaStreamerOpts, private readonly emitter: EventEmitter) {}

  public initialize(): Promise<boolean> {
    try {
      this.blocksStream = Kafka.createReadStream(
        {
          'group.id': this.opts.groupId,
          'metadata.broker.list': this.opts.brokers,
          'socket.keepalive.enable': true,
          'enable.auto.commit': true
        },
        {},
        {
          topics: [this.opts.blocksTopic]
        }
      )

      this.blocksStream.on('data', raw => {
        this.onNewBlock(raw)
      })

      this.blocksStream.on('error', err => {
        logger.error(`KafkaStreamer - onError: ${err}`)
      })

      return Promise.resolve(true)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  public addListener(eventName: string, fn: ListenerFn) {
    this.emitter.addListener(eventName, fn)
  }

  public removeListener(eventName: string, fn?: ListenerFn) {
    this.emitter.removeListener(eventName, fn)
  }

  public onNewBlock(block: Block) {
    logger.d(`KafkaStreamer - onNewBlock: ${block}`)
  }

  public onNewTx(tx: Tx) {
    logger.d(`KafkaStreamer - onNewTx: ${tx}`)
  }

  public onNewPendingTx(tx: Tx) {
    logger.d(`KafkaStreamer - onNewPendingTx: ${tx}`)
  }
}
