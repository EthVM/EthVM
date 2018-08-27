import Kafka from 'node-rdkafka'
import { Streamer } from '@app/server/core/streams'
import { Block } from '@app/server/modules/blocks'
import { Tx } from '@app/server/modules/txs'
import EventEmitter, { ListenerFn } from 'eventemitter3'
import { logger } from '@app/logger'

export interface KafkaStreamerOpts {
  groupId: string
  brokers: string
}

export class KafkaStreamer implements Streamer {
  private readonly consumer: Kafka.KafkaConsumer

  constructor(private readonly emitter: EventEmitter, private readonly opts: KafkaStreamerOpts) {
    this.consumer = new Kafka.KafkaConsumer(
      {
        'group.id': this.opts.groupId,
        'metadata.broker.list': this.opts.brokers
      },
      {}
    )
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
    logger.d(`KafkaStreamer - onTx: ${tx}`)
  }

  public onNewPendingTx(tx: Tx) {
    logger.d(`KafkaStreamer - onNewPendingTx: ${tx}`)
  }
}
