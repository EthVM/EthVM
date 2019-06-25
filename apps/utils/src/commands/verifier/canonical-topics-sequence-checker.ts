import { Config } from '@app/config'
import * as Kafka from 'node-rdkafka'
import { ConsumerStreamMessage } from 'node-rdkafka'
import { Observable } from 'rxjs'
import { streamToRx } from 'rxjs-stream'
import BigNumber from 'bignumber.js'
import ora from 'ora'

class GapTracker {

  public offset

  public missing = new Set<number>()

  constructor(start: number = -1) {
    this.offset = start
  }

  public next(key: number) {

    const { offset: currentOffset, missing } = this

    if (key < currentOffset) {
      console.log('Earlier offset received', key)
      this.offset = key
    } else if (key === currentOffset) {
      // remove from missing if it is there, this could be a publish after a tombstone during re-org
      missing.delete(key)
    } else if (key === currentOffset + 1) {
      this.offset = key
      missing.delete(key)
    } else if(key > currentOffset + 1){

      for (let i = currentOffset; i < key; i++) {
        missing.add(i)
      }

      this.offset = key
    }

  }

  public tombstone(key: number) {
    this.missing.add(key)
  }

}

export async function CanonicalTopicsSequenceChecker(config: Config) {

  const spinner = ora('Checking topics').start()

  const { kafka: kafkaConfig } = config

  const registry = require('avro-schema-registry')(kafkaConfig.schemaRegistryUrl)

  const topics = [
    'canonical_block_header',
    'canonical_transactions',
    'canonical_receipts',
    'canonical_traces',
    'canonical_uncles'
  ];

  const messages$ = new Observable(observer => {

    const stream = Kafka.createReadStream({
      'metadata.broker.list': kafkaConfig.bootstrapServers,
      'group.id': 'canonical-topics-sequence-checker',
      'enable.auto.commit': false
    }, { 'auto.offset.reset': 'earliest' }, {
      topics,
      waitInterval: 0,
      objectMode: true

    })

    const stream$ = streamToRx(stream)

    stream$
      .subscribe(event => observer.next(event), error => observer.error(error))

    return () => {
      // teardown logic
      stream.close()
    }

  })

  const trackerByTopic = new Map<string, GapTracker>()
  topics.forEach(topic => trackerByTopic.set(topic, new GapTracker()))

  const sequenceVerifier = new GapTracker()

  const subscription = messages$
    .subscribe(async msg => {

      const consumerMsg = msg as ConsumerStreamMessage

      const topic = consumerMsg.topic
      const key = await registry.decode(consumerMsg.key)
      const value = await registry.decode(consumerMsg.value)

      const blockNumber = new BigNumber(key.number.toString('hex'), 16)

      const tracker = trackerByTopic.get(topic)

      if (value) {
        tracker.next(blockNumber.toNumber())
      } else {
        tracker.tombstone(blockNumber.toNumber())
      }

      const message = topics
        .map(topic => {
          const tracker = trackerByTopic.get(topic)
          return `${topic}@${tracker.offset}`
        })
        .join(', ')


      spinner.text = `Checking topics: ${message}`

    })

  subscription.add(() => {

    const { missing } = sequenceVerifier
    if(missing.size) {
      spinner.fail(`${missing.size} missing keys`)
      missing.forEach(key => spinner.fail(`${key}`))
    } else {
      spinner.succeed('No gaps found')
    }
  })

  process.on('SIGINT', () => {
    subscription.unsubscribe()
  })
}
