import config from '@app/config'
import { logger } from '@app/logger'
import { NullStreamer } from '@app/server/core/streams'
import { EthVMServer } from '@app/server/ethvm-server'
import { BalancesServiceImpl, MongoBalancesRepository } from '@app/server/modules/balances'
import { BlocksServiceImpl, MongoBlockRepository } from '@app/server/modules/blocks'
import { CoinMarketCapRepository, ExchangeServiceImpl } from '@app/server/modules/exchanges'
import { MongoPendingTxRepository, PendingTxServiceImpl } from '@app/server/modules/pending-txs'
import { SearchServiceImpl } from '@app/server/modules/search'
import { MongoStatisticsRepository, StatisticsServiceImpl } from '@app/server/modules/statistics'
import { MongoTxsRepository, TxsServiceImpl } from '@app/server/modules/txs'
import { MongoUncleRepository, UnclesServiceImpl } from '@app/server/modules/uncles'
import { VmEngine, VmServiceImpl } from '@app/server/modules/vm'
import { RedisCacheRepository } from '@app/server/repositories'
import * as Redis from 'ioredis'
import { MongoClient } from 'mongodb'
import { MongoTokensRepository, TokensServiceImpl } from './server/modules/tokens'

async function bootstrapServer() {
  logger.debug('bootstrapper -> Bootstraping ethvm-socket-server!')

  // Create VmEngine
  logger.debug('bootstrapper -> Initializing VmEngine')
  const vmeOpts = {
    rpcUrl: config.get('eth.vm.engine.rpc_url'),
    tokensAddress: config.get('eth.vm.engine.tokens_smart_contract'),
    account: config.get('eth.vm.engine.account')
  }
  const vme = new VmEngine(vmeOpts)

  // Create Cache data store
  logger.info('bootstrapper -> Initializing redis cache data store')
  const redis = new Redis({
    host: config.get('data_stores.redis.host'),
    port: config.get('data_stores.redis.port')
  })
  const socketRows = config.get('data_stores.redis.socket_rows')
  const ds = new RedisCacheRepository(redis, socketRows)
  await ds.initialize().catch(() => process.exit(-1))

  // Create Blockchain data store
  logger.debug('bootstrapper -> Connecting MongoDB')
  const mongoUrl = config.get('data_stores.mongo_db.url')
  const client = await MongoClient.connect(
    mongoUrl,
    { useNewUrlParser: true }
  ).catch(() => process.exit(-1))

  logger.debug('bootstrapper -> Selecting MongoDB database')
  const dbName = config.get('data_stores.mongo_db.db')
  const db = client.db(dbName)

  // Create services
  // ---------------

  // Balances
  const balancesRepository = new MongoBalancesRepository(db)
  const balancesService = new BalancesServiceImpl(balancesRepository, vme)

  // Blocks
  const blocksRepository = new MongoBlockRepository(db)
  const blockService = new BlocksServiceImpl(blocksRepository)

  // Uncles
  const unclesRepository = new MongoUncleRepository(db)
  const uncleService = new UnclesServiceImpl(unclesRepository)

  // Pending Txs
  const pendingTxRepository = new MongoPendingTxRepository(db)
  const pendingTxService = new PendingTxServiceImpl(pendingTxRepository)

  // Txs
  const txsRepository = new MongoTxsRepository(db)
  const txsService = new TxsServiceImpl(txsRepository)

  // Search
  const searchService = new SearchServiceImpl(txsRepository, balancesRepository, blocksRepository)

  // Charts
  const statisticsRepository = new MongoStatisticsRepository(db)
  const statisticsService = new StatisticsServiceImpl(statisticsRepository)

  // Exchanges
  const exchangeRepository = new CoinMarketCapRepository(ds)
  const exchangeService = new ExchangeServiceImpl(exchangeRepository, ds)

  // Tokens
  const tokensRepository = new MongoTokensRepository(db)
  const tokensService = new TokensServiceImpl(tokensRepository)

  // Vm
  const vmService = new VmServiceImpl(vme)

  // Create streamer
  // ---------------
  // TODO: Restore proper MongoStreamer when we have intelligent notification of events in Kafka
  // logger.debug('bootstrapper -> Initializing streamer')
  // const streamer = new MongoStreamer(db, emitter)
  // await streamer.initialize()
  const streamer = new NullStreamer()

  // Create server
  logger.debug('bootstrapper -> Initializing server')
  const server = new EthVMServer(
    blockService,
    uncleService,
    balancesService,
    txsService,
    statisticsService,
    pendingTxService,
    exchangeService,
    searchService,
    tokensService,
    vmService,
    streamer
  )
  await server.start()
}

bootstrapServer()
