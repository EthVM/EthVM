import config from '@app/config'
import { RethinkDbStreamer, Streamer } from '@app/server/core/streams'
import { EthVMServer } from '@app/server/ethvm-server'
import { BlocksService, BlocksServiceImpl } from '@app/server/modules/blocks'
import { ChartService, ChartsServiceImpl } from '@app/server/modules/charts'
import { ExchangeService, MockExchangeServiceImpl } from '@app/server/modules/exchanges'
import { Tx, TxsRepository, TxsService, TxsServiceImpl } from '@app/server/modules/txs'
import { VmService, VmServiceImpl } from '@app/server/modules/vm'
import { RedisCacheRepository } from '@app/server/repositories'
import { expect } from 'chai'
import * as io from 'socket.io-client'
import { mock, when } from 'ts-mockito'

// Increase Jest timeout for safety
jest.setTimeout(15000)

class RethinkTxsTestRepository implements TxsRepository {
  public getTxs(limit: number, page: number): Promise<Tx[]> {
    return Promise.resolve([tx1, tx2])
  }

  public getBlockTxs(hash: string): Promise<Tx[]> {
    return Promise.resolve([tx1])
  }

  public getTx(hash: string): Promise<Tx | null> {
    return Promise.resolve(tx1)
  }

  public getTxsOfAddress(hash: string, limit: number, page: number): Promise<Tx[]> {
    return Promise.resolve([tx1, tx2])
  }

  public getTotalTxs(hash: string): Promise<number> {
    return Promise.resolve(9)
  }
}

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
    // Create mocks
    const blockService: BlocksService = mock(BlocksServiceImpl)
    // const txsService: TxsService = mock(TxsServiceImpl)
    const chartsService: ChartService = mock(ChartsServiceImpl)
    const exchangeService: ExchangeService = new MockExchangeServiceImpl()
    const vmService: VmService = mock(VmServiceImpl)
    const streamer: Streamer = mock(RethinkDbStreamer)
    const ds = mock(RedisCacheRepository)

    const txsRepository: RethinkTxsTestRepository = new RethinkTxsTestRepository()
    const txsService: TxsService = new TxsServiceImpl(txsRepository, ds)

    client = io.connect(`http://${config.get('server.host')}:${config.get('server.port')}`)

    // Create server
    server = new EthVMServer(blockService, txsService, chartsService, exchangeService, vmService, streamer, ds, 1)
    await server.start()
  })

  afterAll(async () => {
    await server.stop()
    client.stop()
  })

  describe('pastTxs', () => {
    it('should return Promise<Tx[]>', async () => {
      const inputs = [
        {
          limit: 1,
          page: 1
        }
      ]

      for (const input of inputs) {
        const data = await callEvent('pastTxs', input, client)
        expect(data).to.have.lengthOf(2)
      }
    })

    it('should return err ', async () => {
      const inputs = [
        '',
        '0x',
        '0x0',
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

      for (const  input of  inputs) {
        try {
          const data = await callEvent('pastTxs', input, client)
        } catch (e) {
          expect(e).to.not.be.undefined
        }
      }
    })
  })
})

const tx1: Tx = {
  blockHash: Buffer.from(''),
  blockNumber: 2,
  contractAddress: null,
  cumulativeGasUsed: Buffer.from(''),
  from: Buffer.from(''),
  fromBalance: Buffer.from('78'),
  gas: Buffer.from('78'),
  gasPrice: Buffer.from('7'),
  gasUsed: Buffer.from('9'),
  hash: '0xff7ac9e368c483f73d34595780cdee65e8d44c40c26ff8bd3ce53c48035a863e',
  input: Buffer.from(''),
  logsBloom: null,
  nonce: Buffer.from(''),
  pending: true,
  r: Buffer.from(''),
  to: Buffer.from(''),
  toBalance: Buffer.from(''),
  transactionIndex: Buffer.from(''),
  v: Buffer.from(''),
  value: Buffer.from(''),
  status: true,
  timestamp: Buffer.from('')
}

const tx2: Tx = {
  blockHash: Buffer.from('0x983e535f45911199e74bec284b258b643392855eeb27e812aae902d149061dd7'),
  blockNumber: 3,
  contractAddress: null,
  cumulativeGasUsed: Buffer.from(''),
  from: Buffer.from(''),
  fromBalance: Buffer.from(''),
  gas: Buffer.from(''),
  gasPrice: Buffer.from(''),
  gasUsed: Buffer.from(''),
  hash: '0xff7ac9e368c483f73d34595780cdee65e8d44c40c26ff8bd3ce53c48035a863e',
  input: Buffer.from(''),
  logsBloom: null,
  nonce: Buffer.from(''),
  pending: true,
  r: Buffer.from(''),
  to: Buffer.from(''),
  toBalance: Buffer.from(''),
  transactionIndex: Buffer.from(''),
  v: Buffer.from(''),
  value: Buffer.from(''),
  status: true,
  timestamp: Buffer.from('')
}
