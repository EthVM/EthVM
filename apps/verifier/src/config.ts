import convict from 'convict';

const schema = {

  kafka: {
    bootstrapServers: {
      doc: 'List of kafka servers',
      default: 'kafka-1:9091',
      env: "KAFKA_BOOTSTRAP_SERVERS"
    },
    schemaRegistryUrl: {
      doc: 'Schema registry url',
      default: 'http://kafka-schema-registry:8081',
      env: 'KAFKA_REGISTRY_URL'
    }
  },

  mongo: {
    url: {
      doc: 'Mongo connection uri',
      default: 'mongodb://mongodb:27017/ethvm_local?w=1&journal=true&maxIdleTimeMS=60000',
      env: 'MONGO_URI'
    }
  }

}

export interface KafkaConfig {

  bootstrapServers: string;
  schemaRegistryUrl: string;

}

export interface MongoConfig {
  url: string;
}

export class Config {

  private config: convict.Config<any>;

  constructor() {
    this.config = convict(schema);
  }

  load(overrides: any) {
    const { config } = this;
    config.load(overrides);
    config.validate({ allowed: 'strict' });
  }

  get kafka(): KafkaConfig {
    return this.config.get('kafka');
  }

  get mongo(): MongoConfig {
    return this.config.get('mongo')
  }

}
