import config from '@app/config'
import { errors } from '@app/server/core/exceptions'
import { MongoStreamer, Streamer } from '@app/server/core/streams'
import { EthVMServer } from '@app/server/ethvm-server'
import { AccountsServiceImpl, MongoAccountsRepository } from '@app/server/modules/accounts'
import { BlocksServiceImpl, MongoBlockRepository } from '@app/server/modules/blocks'
import {  ExchangeService, ExchangeServiceImpl } from '@app/server/modules/exchanges'
import { MongoPendingTxRepository, PendingTxServiceImpl } from '@app/server/modules/pending-txs'
import { SearchServiceImpl, SearchType } from '@app/server/modules/search'
import { MongoStatisticsRepository, StatisticsRepository, StatisticsService, StatisticsServiceImpl } from '@app/server/modules/statistics'
import { MongoTxsRepository, TxsService, TxsServiceImpl } from '@app/server/modules/txs'
import { MongoUncleRepository, UnclesServiceImpl } from '@app/server/modules/uncles'
import { VmService } from '@app/server/modules/vm'
import { RedisCacheRepository } from '@app/server/repositories'
import { expect } from 'chai'
 import { Events, ExchangeRate ,Quote} from 'ethvm-common'
import * as Redis from 'ioredis'
import { MongoClient } from 'mongodb'
import * as io from 'socket.io-client'
import { createCheckers } from 'ts-interface-checker'
import { mock } from 'ts-mockito'
import { MockExchangeRepository, VmServiceImpl } from './mocks'
import blockTI  from './models-test/block-ti'
import txTI  from './models-test/tx-ti'

// Typescript type checks
const { Tx }  = createCheckers(txTI);
const { Block }  = createCheckers(blockTI);


jest.setTimeout(50000)

const redisClient = new Redis({
  host: config.get('data_stores.redis.host'),
  port: config.get('data_stores.redis.port')
})
const ds = new RedisCacheRepository(redisClient, 10)

function callEvent(ev, payload, client): Promise<any> {
  return new Promise((resolve, reject) => {
    client.emit(ev, payload, (err, d) => {
      if (err) {
        reject(err)
        return
      }
      resolve(d)
    })
  })
}

