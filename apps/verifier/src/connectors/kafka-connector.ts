import { ConsumerStream, ConsumerStreamMessage, createReadStream } from 'node-rdkafka'
import { Config, KafkaConfig } from '@app/config'
import { Observable } from 'rxjs'
import { streamToRx } from 'rxjs-stream'
import AvroSchemaRegistry from 'avro-schema-registry'
import { flatMap, map } from 'rxjs/operators'
import { BlockRecord } from '@app/models/block-record'

export class KafkaConnector {

  private readonly config: KafkaConfig;
  private readonly registry: any;

  constructor(config: Config) {
    this.config = config.kafka;
    this.registry = AvroSchemaRegistry(config.kafka.schemaRegistryUrl);
  }

  consume(topic: string, groupId: string = 'ethvm-verifier-2'): Observable<BlockRecord> {

    const { registry, config } = this;
    const { bootstrapServers } = config;

    const stream: ConsumerStream = createReadStream({
      'metadata.broker.list': bootstrapServers,
      'group.id': groupId,
      'socket.keepalive.enable': true,
      'enable.auto.commit': false,
    }, {
      'auto.offset.reset': 'earliest',
      'request.required.acks': 1
    },{
      'topics': topic
    })

    return streamToRx(stream)
      .pipe(
        map(value => value as any),
        map(value => value as ConsumerStreamMessage),
        flatMap(msg => registry.decode(msg.value)),
        map(value => new BlockRecord(value))
      )
  }

  blocks$(): Observable<BlockRecord> {
    return this.consume("blocks");
  }

}
