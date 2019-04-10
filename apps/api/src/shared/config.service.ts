import { Inject, Injectable } from '@nestjs/common'
import convict from 'convict'
import { join } from 'path'
import { Logger } from 'winston'

/* tslint:disable:max-line-length */
const schema = {
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'staging', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  host: {
    doc: 'The IP address to bind.',
    format: 'ipaddress',
    default: '0.0.0.0',
    env: 'IP_ADDRESS',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT',
  },
  logging: {
    level: {
      doc: 'Log level',
      env: 'LOG_LEVEL',
      default: 'info',
    },
  },
  db: {
    url: {
      doc: 'Timescale connection URL',
      env: 'TIMESCALE_URL',
      default: 'postgres://postgres:1234@timescale/ethvm_dev',
    }
  },
  graphql: {
    playground: {
      doc: 'Whether to enable to disable the graphql playground',
      env: 'GRAPHQL_PLAYGROUND',
      default: true,
    },
  },
  coinGecko: {
    url: {
      doc: 'CoinGecko API URL',
      env: 'COIN_GECKO_API_URL',
      default:
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true',
    },
  },
  ethplorer: {
    url: {
      doc: 'Ethplorer API URL',
      env: 'ETHPLORER_API_URL',
      default: 'http://api.ethplorer.io/',
    },
    apiKey: {
      doc: 'Ethplorer API key',
      env: 'ETHPLORER_API_KEY',
      default: 'freekey',
    },
  },
  vmEngine: {
    rpcUrl: {
      env: 'VM_ENGINE_RPC_URL',
      default: 'https://api.myetherwallet.com/eth',
    },
    tokensSmartContract: {
      env: 'VM_ENGINE_TOKENS_SMART_CONTRACT_ADDRESS',
      default: '0x2783c0A4Bfd3721961653a9e9939Fc63687bf07f',
    },
  },
  expressRateLimit: {
    windowMs: {
      doc: 'Express Rate Limit window(ms)',
      env: 'EXPRESS_RATE_LIMIT_WINDOW_MS',
      default: 15 * 60 * 1000,
    },
    max: {
      doc: 'Express Rate Limit max requests per window(ms)',
      env: 'EXPRESS_RATE_LIMIT_MAX',
      default: 100,
    },
  },
}

export interface GraphqlConfig {
  playground: boolean
}

export interface CoinGeckoConfig {
  url: string
}

export interface EthplorerConfig {
  url: string
  apiKey: string
}

export interface VmEngineConfig {
  rpcUrl: string
  tokensSmartContract: string
}

export interface ExpressRateLimitConfig {
  windowMs: number
  max: number
}

export interface DbConfig {
  url: string
}

@Injectable()
export class ConfigService {
  public config: convict.Config<any>

  constructor(@Inject('winston') private readonly logger: Logger) {
    const config = (this.config = convict(schema))

    config.loadFile(join(process.cwd(), `src/config/${this.env}.json`))
    config.validate({ allowed: 'strict' })

    const { env } = this

    if (env === 'development') {
      this.logger.info('Configuration: ' + config.toString())
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

  get db(): DbConfig {
    return this.config.get('db')
  }

  get coinGecko(): CoinGeckoConfig {
    return this.config.get('coinGecko')
  }

  get ethplorer(): EthplorerConfig {
    return this.config.get('ethplorer')
  }

  get vmEngine(): VmEngineConfig {
    return this.config.get('vmEngine')
  }

  get expressRateLimit(): ExpressRateLimitConfig {
    return this.config.get('expressRateLimit')
  }
}
