import config from '@app/config'
import { RethinkDbStreamer, Streamer } from '@app/server/core/streams'
import { EthVMServer } from '@app/server/ethvm-server'
import { BlocksService, BlocksServiceImpl } from '@app/server/modules/blocks'
import { ChartService, ChartsServiceImpl } from '@app/server/modules/charts'
import { ExchangeService, MockExchangeServiceImpl } from '@app/server/modules/exchanges'
import { Tx, TxsService, TxsServiceImpl } from '@app/server/modules/txs'
import { VmService, VmServiceImpl } from '@app/server/modules/vm'
import { RedisCacheRepository } from '@app/server/repositories'
import { expect } from 'chai'
import * as io from 'socket.io-client'
import { mock, when } from 'ts-mockito'

// Increase Jest timeout for safety
jest.setTimeout(10000)

describe('ethvm-server-events', () => {
  let server: EthVMServer
  let client: any

  beforeAll(async () => {
    // Create mocks
    const blockService: BlocksService = mock(BlocksServiceImpl)
    const txsService: TxsService = mock(TxsServiceImpl)
    const chartsService: ChartService = mock(ChartsServiceImpl)
    const exchangeService: ExchangeService = new MockExchangeServiceImpl()
    const vmService: VmService = mock(VmServiceImpl)
    const streamer: Streamer = mock(RethinkDbStreamer)
    const ds = mock(RedisCacheRepository)

    // Mock methods
    when(txsService.getTxsOfAddress('', 0, 0)).thenReturn(Promise.resolve([{}]))

    // Create client
    client = io.connect(`http://${config.get('server.host')}:${config.get('server.port')}`)

    // Create server
    server = new EthVMServer(blockService, txsService, chartsService, exchangeService, vmService, streamer, ds, 1)
    await server.start()
  })

  afterAll(async () => {
    await server.stop()
    client.stop()
  })

  describe('getTxsEvent', () => {
    it('should return Promise<Tx[]>', async () => {
      const req = new Promise((resolve, reject) => {
        client.emit('getTxs', { address: '', limit: 0, page: 0 }, (err, d) => {
          if (err) {
            reject(err)
            return
          }
          resolve(d)
        })
      })

      const data = await req
      expect(data).to.not.be.undefined
    })
  })
})
