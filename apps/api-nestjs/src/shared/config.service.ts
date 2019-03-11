import { Injectable } from '@nestjs/common'
import convict from 'convict'
import { join } from 'path'

const schema = {
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'staging', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  host: {
    doc: 'The IP address to bind.',
    format: 'ipaddress',
    default: '0.0.0.0',
    env: 'IP_ADDRESS'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT'
  },
  logging: {
    level: {
      doc: 'Log level',
      env: 'LOG_LEVEL',
      default: 'info'
    }
  },
  db: {
    url: {
      doc: 'Mongo url',
      env: 'MONGO_URL',
      default: 'mongodb',
      sensitive: true
    }
  },
  graphql: {
    playground: {
      doc: 'Whether to enable to disable the graphql playground',
      env: 'GRAPHQL_PLAYGROUND',
      default: true
    }
  },
  mongodb: {
    host: {
      doc: 'MongoDB host',
      env: 'MONGO_HOST',
      default: 'mongodb'
    },
    port: {
      doc: 'MongoDB port',
      env: 'MONGO_PORT',
      default: 27017
    }
  }
}

export interface GraphqlConfig {
  playground: boolean
}

export interface MongoDbConfig {
  host: string
  port: number
}

@Injectable()
export class ConfigService {
  public config: convict.Config<any>

  constructor() {
    const config = (this.config = convict(schema))

    config.loadFile(join(process.cwd(), `src/config/${this.env}.json`))
    config.validate({ allowed: 'strict' })

    const { env } = this

    if (env === 'development') {
      console.log('Configuration')
      console.log(config.toString())
    }
  }

  get env(): string {
    return this.config.get<string>('env')
  }

  get host(): string {
    return this.config.get('host')
  }

  get port(): number {
    return +this.config.get('port')
  }

  get graphql(): GraphqlConfig {
    return this.config.get('graphql')
  }

  get mongoDb(): MongoDbConfig {
    return this.config.get('mongodb')
  }
}
