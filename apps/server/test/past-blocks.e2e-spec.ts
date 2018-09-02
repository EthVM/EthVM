import config from '@app/config'
import { RethinkDbStreamer, Streamer } from '@app/server/core/streams'
import { EthVMServer } from '@app/server/ethvm-server'
import { Block, BlocksService } from '@app/server/modules/blocks'
import { ChartService, ChartsServiceImpl } from '@app/server/modules/charts'
import { ExchangeService, MockExchangeServiceImpl } from '@app/server/modules/exchanges'
import { Tx, TxsRepository, TxsService, TxsServiceImpl } from '@app/server/modules/txs'
import { VmService, VmServiceImpl } from '@app/server/modules/vm'
import { RedisCacheRepository } from '@app/server/repositories'
import { expect } from 'chai'
import * as io from 'socket.io-client'
import { mock, when } from 'ts-mockito'

jest.setTimeout(10000)

class BlocksServiceImpl implements BlocksService {
  public getBlocks(limit: number, page: number): Promise<Block[]> {
    return Promise.resolve([block1, block2])
  }

  public getBlock(hash: string): Promise<Block | null> {
    return Promise.resolve(block1)
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
    const blockService: BlocksService = new BlocksServiceImpl()
    const txsService: TxsService = mock(TxsServiceImpl)
    const chartsService: ChartService = mock(ChartsServiceImpl)
    const exchangeService: ExchangeService = new MockExchangeServiceImpl()
    const vmService: VmService = mock(VmServiceImpl)
    const streamer: Streamer = mock(RethinkDbStreamer)
    const ds = mock(RedisCacheRepository)

    client = io.connect(`http://${config.get('server.host')}:${config.get('server.port')}`)

    server = new EthVMServer(blockService, txsService, chartsService, exchangeService, vmService, streamer, ds, 1)
    await server.start()
  })

  afterAll(async () => {
    await server.stop()
    client.stop()
  })

  describe('getBlock', () => {
    it('should return Promise<Block>', async () => {
      const inputs = [
        {
          hash: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238',
          limit: 1,
          page: 1
        }
      ]

      for (const input of inputs) {
        const data = await callEvent('getBlock', input, client)
        expect(data).to.be.not.undefined
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
          const data = await callEvent('getBlock', input, client)
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

const blockStat = {
  blockTime: '',
  failed: '',
  success: '',
  avgGasPrice: '',
  avgTxFees: '',
  pendingTxs: 8
}

const block1 = {
  number: 2,
  hash: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238',
  parentHash: Buffer.from('0xb903239f8543d04b5dc1ba6519132b143087c68db1b2168786408fcbce568238'),
  miner: Buffer.from('0xd9ea042ad059033ba3c3be79f4081244f183bf03'),
  timestamp: Buffer.from(''),
  transactions: [tx1, tx2],
  transactionHashes: [
    '0xff7ac9e368c483f73d34595780cdee65e8d44c40c26ff8bd3ce53c48035a863e',
    '0xff7ac9e368c483f73d34595780cdee65e8d44c40c26ff8bd3ce53c48035a863e'
  ],
  transactionCount: 2,
  isUncle: false,
  blockStats: blockStat
}

const block2 = {
  number: 2,
  hash: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238',
  parentHash: Buffer.from('0xb903239f8543d04b5dc1ba6519132b143087c68db1b2168786408fcbce568238'),
  miner: Buffer.from('0xd9ea042ad059033ba3c3be79f4081244f183bf03'),
  timestamp: Buffer.from(''),
  transactions: [tx1, tx2],
  transactionHashes: [
    '0xff7ac9e368c483f73d34595780cdee65e8d44c40c26ff8bd3ce53c48035a863e',
    '0xff7ac9e368c483f73d34595780cdee65e8d44c40c26ff8bd3ce53c48035a863e'
  ],
  transactionCount: 2,
  isUncle: false,
  blockStats: blockStat
}
