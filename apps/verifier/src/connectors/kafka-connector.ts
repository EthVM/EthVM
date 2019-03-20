import { Config, KafkaConfig } from '@app/config'
import AvroSchemaRegistry from 'avro-schema-registry'
import { ConsumerStream, ConsumerStreamMessage, createReadStream } from 'node-rdkafka'
import { Observable } from 'rxjs'
import { streamToRx } from 'rxjs-stream'
import { flatMap, map } from 'rxjs/operators'
import { EtherBalance } from '@app/models/ether-balance'
import { EtherBalanceKey } from '@app/models/ether-balance-key'
import { Pair } from '@app/models/pair'

export class KafkaConnector {
  private readonly config: KafkaConfig
  private readonly registry: any

  constructor(config: Config) {
    this.config = config.kafka
    this.registry = AvroSchemaRegistry(config.kafka.schemaRegistryUrl)
  }

  consume(topic: string, groupId: string = 'ethvm-verifier'): Observable<Pair<any, any>> {
    const { registry, config } = this
    const { bootstrapServers } = config

    const stream: ConsumerStream = createReadStream(
      {
        'metadata.broker.list': bootstrapServers,
        'group.id': groupId,
        'socket.keepalive.enable': true,
        'enable.auto.commit': false
      },
      {
        'auto.offset.reset': 'earliest',
        'request.required.acks': 1
      },
      {
        topics: topic
      }
    )


    return streamToRx(stream).pipe(
      map(value => value as any),
      map(value => value as ConsumerStreamMessage),
      flatMap(msg => {
        const key = registry.decode(msg.key);
        const value = registry.decode(msg.value);
        return Promise.all([key, value])
          .then(values => new Pair(values[0], values[1]))
      }),
    )
  }

  etherBalances$(): Observable<Pair<EtherBalanceKey, EtherBalance>> {
    return this.consume('ether-balances')
      .pipe(
        map( pair => new Pair(new EtherBalanceKey(pair.first), new EtherBalance(pair.second)))
      );
  }

}
