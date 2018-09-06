import config from '@app/config'
import { RethinkDbStreamer, Streamer } from '@app/server/core/streams'
import { EthVMServer } from '@app/server/ethvm-server'
import { Block, BlocksService,BlocksServiceImpl, RethinkBlockRepository } from '@app/server/modules/blocks'
import { ChartService, ChartsServiceImpl } from '@app/server/modules/charts'
import { ExchangeService, MockExchangeServiceImpl } from '@app/server/modules/exchanges'
import { RethinkTxsRepository, Tx, TxsRepository, TxsService, TxsServiceImpl } from '@app/server/modules/txs'
import { VmService,VmServiceImpl } from '@app/server/modules/vm'
import { RedisCacheRepository } from '@app/server/repositories'
import { expect } from 'chai'
import * as r from 'rethinkdb'
import * as io from 'socket.io-client'
import { mock, when } from 'ts-mockito'


// Increase Jest timeout for safety
jest.setTimeout(50000)

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
    // Create mocks
    const ds = mock(RedisCacheRepository)

    const rethinkOpts = {
      host: config.get('rethink_db.host'),
      port: config.get('rethink_db.port'),
      db: config.get('rethink_db.db_name'),
      user: config.get('rethink_db.user'),
      password: config.get('rethink_db.password'),
      ssl: {
        cert: config.get('rethink_db.cert_raw')
      }
    }

    if (!rethinkOpts.ssl.cert) {
      delete rethinkOpts.ssl
    }
    const rConn = await r.connect(rethinkOpts)

    const blocksRepository = new RethinkBlockRepository(rConn, rethinkOpts)
    const blockService = new BlocksServiceImpl(blocksRepository, ds)

    const txsRepository = new RethinkTxsRepository(rConn, rethinkOpts)
    const txsService:TxsService = new TxsServiceImpl(txsRepository, ds)

    const chartsService: ChartService = mock(ChartsServiceImpl)
    const exchangeService: ExchangeService = new MockExchangeServiceImpl()
    const vmService: VmService = new VmServiceImpl()
    const streamer: Streamer = mock(RethinkDbStreamer)


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
      const inputs = [
        {
          address: '0x8b2a6d0b4183b5db91bb901eefdd0d0ba06ef125',
          limit: 10,
          page: 0
        }
      ]

      for (const input of inputs) {
        const data = await callEvent('getTxs', input, client)
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
          const data = await callEvent('getTxs', input, client)
        } catch (e) {
          expect(e).to.not.be.undefined
        }
      }
    })
  })

  describe('getBalance', () => {
    it('should return Promise<string>', async () => {
      const inputs = [
        {
          address: '0xd9ea042ad059033ba3c3be79f4081244f183bf03'
        }
      ]

      for (const input of inputs) {
        const data = await callEvent('getBalance', input, client)
        expect(data).to.equal(10)
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
          const data = await callEvent('getBalance', input, client)
        } catch (e) {
          expect(e).to.not.be.undefined
        }
      }
    })
  })

  // describe('getBlockTransactions', () => {
  //   it('should return Promise<Tx[]>', async () => {
  //     const inputs = [
  //       {
  //         hash: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238',
  //         limit: 1,
  //         page: 1
  //       }
  //     ]
  //     for (const input of inputs) {
  //       const data = await callEvent('getBlockTransactions', input, client)
  //       expect(data).to.have.lengthOf(2)
  //     }
  //   })
  //   it('should return err ', async () => {
  //     const inputs = [
  //       '',
  //       '0x',
  //       '0x0',
  //       10,
  //       {},
  //       {
  //         address: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'
  //       },
  //       {
  //         address: '0xd9ea042ad059033ba3c3be79f4081244f183bf03',
  //         limit: '1',
  //         page: 1
  //       },
  //       {
  //         number: 1
  //       }
  //     ]
  //     for (const input of inputs) {
  //       try {
  //         const data = await callEvent('getBlockTransactions', input, client)
  //       } catch (e) {
  //         expect(e).to.not.be.undefined
  //       }
  //     }
  //   })
  // })


  // need trace and log table
  describe.skip('getTx Event', () => {
    it('should return Promise<Tx>', async () => {
      const inputs = [
        {
          hash: '0xff7ac9e368c483f73d34595780cdee65e8d44c40c26ff8bd3ce53c48035a863e'
        }
      ]

      for (const input of inputs) {
        const data = await callEvent('getTx', input, client)
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

      for (const  input of  inputs) {
        try {
          const data = await callEvent('getTx', input, client)
        } catch (e) {
          expect(e).to.not.be.undefined
        }
      }
    })
  })


  describe('getTotalTxs Event', () => {
    it('should return Promise<number>', async () => {
      const inputs = [
        {
          address: '0x8b2a6d0b4183b5db91bb901eefdd0d0ba06ef125'
        }
      ]

      for (const input of inputs) {
        const data = await callEvent('getTotalTxs', input, client)
        expect(data).to.equal(1)
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

      for (const  input of  inputs) {
        try {
          const data = await callEvent('getTotalTxs', input, client)
        } catch (e) {
          expect(e).to.not.be.undefined
        }
      }
    })
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

  describe('pastTxs', () => {
    it('should return Promise<Tx[]>', async () => {
      const inputs = [
        {
          limit: 10,
          page: 0
        }
      ]

      for (const input of inputs) {
        const data = await callEvent('pastTxs', input, client)
        //timeout happens here
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

  describe('pastBlocks', () => {
    it('should return Promise<Block[]>', async () => {
      const inputs = [
        {
          limit: 10,
          page: 0
        }
      ]

      for (const input of inputs) {
        const data = await callEvent('pastBlocks', input, client)
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
          const data = await callEvent('pastBlocks', input, client)
        } catch (e) {
          expect(e).to.not.be.undefined
        }
      }
    })
  })

  describe('getBlock', () => {
    it('should return Promise<Block>', async () => {
      const inputs = [
        {
          hash: '0x0041061b4de06bb3243312dc0795f8b2ee6a40611d86f401a9679fb0c0bee1bf'
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
