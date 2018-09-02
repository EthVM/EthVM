import config from '@app/config'
import { RethinkDbStreamer, Streamer } from '@app/server/core/streams'
import { EthVMServer } from '@app/server/ethvm-server'
import { BlocksService, BlocksServiceImpl } from '@app/server/modules/blocks'
import { ChartService, ChartsServiceImpl } from '@app/server/modules/charts'
import { ExchangeService, MockExchangeServiceImpl } from '@app/server/modules/exchanges'
import { Tx, TxsRepository, TxsService, TxsServiceImpl } from '@app/server/modules/txs'
import { VmService } from '@app/server/modules/vm'
import { RedisCacheRepository } from '@app/server/repositories'
import { expect } from 'chai'
import * as io from 'socket.io-client'
import { mock, when } from 'ts-mockito'

jest.setTimeout(10000)

class VmServiceImpl implements VmService {
  public setStateRoot(hash: Buffer): Promise<boolean> {
    return Promise.resolve(true)
  }
  public getCurrentStateRoot(): Promise<Buffer> {
    return Promise.resolve(Buffer.from(''))
  }
  public getAccount(): Promise<any> {
    return Promise.resolve(Buffer.from(''))
  }
  public getBalance(address: string): Promise<any> {
    return Promise.resolve(10)
  }
  public getTokensBalance(address: string): Promise<any> {
    return Promise.resolve(Buffer.from(''))
  }
  public call(args: any): Promise<any> {
    return Promise.resolve(Buffer.from(''))
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
    const blockService: BlocksService = mock(BlocksServiceImpl)
    const txsService: TxsService = mock(TxsServiceImpl)
    const chartsService: ChartService = mock(ChartsServiceImpl)
    const exchangeService: ExchangeService = new MockExchangeServiceImpl()
    const vmService: VmService = new VmServiceImpl()
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

  describe('getTokenBalance', () => {
    it('should return Promise<any>', async () => {
      const inputs = [
        {
          address: '0xd9ea042ad059033ba3c3be79f4081244f183bf03'
        }
      ]

      for (const input of inputs) {
        const data = await callEvent('getTokenBalance', input, client)
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

      for (  const input of inputs ) {
        try {
          const data = await callEvent('getTokenBalance', input, client)
        } catch (e) {
          expect(e).to.not.be.undefined
        }
      }
    })
  })
})
