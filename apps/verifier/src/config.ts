import convict from 'convict'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { EtherBalanceView } from './db/entities/ether-balance.view'
import { Erc20BalanceView } from '@app/db/entities/erc20-balance.view'

const schema = {
  kafka: {
    bootstrapServers: {
      doc: 'List of kafka servers',
      default: 'kafka-1:9091',
      env: 'KAFKA_BOOTSTRAP_SERVERS'
    },
    schemaRegistryUrl: {
      doc: 'Schema registry url',
      default: 'http://kafka-schema-registry:8081',
      env: 'KAFKA_REGISTRY_URL'
    }
  },
  postgres: {
    host: {
      doc: 'Host to connect to',
      default: 'timescale',
      env: 'POSTGRES_HOST'
    },
    port: {
      doc: 'Port to connect to',
      format: 'port',
      default: 5432,
      env: 'POSTGRES_PORT'
    },
    username: {
      doc: 'Username to connect with',
      default: 'postgres',
      env: 'POSTGRES_USER'
    },
    password: {
      doc: 'Password to connect with',
      default: '1234',
      sensitive: true,
      env: 'POSTGRES_PASSWORD'
    },
    database: {
      doc: 'Database to connect to',
      default: 'ethvm_dev',
      env: 'POSTGRES_DATABASE'
    }
  },
  web3: {
    wsUrl: {
      doc: 'Websocket url',
      default: 'ws://localhost:8546',
      env: 'WEB3_WS_URL'
    }
  }
}

export interface KafkaConfig {
  bootstrapServers: string
  schemaRegistryUrl: string
}

export interface Web3Config {
  wsUrl: string
}

export class Config {
  private config: convict.Config<any>

  constructor() {
    this.config = convict(schema)
  }

  public load(overrides: any) {
    const { config } = this
    config.load(overrides)
    config.validate({ allowed: 'strict' })
  }

  get kafka(): KafkaConfig {
    return this.config.get('kafka')
  }

  get postgres(): PostgresConnectionOptions {
    const postgres = this.config.get('postgres') as PostgresConnectionOptions
    return {
      ...postgres,
      type: 'postgres',
      entities: [EtherBalanceView, Erc20BalanceView],
      synchronize: false
    }
  }

  get web3(): Web3Config {
    return this.config.get('web3')
  }
}
