import * as convict from 'convict'

const config = convict({
  env: {
    default: 'dev',
    format: ['production', 'dev', 'test'],
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
    },

    redis: {
      host: {
        default: 'localhost',
        format: String,
        env: 'ETHVM_DATA_STORE_REDIS_HOST'
      },
      port: {
        default: 6379,
        format: 'port',
        env: 'ETHVM_DATA_STORE_REDIS_PORT'
      },
      db: {
        default: 0,
        format: Number,
        env: 'ETHVM_DATA_STORE_REDIS_DB'
      },
      socket_rows: {
        default: 64,
        format: 'int',
        env: 'ETHVM_DATA_STORE_REDIS_SOCKET_ROWS'
      }
    }
  },

  eth: {
    rpc: {
      host: {
        default: 'localhost',
        format: String,
        env: 'ETHVM_ETH_RPC_HOST'
      },
      port: {
        default: 8545,
        format: 'port',
        env: 'ETHVM_RPC_ETH_PORT'
      }
    },
    state_root: {
      default: 'd7f8974fb5ac78d9ac099b9ad5018bedc2ce0a72dad1827a1709da30580f0544',
      format: String,
      env: 'ETHVM_ETH_STATE_ROOT'
    },
    vm: {
      engine: {
        rpc_url: {
          default: 'https://api.myetherwallet.com/eth',
          format: String,
          env: 'ETHVM_ETH_VM_ENGINE_RPC_URL'
        },
        tokens_smart_contract: {
          address: {
            default: '0xbe1ecf8e340f13071761e0eef054d9a511e1cb56',
            format: String,
            env: 'ETHVM_ETH_VM_ENGINE_TOKENS_SMART_CONTRACT_ADDRESS'
          }
        },
        account: {
          default: '0x2a65aca4d5fc5b5c859090a6c34d164135398226',
          format: String,
          env: 'ETHVM_ETH_VM_ENGINE_ACCOUNT_ADDRESS'
        },
        gas_limit: {
          default: '0x4c4b40', // 50000000
          format: String,
          env: 'ETHVM_ETH_VM_ENGINE_GAS_LIMIT'
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
