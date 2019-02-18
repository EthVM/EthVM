import * as convict from 'convict'

const config = convict({
  env: {
    default: 'development',
    format: ['production', 'development', 'test'],
    env: 'NODE_ENV'
  },

  general: {
    logs: {
      enabled: {
        default: true,
        format: Boolean,
        env: 'ETHVM_LOGS_ENABLED'
      },
      app_id: {
        default: 'api',
        format: String,
        env: 'ETHVM_APP_ID'
      },
      level: {
        default: 'debug',
        format: String,
        env: 'ETHVM_LOGS_LEVEL'
      },
      pretty: {
        default: true,
        format: Boolean,
        env: 'ETHVM_LOGS_PRETTY'
      }
    }
  },

  server: {
    host: {
      default: '0.0.0.0',
      format: String,
      env: 'ETHVM_SERVER_HOST'
    },
    port: {
      default: 3000,
      format: 'port',
      env: 'ETHVM_SERVER_PORT'
    }
  },

  data_stores: {
    mongo_db: {
      url: {
        default: 'mongodb://mongodb:27017/',
        format: String,
        env: 'ETHVM_MONGO_DB_URL'
      },
      db: {
        default: 'ethvm_local',
        format: String,
        env: 'ETHVM_MONGO_DB_NAME'
      }
    }
  },

  eth: {
    vm: {
      engine: {
        rpc_url: {
          default: 'https://api.myetherwallet.com/eth',
          format: String,
          env: 'ETHVM_ETH_VM_ENGINE_RPC_URL'
        },
        tokens_smart_contract: {
          address: {
            default: '0x2783c0A4Bfd3721961653a9e9939Fc63687bf07f',
            format: String,
            env: 'ETHVM_ETH_VM_ENGINE_TOKENS_SMART_CONTRACT_ADDRESS'
          }
        }
      }
    }
  }
})

const env = config.get('env')
const configFilePath = process.env.ETHVM_CONFIG_FILE ? process.env.ETHVM_CONFIG_FILE : `${__dirname}/${env}.config.json`

config.loadFile(configFilePath)
config.validate({ allowed: 'strict' })

export default config
