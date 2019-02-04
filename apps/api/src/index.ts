import config from '@app/config'
import { logger } from '@app/logger'
import { NullStreamer } from '@app/server/core/streams'
import { EthVMServer } from '@app/server/ethvm-server'
import { AddressesServiceImpl, MongoAddressesRepository } from '@app/server/modules/addresses'
import { BalancesServiceImpl, MongoBalancesRepository } from '@app/server/modules/balances'
import { BlocksServiceImpl, MongoBlockRepository } from '@app/server/modules/blocks'
import { BlockMetricsServiceImpl, MongoBlockMetricsRepository } from '@app/server/modules/block-metrics'
import { ContractsServiceImpl, MongoContractsRepository } from '@app/server/modules/contracts'
import { CoinGeckoRepository, ExchangeServiceImpl } from '@app/server/modules/exchanges'
import { MongoPendingTxRepository, PendingTxServiceImpl } from '@app/server/modules/pending-txs'
import { SearchServiceImpl } from '@app/server/modules/search'
import { MongoStatisticsRepository, StatisticsServiceImpl } from '@app/server/modules/statistics'
import { MongoTokensRepository, TokensServiceImpl } from '@app/server/modules/tokens'
import { MongoTxsRepository, TxsServiceImpl } from '@app/server/modules/txs'
import { MongoUncleRepository, UnclesServiceImpl } from '@app/server/modules/uncles'
import { VmEngine } from '@app/server/modules/vm'
import { MongoClient } from 'mongodb'

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

  // Addresses
  const addressesRepository = new MongoAddressesRepository(db)
  const addressesService = new AddressesServiceImpl(addressesRepository)

  // Balances
  const balancesRepository = new MongoBalancesRepository(db)
  const balancesService = new BalancesServiceImpl(balancesRepository)

  // Blocks
  const blocksRepository = new MongoBlockRepository(db)
  const blockService = new BlocksServiceImpl(blocksRepository)

  const blockMetricsRepository = new MongoBlockMetricsRepository(db)
  const blockMetricsService = new BlockMetricsServiceImpl(blockMetricsRepository)

  // Contracts
  const contractsRepository = new MongoContractsRepository(db)
  const contracsService = new ContractsServiceImpl(contractsRepository)

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
  const exchangeRepository = new CoinGeckoRepository()
  const exchangeService = new ExchangeServiceImpl(exchangeRepository)

  // Tokens
  const tokensRepository = new MongoTokensRepository(db)
  const tokensService = new TokensServiceImpl(tokensRepository, vme)

  // Create streamer
  // ---------------
  logger.debug('bootstrapper -> Initializing streamer')
  // const streamer = new MongoStreamer(db, new EventEmitter())
  // await streamer.initialize()
  const streamer = new NullStreamer()

  // Create server
  logger.debug('bootstrapper -> Initializing server')
  const server = new EthVMServer(
    addressesService,
    blockService,
    blockMetricsService,
    contracsService,
    uncleService,
    balancesService,
    txsService,
    statisticsService,
    pendingTxService,
    exchangeService,
    searchService,
    tokensService,
    streamer
  )
  await server.start()
}

bootstrapServer()
