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
        default: 'true',
        format: String,
        env: 'ETHVM_LOGS_ENABLED'
      },
      app_id: {
        default: 'ethvm-socket',
        format: String,
        env: 'ETHVM_APP_ID'
      },
      level: {
        default: 'debug',
        format: String,
        env: 'ETHVM_LOG_LEVEL'
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

  rethink_db: {
    db_name: {
      default: 'eth_mainnet',
      format: String,
      env: 'ETHVM_RETHINK_DB_NAME'
    },
    host: {
      default: 'localhost',
      format: String,
      env: 'ETHVM_RETHINK_DB_HOST'
    },
    port: {
      default: 28015,
      format: 'port',
      env: 'ETHVM_RETHINK_DB_PORT'
    },
    user: {
      default: 'admin',
      format: String,
      env: 'ETHVM_RETHINK_DB_USER'
    },
    password: {
      default: '',
      format: String,
      env: 'ETHVM_RETHINK_DB_PASSWORD',
      sensitive: true
    },
    cert_raw: {
      default: '',
      format: String,
      env: 'ETHVM_RETHINK_DB_CERT_RAW',
      sensitive: true
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
    block_time: {
      default: '14 seconds',
      format: 'duration',
      env: 'ETHVM_ETH_BLOCK_TIME'
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
    },
    trie_db: {
      redis: {
        host: {
          default: 'localhost',
          format: String,
          env: 'ETHVM_ETH_TRIE_DB_REDIS_HOST'
        },
        port: {
          default: 6379,
          format: 'port',
          env: 'ETHVM_ETH_TRIE_DB_REDIS_PORT'
        },
        db: {
          default: 1,
          format: Number,
          env: 'ETHVM_ETH_TRIE_DB_REDIS_DB'
        }
      }
    }
  },

  streamer: {
    kafka: {
      group_id: {
        default: 'server-consumer',
        format: String,
        env: 'ETHVM_STREAMER_KAFKA_GROUP_ID'
      },
      brokers: {
        default: 'kafka:9092',
        format: String,
        env: 'ETHVM_STREAMER_KAFKA_BROKERS'
      },
      topics: {
        blocks: {
          default: 'raw-blocks',
          format: String,
          env: 'ETHVM_STREAMER_KAFKA_TOPICS_BLOCKS'
        },
        pending_txs: {
          default: 'raw-pending-txs',
          format: String,
          env: 'ETHVM_STREAMER_KAFKA_TOPICS_PENDING_TXS'
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