describe('ethvm-server-events', () => {
  let server: EthVMServer
  let client: any

  beforeAll(async () => {
    // Mongo
    const mClient = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }).catch(() => process.exit(-1))
    const db = mClient.db('ethvm_local')

    // Blocks
    const blocksRepository = new MongoBlockRepository(db)
    const blockService = new BlocksServiceImpl(blocksRepository, ds)

    // Txs
    const txsRepository = new MongoTxsRepository(db)
    const txsService: TxsService = new TxsServiceImpl(txsRepository, ds)

    // Adress
    const addressRepository = new MongoAccountsRepository(db)
    const addressService = new AccountsServiceImpl(addressRepository, ds)

    // Uncles
    const unclesRepository = new MongoUncleRepository(db)
    const uncleService = new UnclesServiceImpl(unclesRepository, ds)

    // Charts
    const statisticsRepository = new MongoStatisticsRepository(db)

    const statisticsService = new StatisticsServiceImpl(statisticsRepository,ds)

    // Search
    const searchService = new SearchServiceImpl(txsRepository, addressRepository, blocksRepository, ds)

    // Exchange
    const exchangeRepository = new MockExchangeRepository(ds)
    const exchangeService: ExchangeService = new ExchangeServiceImpl(exchangeRepository, ds)

    // Pending Txs
    const pendingTxRepository = new MongoPendingTxRepository(db)
    const pendingTxService = new PendingTxServiceImpl(pendingTxRepository, ds)

    // Vm
    const vmService: VmService = new VmServiceImpl()

    // Streamer
    const streamer: Streamer = mock(MongoStreamer)

    // Create server
    client = io.connect(`http://${config.get('server.host')}:${config.get('server.port')}`)
    server = new EthVMServer(
      blockService,
      uncleService,
      addressService,
      txsService,
      statisticsService,
      pendingTxService,
      exchangeService,
      searchService,
      vmService,
      streamer
    )
    await server.start()
  })

  afterAll(async () => {
    await server.stop()
    client.stop()
  })

  describe('get-address-txs', () => {
    it('should return Promise<Tx[]>', async () => {
      const inputs = [
        {
          address: '0000000000000000000000000000000000000000',
          limit: 10,
          page: 0
        }
      ]
      for (const input of inputs) {
        const data = await callEvent(Events.getAddressTxs, input, client)
        data.forEach(transaction => {
          expect(Tx.test(data)).to.to.to.to.true
        });
        expect(data).to.have.lengthOf(10)
        expect(data[0].blockNumber).to.eq(97760)
      }
    })

    it('should return err ', async () => {
      const inputs = [
        '',
        '0x',
        '0x0',
        10,
        {},
        {
          address: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'
        },
        {
          address: '0xd9ea042ad059033ba3c3be79f4081244f183bf03',
          limit: '1',
          page: 1
        },
        {
          number: 1
        }
      ]

      for (const input of inputs) {
        try {
          const data = await callEvent(Events.getAddressTxs, input, client)
        } catch (e) {
          expect(e).to.be.eql(errors.BAD_REQUEST)
          expect(e).to.not.be.equal(errors.INTERNAL_SERVER_ERROR)
        }
      }
    })
  })

  describe('getBalance', () => {
    it.skip('should return Promise<string>', async () => {
      const inputs = [
        {
          address: '0000000000000000000000000000000000000000'
        }
      ]

      for (const input of inputs) {
        const data = await callEvent(Events.getBalance, input, client)
        expect(data).to.eq(10)
      }
    })

    it('should return err ', async () => {
      const inputs = [
        '',
        '0x',
        '0x0',
        10,
        {},
        {
          address: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'
        },
        {
          address: '0xd9ea042ad059033ba3c3be79f4081244f183bf03',
          limit: '1',
          page: 1
        },
        {
          number: 1
        }
      ]

      for (const input of inputs) {
        try {
          const data = await callEvent(Events.getBalance, input, client)
        } catch (e) {
          expect(e).to.be.eql(errors.BAD_REQUEST)
          expect(e).to.not.be.equal(errors.INTERNAL_SERVER_ERROR)
        }
      }
    })
  })

  describe('getBlockTransactions', () => {
    it('should return Promise<Tx[]>', async () => {
      const inputs = [
        {
          hash: '6235be352481368721cd978cee3c1e05ce31419b0e353ac7d67eb35c549b6a4e'
        }
      ]
      for (const input of inputs) {
        const data = await callEvent(Events.getBlockTransactions, input, client)
        expect(Tx.test(data)).to.to.to.to.true
        expect(data[0].blockNumber).to.be.eq(46214)
        expect(data).to.have.lengthOf(1)
      }
    })

    it('should return err ', async () => {
      const inputs = [
        '',
        '0x',
        '0x0',
        10,
        {},
        {
          address: '0x6235be352481368721cd978cee3c1e05ce31419b0e353ac7d67eb35c549b6a4e'
        },
        {
          address: '0xd9ea042ad059033ba3c3be79f4081244f183bf03',
          limit: '1',
          page: 1
        },
        {
          number: 1
        }
      ]
      for (const input of inputs) {
        try {
          const data = await callEvent(Events.getBlockTransactions, input, client)
        } catch (e) {
          expect(e).to.be.eql(errors.BAD_REQUEST)
          expect(e).to.not.be.equal(errors.INTERNAL_SERVER_ERROR)
        }
      }
    })
  })

  describe('getTx', () => {
    it('should return Promise<Tx>', async () => {
      const inputs = [
        {
          hash: 'e17d4d0c4596ea7d5166ad5da600a6fdc49e26e0680135a2f7300eedfd0d8314'
        }
      ]
      for (const input of inputs) {
        const data = await callEvent(Events.getTx, input, client)
        expect(Tx.test(data)).to.to.to.to.true
        expect(data.blockNumber).to.be.eq(46214)

        expect(data).to.not.be.empty
      }
    })

    it('should return err ', async () => {
      const inputs = [
        '',
        '0x',
        '0x0',
        10,
        {},
        {
          address: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'
        },
        {
          address: '0xd9ea042ad059033ba3c3be79f4081244f183bf03',
          limit: '1',
          page: 1
        },
        {
          number: 1
        }
      ]

      for (const input of inputs) {
        try {
          const data = await callEvent(Events.getTx, input, client)
        } catch (e) {
          expect(e).to.be.eql(errors.BAD_REQUEST)
          expect(e).to.not.be.equal(errors.INTERNAL_SERVER_ERROR)
        }
      }
    })
  })

  describe('getAccount', () => {
    it('should return Promise<Account>', async () => {
      const inputs = [
        {
          address: '0000000083178e9873ce992f73915eefa3a27ac5'
        }
      ]
      for (const input of inputs) {
        const data = await callEvent(Events.getAccount, input, client)
        expect(data.balance).to.equal(4500000000000000000)
      }
    })

    it('should return err ', async () => {
      const inputs = [
        '',
        '0x',
        '0x0',
        10,
        {},
        {
          address: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'
        },
        {
          address: '0xd9ea042ad059033ba3c3be79f4081244f183bf03',
          limit: '1',
          page: 1
        },
        {
          number: 1
        }
      ]

      for (const input of inputs) {
        try {
          const data = await callEvent(Events.getAccount, input, client)
        } catch (e) {
          expect(e).to.be.eql(errors.BAD_REQUEST)
          expect(e).to.not.be.equal(errors.INTERNAL_SERVER_ERROR)
        }
      }
    })
  })

  describe('getTotalTxs', () => {
    it('should return Promise<number>', async () => {
      const inputs = [
        {
          address: '0000000000000000000000000000000000000000'
        }
      ]

      for (const input of inputs) {
        const data = await callEvent(Events.getTotalTxs, input, client)
        expect(data).to.equal(151)

      }
    })

    it('should return err ', async () => {
      const inputs = [
        '',
        '0x',
        '0x0',
        10,
        {},
        {
          address: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'
        },
        {
          address: '0xd9ea042ad059033ba3c3be79f4081244f183bf03',
          limit: '1',
          page: 1
        },
        {
          number: 1
        }
      ]

      for (const input of inputs) {
        try {
          const data = await callEvent(Events.getTotalTxs, input, client)
        } catch (e) {
          expect(e).to.be.eql(errors.BAD_REQUEST)
          expect(e).to.not.be.equal(errors.INTERNAL_SERVER_ERROR)
        }
      }
    })
  })

  describe('pastTxs', () => {
    it('should return Promise<Tx[]>', async () => {
      const inputs = [
        {
          limit: 10,
          page: 8
        }
      ]

      for (const input of inputs) {
        const data = await callEvent(Events.pastTxs, input, client)
        // timeout happens here
        expect(data[9].blockHash).to.be.eq("2a3b88a7f4dce885a30bb8933c8e656870282d3a9846476f288078311e801875")
        expect(data).to.have.lengthOf(10)
        expect(Tx.test(data)).to.to.to.to.true
      }
    })

    it('should return err ', async () => {
      const inputs = [
        '',
        '0x',
        '0x0',
        {
          address: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'
        },
        {
          address: '0xd9ea042ad059033ba3c3be79f4081244f183bf03',
          limit: '1',
          page: 1
        },
        {
          number: 1
        }
      ]

      for (const input of inputs) {
        try {
          const data = await callEvent(Events.pastTxs, input, client)
        } catch (e) {
          expect(e).to.be.eql(errors.BAD_REQUEST)
          expect(e).to.not.be.equal(errors.INTERNAL_SERVER_ERROR)
        }
      }
    })
  })

  describe('pastBlocks', () => {
    it('should return Promise<Block[]>', async () => {
      const inputs = [
        {
          limit: 10,
          page: 0
        }
      ]

      for (const input of inputs) {
        const data = await callEvent(Events.pastBlocks, input, client)
        expect(data[0].header.parentHash).to.be.eq("fbafb4b7b6f6789338d15ff046f40dc608a42b1a33b093e109c6d7a36cd76f61")
        expect(data).to.have.lengthOf(10)
        data.forEach(block => {
          expect(Block.test(block)).to.to.to.to.true
        });
      }
    })

    it('should return err ', async () => {
      const inputs = [
        '',
        '0x',
        '0x0',
        {
          address: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'
        },
        {
          address: '0xd9ea042ad059033ba3c3be79f4081244f183bf03',
          limit: '1',
          page: 1
        },
        {
          number: 1
        }
      ]

      for (const input of inputs) {
        try {
          const data = await callEvent(Events.pastBlocks, input, client)
        } catch (e) {
          expect(e).to.be.eql(errors.BAD_REQUEST)
          expect(e).to.not.be.equal(errors.INTERNAL_SERVER_ERROR)
        }
      }
    })
  })

  describe('getBlock', () => {
    it('should return Promise<Block>', async () => {
      const inputs = [
        {
          hash: '4e3a3754410177e6937ef1f84bba68ea139e8d1a2258c5f85db9f1cd715a1bdd'
        }
      ]
      for (const input of inputs) {
        const data = await callEvent(Events.getBlock, input, client)
        expect(data.header.parentHash).to.be.eq("5a41d0e66b4120775176c09fcf39e7c0520517a13d2b57b18d33d342df038bfc")
        expect(data).to.be.not.undefined
        expect(Block.test(data)).to.to.to.to.true
      }
    })

    it('should return err ', async () => {
      const inputs = [
        '',
        '0x',
        '0x0',
        10,
        {},
        {
          address: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'
        },
        {
          address: '0xd9ea042ad059033ba3c3be79f4081244f183bf03',
          limit: '1',
          page: 1
        },
        {
          number: 1
        }
      ]
      for (const input of inputs) {
        try {
          const data = await callEvent(Events.getBlock, input, client)
        } catch (e) {
          expect(e).to.be.eql(errors.BAD_REQUEST)
          expect(e).to.not.be.equal(errors.INTERNAL_SERVER_ERROR)
        }
      }
    })
  })


  describe('getBlocksMined', () => {
    it('should return Promise<Block>', async () => {
      const inputs = [
        {
          address: '05a56e2d52c817161883f50c441c3228cfe54d9f',
          limit: 10,
          page: 0
        }
      ]
      for (const input of inputs) {
        const data = await callEvent(Events.getBlocksMined, input, client)
        expect(data[0].hash).to.be.eq("b86d9095750cddaa9d4471eda2e29fe2aa9101c2753c1a0d5bf1a91fdd020388")
        expect(data).to.be.not.empty
      }
    })

    it('should return err ', async () => {
      const inputs = [
        '',
        '0x',
        '0x0',
        10,
        {
          address: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'
        },
        {
          address: '0xd9ea042ad059033ba3c3be79f4081244f183bf03',
          limit: '1',
          page: 1
        },
        {
          number: 1
        }
      ]
      for (const input of inputs) {
        try {
          const data = await callEvent(Events.getBlocksMined, input, client)
        } catch (e) {
          expect(e).to.be.eql(errors.BAD_REQUEST)
          expect(e).to.not.be.equal(errors.INTERNAL_SERVER_ERROR)
        }
      }
    })
  })
  describe('getTokenBalance', () => {
    it.skip('should return Promise<any>', async () => {
      const inputs = [
        {
          address: '0xd9ea042ad059033ba3c3be79f4081244f183bf03'
        }
      ]

      for (const input of inputs) {
        const data = await callEvent(Events.getTokenBalance, input, client)
        expect(data).to.not.be.undefined
      }
    })

    it('should return err ', async () => {
      const inputs = [
        '',
        '0x',
        '0x0',
        10,
        {},
        {
          address: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'
        },
        {
          address: '0xd9ea042ad059033ba3c3be79f4081244f183bf03',
          limit: '1',
          page: 1
        },
        {
          number: 1
        }
      ]

      for (const input of inputs) {
        try {
          const data = await callEvent(Events.getTokenBalance, input, client)
        } catch (e) {
          expect(e).to.be.eql(errors.BAD_REQUEST)
          expect(e).to.not.be.equal(errors.INTERNAL_SERVER_ERROR)
        }
      }
    })
  })

  describe('getTicker', () => {
    it('should return Promise<Quote> of USD', async () => {
      // Fill Redis Cache with ExchangeRate
      const quote: Quote = { to: 'USD', price: '20' }
      const er: ExchangeRate = { symbol: 'ETH', quotes: [quote], total_supply: 1000 }
      await ds.putRate(er)

      const input = {
        symbol: 'ETH',
        to: 'USD'
      }

      const data = await callEvent(Events.getExchangeRates, input, client)
      expect(data).to.be.deep.equals({ to: 'USD', price: '20' })
    })

    it('should return Promise<Quote>  of EUR', async () => {
      // Fill Redis Cache with ExchangeRate
      const quote: Quote = { to: 'USD', price: '22' }
      const quote2: Quote = { to: 'EUR', price: '23' }
      const er: ExchangeRate = { symbol: 'ETH', quotes: [quote, quote2], total_supply: 1000 }
      await ds.putRate(er)

      const input = {
        symbol: 'ETH',
        to: 'USD'
      }

      const data = await callEvent(Events.getExchangeRates, input, client)
      expect(data).to.be.deep.equals({ to: 'USD', price: '22' })
    })

    it('should return Promise<Quote> of USD Data is not in cache', async () => {
      await redisClient.flushall()

      const input = {
        symbol: 'BTC',
        to: 'USD'
      }
      const data = await callEvent(Events.getExchangeRates, input, client)
      expect(data).to.be.deep.equals({ to: 'USD', price: '2000' })
    })
  })

  describe('search', () => {
    it('should return Promise<search> with search result', async () => {
      const inputs = [
        {
          hash: '4e3a3754410177e6937ef1f84bba68ea139e8d1a2258c5f85db9f1cd715a1bdd' // block
        },
        {
          hash: '5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060' // tx
        },
        {
          hash: '0000000000000000000000000000000000000000' // address
        }
      ]

      for (const input of inputs) {
        const data = await callEvent(Events.search, input, client)
        expect(data.type).to.be.not.equal(SearchType.None)
      }
    })

    it('should return Promise<search> without search result', async () => {
      const inputs = [
        {
          hash: 'a6a18fe479c8aa8009244bfad3fc2d76ba90fa2419d6564c63e97f85d04a2314' // block
        },
        {
          hash: '0008dbb2bfe21dee3bb76f3092f717fbe2560271774419eb71a4b02bd53a3a87' // tx
        },
        {
          hash: '003565e290b647163de76fd75bc50c5d6d587710' // address
        }
      ]

      for (const input of inputs) {
        const data = await callEvent(Events.search, input, client)
        expect(data.type).to.be.eq(SearchType.None)
      }
    })

    it('should return err ', async () => {
      const inputs = [
        '',
        '0x',
        '0x0',
        10,
        {},
        {
          address: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'
        },
        {
          address: '0xd9ea042ad059033ba3c3be79f4081244f183bf03',
          limit: '1',
          page: 1
        },
        {
          number: 1
        }
      ]

      for (const input of inputs) {
        try {
          const data = await callEvent(Events.search, input, client)
        } catch (e) {
          expect(e).to.be.eql(errors.BAD_REQUEST)
          expect(e).to.not.be.equal(errors.INTERNAL_SERVER_ERROR)
        }
      }
    })
  })

  describe('avg_txs_fees', () => {
    it('should return Promise<Statistics[]> with search result', async () => {
      const inputs = [
        {
          duration: 'ALL'
        }
      ]
      for (const input of inputs) {
        const data = await callEvent(Events.getAvgTotalDifficultyStats, input, client)
        expect(data).to.have.lengthOf(20)
      }
    })
  })
})
