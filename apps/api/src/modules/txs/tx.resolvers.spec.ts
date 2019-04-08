import { Test } from '@nestjs/testing'
import { EthService } from '../../shared/eth.service'
import { TxService } from './tx.service'
import { TxResolvers } from './tx.resolvers'
import { TransactionEntity } from '../../orm/entities/transaction.entity'
import { TxDto } from './tx.dto'
import { PubSub } from 'graphql-subscriptions'

const mockService = {
  async findTx(hash) {},
  async findTxs(limit, page, fromBlock) {},
  async findTxsForBlock(hash) {},
  async findTxsForAddress(hash, filter, limit, page) {},
  async countTransactions() {}
}

describe('TxResolvers', () => {

  let txService: TxService
  let txResolvers: TxResolvers

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TxResolvers,
        EthService,
        {
          provide: TxService,
          useValue: mockService
        },
        {
          provide: 'PUB_SUB',
          useValue: new PubSub(),
        },
      ],
    }).compile()
    txService = module.get<TxService>(TxService)
    txResolvers = module.get<TxResolvers>(TxResolvers)
  })

  const hash = '0x0000000000000000000000000000000000000000000000000000000000000000'
  const result = {
    id: hash
  }

  describe('tx', () => {
    it('should return an instance of TxDto matching the hash provided', async () => {

      jest.spyOn(txService, 'findTx')
        .mockImplementation(() => new Promise(resolve => {
          resolve(new TransactionEntity(result))
        }))

      expect(await txResolvers.tx(hash)).toEqual(new TxDto(result))
    })
  })

  describe('txs', () => {
    it('should return an array of TxDto instances', async () => {

      jest.spyOn(txService, 'findTxs')
        .mockImplementation(() => new Promise(resolve => {
          resolve([new TransactionEntity(result)])
        }))

      expect(await txResolvers.txs(1)).toEqual([new TxDto(result)])
    })
  })

  describe('txsForBlock', () => {
    it('should return an array of TxDto instances matching given block hash', async () => {

      const blockHash = '0x0000000000000000000000000000000000000000000000000000000000000001'

      jest.spyOn(txService, 'findTxsForBlock')
        .mockImplementation(() => new Promise(resolve => {
          resolve([new TransactionEntity(result)])
        }))

      expect(await txResolvers.txsForBlock(blockHash)).toEqual([new TxDto(result)])
    })
  })

  describe('txsForAddress', () => {
    it('should return an array of TxDto instances matching given address hash', async () => {

      const addressHash = '0000000000000000000000000000000000000000'

      jest.spyOn(txService, 'findTxsForAddress')
        .mockImplementation(() => new Promise(resolve => {
          resolve([new TransactionEntity(result)])
        }))

      expect(await txResolvers.txsForAddress(addressHash)).toEqual([new TxDto(result)])
    })
  })

  describe('totalNumberOfTransactions', () => {
    it('should return the total number of txs in the db', async () => {

      jest.spyOn(txService, 'countTransactions')
        .mockImplementation(() => new Promise(resolve => { resolve(100) }))

      expect(await txResolvers.totalNumberOfTransactions()).toBe(100)
    })
  })

})
