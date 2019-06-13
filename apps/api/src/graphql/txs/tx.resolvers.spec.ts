import { Test } from '@nestjs/testing'
import { EthService } from '../../shared/eth.service'
import { TxResolvers } from './tx.resolvers'
import { PubSub } from 'graphql-subscriptions'
import { TxService } from '../../dao/tx.service'
import { FilterEnum, Order, TransactionSummary, TxSortField } from '../schema'
import { TransactionSummaryPageDto } from './dto/transaction-summary-page.dto'
import { TransactionSummaryDto } from './dto/transaction-summary.dto'
import BigNumber from 'bignumber.js'
import { TxDto } from './dto/tx.dto'
import { TransactionEntity } from '../../orm/entities/transaction.entity'
import { MetadataService } from '../../dao/metadata.service'
import { search } from '../../../../explorer/src/core/api/apollo/types/search'

const hashOne = '0x0000000000000000000000000000000000000000000000000000000000000001'
const hashTwo = '0x0000000000000000000000000000000000000000000000000000000000000002'
const hashThree = '0x0000000000000000000000000000000000000000000000000000000000000003'
const hashFour = '0x0000000000000000000000000000000000000000000000000000000000000004'
const hashFive = '0x0000000000000000000000000000000000000000000000000000000000000005'
const hashSix = '0x0000000000000000000000000000000000000000000000000000000000000006'
const hashSeven = '0x0000000000000000000000000000000000000000000000000000000000000007'
const hashEight = '0x0000000000000000000000000000000000000000000000000000000000000008'
const hashNine = '0x0000000000000000000000000000000000000000000000000000000000000009'
const hashTen = '0x00000000000000000000000000000000000000000000000000000000000000010'
const hashEleven = '0x0000000000000000000000000000000000000000000000000000000000000011'

const address1 = '0000000000000000000000000000000000000001'
const address2 = '0000000000000000000000000000000000000002'
const address3 = '0000000000000000000000000000000000000003'
const address4 = '0000000000000000000000000000000000000004'
const address5 = '0000000000000000000000000000000000000005'

const blockHashOne = '0x0000000000000000000000000000000000000000000000000000000000000021'
const blockHashTwo = '0x0000000000000000000000000000000000000000000000000000000000000022'
const blockHashThree = '0x0000000000000000000000000000000000000000000000000000000000000023'
const blockHashFour = '0x0000000000000000000000000000000000000000000000000000000000000024'
const blockHashFive = '0x0000000000000000000000000000000000000000000000000000000000000025'
const blockHashSix = '0x0000000000000000000000000000000000000000000000000000000000000026'

const txSummaries = [
  {
    transactionHash: hashOne,
    blockHash: blockHashOne,
    blockNumber: 1,
    from: address1,
    to: address2,
    transactionIndex: 1,
    timestamp: '2016-11-24T17:21:42Z',
    value: 100,
    fee: 2
  },
  {
    transactionHash: hashTwo,
    blockHash: blockHashOne,
    blockNumber: 1,
    from: address1,
    to: address3,
    transactionIndex: 0,
    timestamp: '2016-11-24T17:21:41Z',
    value: 200,
    fee: 3
  },
  {
    transactionHash: hashThree,
    blockHash: blockHashTwo,
    blockNumber: 2,
    from: address2,
    to: address3,
    transactionIndex: 0,
    timestamp: '2016-11-24T17:21:43Z',
    value: 300,
    fee: 2.5
  },
  {
    transactionHash: hashFour,
    blockHash: blockHashThree,
    blockNumber: 3,
    from: address4,
    to: address3,
    transactionIndex: 2,
    timestamp: '2016-11-24T17:21:46Z',
    value: 400,
    fee: 1.5
  },
  {
    transactionHash: hashFive,
    blockHash: blockHashThree,
    blockNumber: 3,
    from: address2,
    to: address4,
    transactionIndex: 1,
    timestamp: '2016-11-24T17:21:45Z',
    value: 500,
    fee: 5
  },
  {
    transactionHash: hashSix,
    blockHash: blockHashThree,
    blockNumber: 3,
    from: address1,
    to: address3,
    transactionIndex: 0,
    timestamp: '2016-11-24T17:21:44Z',
    value: 600,
    fee: 2.3
  },
  {
    transactionHash: hashSeven,
    blockHash: blockHashFour,
    blockNumber: 4,
    from: address2,
    to: address3,
    transactionIndex: 0,
    timestamp: '2016-11-24T17:21:47Z',
    value: 700,
    fee: 1.25
  },
  {
    transactionHash: hashEight,
    blockHash: blockHashFive,
    blockNumber: 5,
    from: address1,
    to: address4,
    transactionIndex: 2,
    timestamp: '2016-11-24T17:21:50Z',
    value: 800,
    fee: 4
  },
  {
    transactionHash: hashNine,
    blockHash: blockHashFive,
    blockNumber: 5,
    from: address3,
    to: address4,
    transactionIndex: 1,
    timestamp: '2016-11-24T17:21:49Z',
    value: 900,
    fee: 2
  },
  {
    transactionHash: hashTen,
    blockHash: blockHashFive,
    blockNumber: 5,
    from: address2,
    to: address1,
    transactionIndex: 0,
    timestamp: '2016-11-24T17:21:48Z',
    value: 1000,
    fee: 3
  }
]

const metadataServiceMock = {
  async isSyncing() {
    return false
  }
}

const isValidAddress = (address) => {
  return /^(0x)?([0-9a-fA-F]{40})$/.test(address)
}

const txServiceMock = {
  async findSummaries(offset: number, limit: number, fromBlock?: BigNumber): Promise<[TransactionSummary[], number]> {
    // Apply from block filter
    let items = fromBlock ? txSummaries.filter(ts => fromBlock.isGreaterThanOrEqualTo(ts.blockNumber)) : txSummaries
    const totalCount = items.length

    // Sort
    items = items.sort((a, b) => {
      return b.blockNumber - a.blockNumber || b.transactionIndex - a.transactionIndex
    })

    // Apply paging
    items = items.slice(offset, offset + limit)

    return [this.mapItems(items), totalCount]
  },
  async findSummariesByBlockNumber(number: BigNumber, offset: number, limit: number): Promise<[TransactionSummary[], number]> {
    // Filter by blockNumber
    let items = txSummaries.filter(ts => number.isEqualTo(ts.blockNumber))
    const totalCount = items.length

    // Sort
    items = items.sort((a, b) => b.transactionIndex - a.transactionIndex)

    // Apply paging
    items = items.slice(offset, offset + limit)

    // Map type to allow cast to TransactionSummary
    const res = items.map(i => {
      return {
        transactionHash: i.transactionHash,
        blockNumber: i.blockNumber,
        from: i.from,
        to: i.to,
        transactionIndex: i.transactionIndex
      } as TransactionSummary
    })

    return [this.mapItems(items), totalCount]
  },
  async findSummariesByBlockHash(hash: string, offset: number, limit: number): Promise<[TransactionSummary[], number]> {
    // Filter by blockHash
    let items = txSummaries.filter(ts => ts.blockHash === hash)
    const totalCount = items.length

    // Sort
    items = items.sort((a, b) => b.transactionIndex - a.transactionIndex)

    // Apply paging
    items = items.slice(offset, offset + limit)

    return [this.mapItems(items), totalCount]
  },
  async findSummariesByAddress(
    address: string,
    filter?: FilterEnum,
    searchHash?: string,
    sortField: TxSortField = TxSortField.timestamp,
    order: Order = Order.desc,
    offset: number = 0,
    limit: number = 20,
  ): Promise<[TransactionSummary[], number]> {
    let items
    switch (filter) {
      case FilterEnum.in:
        if (!searchHash) {
          items = txSummaries.filter(ts => ts.to === address)
        } else if (isValidAddress(searchHash)) {
          items = txSummaries.filter(ts => (ts.to === address && ts.from === searchHash))
        } else {
          items = txSummaries.filter(ts => (ts.to === address && ts.transactionHash === searchHash))
        }
        break
      case FilterEnum.out:
        if (!searchHash) {
          items = txSummaries.filter(ts => ts.from === address)
        } else if (isValidAddress(searchHash)) {
          items = txSummaries.filter(ts => (ts.from === address && ts.to === searchHash))
        } else {
          items = txSummaries.filter(ts => (ts.from === address && ts.transactionHash === searchHash))
        }
        break
      default:
        if (!searchHash) {
          items = txSummaries.filter(ts => (ts.to === address || ts.from === address))
        } else if (isValidAddress(searchHash)) {
          items = txSummaries.filter(ts => (ts.to === address && ts.from === searchHash) || (ts.from === address && ts.to === searchHash))
        } else {
          items = txSummaries.filter(ts => ((ts.to === address || ts.from === address) && ts.transactionHash === searchHash))
        }
        break
    }
    const totalCount = items.length

    // Sort
    switch (sortField) {
      case TxSortField.value:
        items = order === Order.desc ? items.sort((a, b) => b.value - a.value) : items.sort((a,b) => a.value - b.value)
        break;
      case TxSortField.fee:
        items = order === Order.desc ? items.sort((a, b) => b.fee - a.fee) : items.sort((a,b) => a.fee - b.fee)
        break;
      case TxSortField.successful:
        items = order === Order.desc ? items.sort((a, b) => b.successful - a.successful) : items.sort((a,b) => a.successful - b.successful)
        break;
      case TxSortField.from:
        items = order === Order.desc ? items.sort((a, b) => (b.from).localeCompare(a.from)) : items.sort((a, b) => (a.from).localeCompare(b.from))
        break;
      case TxSortField.to:
        items = order === Order.desc ? items.sort((a, b) => (b.to).localeCompare(a.to)) : items.sort((a, b) => (a.to).localeCompare(b.to))
        break;
      default:
        items = order === Order.desc ? items.sort((a, b) => (b.timestamp).localeCompare(a.timestamp)) : items.sort((a, b) => (a.timestamp).localeCompare(b.timestamp))
    }

    // Apply paging
    items = items.slice(offset, offset + limit)

    return [this.mapItems(items), totalCount]
  },
  mapItems(items): TransactionSummary[] {
    return items.map(i => {
      return {
        transactionHash: i.transactionHash,
        blockNumber: i.blockNumber,
        from: i.from,
        to: i.to,
        transactionIndex: i.transactionIndex,
        timestamp: i.timestamp,
        value: i.value,
        fee: i.fee
      } as TransactionSummary
    })
  },
  async findOneByHash(hash: string): Promise<TransactionEntity | undefined> {
    const item = txSummaries.find(ts => ts.transactionHash === hash)
    return item ? new TransactionEntity(item) : undefined
  }
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
          useValue: txServiceMock
        },
        {
          provide: MetadataService,
          useValue: metadataServiceMock
        },
        {
          provide: 'PUB_SUB',
          useValue: new PubSub()
        }
      ]
    }).compile()
    txService = module.get<TxService>(TxService)
    txResolvers = module.get<TxResolvers>(TxResolvers)
  })

  describe('transactionSummaries', () => {
    it('should return an instance of TransactionSummaryPageDto, with totalCount and items array of TransactionSummaryDto', async () => {
      const txSummariesPage = await txResolvers.transactionSummaries(0, 10)
      expect(txSummariesPage).not.toBeNull()
      expect(txSummariesPage).toBeInstanceOf(TransactionSummaryPageDto)
      expect(txSummariesPage).toHaveProperty('items')
      expect(txSummariesPage).toHaveProperty('totalCount', 10)
      if (txSummariesPage) {
        expect(txSummariesPage.items).toHaveLength(10)
        expect(txSummariesPage.items[0]).toBeInstanceOf(TransactionSummaryDto)
      }
    })
    it('should respect given paging parameters', async () => {
      const txSummariesOne = await txResolvers.transactionSummaries(0, 5)
      expect(txSummariesOne).not.toBeNull()
      expect(txSummariesOne).toBeInstanceOf(TransactionSummaryPageDto)
      expect(txSummariesOne).toHaveProperty('items')
      expect(txSummariesOne).toHaveProperty('totalCount', 10)
      if (txSummariesOne) {
        expect(txSummariesOne.items).toHaveLength(5)
        expect(txSummariesOne.items[0]).toHaveProperty('transactionHash', hashEight)
        expect(txSummariesOne.items[4]).toHaveProperty('transactionHash', hashFour)
      }

      const txSummariesTwo = await txResolvers.transactionSummaries(5, 5)
      expect(txSummariesTwo).not.toBeNull()
      expect(txSummariesTwo).toBeInstanceOf(TransactionSummaryPageDto)
      expect(txSummariesTwo).toHaveProperty('items')
      expect(txSummariesTwo).toHaveProperty('totalCount', 10)
      if (txSummariesTwo) {
        expect(txSummariesTwo.items).toHaveLength(5)
        expect(txSummariesTwo.items[0]).toHaveProperty('transactionHash', hashFive)
        expect(txSummariesTwo.items[4]).toHaveProperty('transactionHash', hashTwo)
      }

      expect(txSummariesOne).not.toEqual(txSummariesTwo)

      // Check an empty array is returned if no items available for requested page
      const txSummariesThree = await txResolvers.transactionSummaries(10, 10)
      expect(txSummariesThree).not.toBeNull()
      expect(txSummariesThree).toBeInstanceOf(TransactionSummaryPageDto)
      expect(txSummariesThree).toHaveProperty('items')
      expect(txSummariesThree).toHaveProperty('totalCount')

      if (txSummariesThree) {
        expect(txSummariesThree.items).toHaveLength(0)
        expect(txSummariesThree.totalCount).toBe(10)
      }
    })

    it('should only return information about Txs with number less than or equal to fromBlock', async () => {
      const txSummariesPage = await txResolvers.transactionSummaries(0, 10, new BigNumber(2))
      expect(txSummariesPage).not.toBeNull()
      expect(txSummariesPage).toBeInstanceOf(TransactionSummaryPageDto)
      expect(txSummariesPage).toHaveProperty('items')
      expect(txSummariesPage).toHaveProperty('totalCount', 3)
      if (txSummariesPage) {
        expect(txSummariesPage.items).toHaveLength(3)
        expect(txSummariesPage.items[0]).toHaveProperty('blockNumber', 2)
        expect(txSummariesPage.items[1]).toHaveProperty('blockNumber', 1)
        expect(txSummariesPage.items[2]).toHaveProperty('blockNumber', 1)
      }
    })

    it('should return tx summaries in descending blockNumber and transactionIndex order', async () => {
      const txSummariesPage = await txResolvers.transactionSummaries(0, 5)
      expect(txSummariesPage).not.toBeNull()
      expect(txSummariesPage).toBeInstanceOf(TransactionSummaryPageDto)
      expect(txSummariesPage).toHaveProperty('items')
      expect(txSummariesPage).toHaveProperty('totalCount', 10)
      if (txSummariesPage) {
        expect(txSummariesPage.items).toHaveLength(5)
        expect(txSummariesPage.items[0]).toHaveProperty('blockNumber', 5)
        expect(txSummariesPage.items[0]).toHaveProperty('transactionIndex', 2)
        expect(txSummariesPage.items[1]).toHaveProperty('blockNumber', 5)
        expect(txSummariesPage.items[1]).toHaveProperty('transactionIndex', 1)
        expect(txSummariesPage.items[2]).toHaveProperty('blockNumber', 5)
        expect(txSummariesPage.items[2]).toHaveProperty('transactionIndex', 0)
        expect(txSummariesPage.items[3]).toHaveProperty('blockNumber', 4)
        expect(txSummariesPage.items[3]).toHaveProperty('transactionIndex', 0)
        expect(txSummariesPage.items[4]).toHaveProperty('blockNumber', 3)
        expect(txSummariesPage.items[4]).toHaveProperty('transactionIndex', 2)
      }
    })
  })

  describe('transactionSummariesForBlockNumber', () => {
    it('should return an instance of TransactionSummaryPageDto, with totalCount and items array of TransactionSummaryDto', async () => {
      const txSummariesPage = await txResolvers.transactionSummariesForBlockNumber(new BigNumber(5), 0, 10)
      expect(txSummariesPage).not.toBeNull()
      expect(txSummariesPage).toBeInstanceOf(TransactionSummaryPageDto)
      expect(txSummariesPage).toHaveProperty('items')
      expect(txSummariesPage).toHaveProperty('totalCount', 3)
      if (txSummariesPage) {
        expect(txSummariesPage.items).toHaveLength(3)
        expect(txSummariesPage.items[0]).toBeInstanceOf(TransactionSummaryDto)
      }
    })
    it('should respect given paging parameters', async () => {
      const txSummariesOne = await txResolvers.transactionSummariesForBlockNumber(new BigNumber(5), 0, 2)
      expect(txSummariesOne).not.toBeNull()
      expect(txSummariesOne).toBeInstanceOf(TransactionSummaryPageDto)
      expect(txSummariesOne).toHaveProperty('items')
      expect(txSummariesOne).toHaveProperty('totalCount', 3)
      if (txSummariesOne) {
        expect(txSummariesOne.items).toHaveLength(2)
        expect(txSummariesOne.items[0]).toHaveProperty('blockNumber', 5)
        expect(txSummariesOne.items[0]).toHaveProperty('transactionIndex', 2)
        expect(txSummariesOne.items[1]).toHaveProperty('blockNumber', 5)
        expect(txSummariesOne.items[1]).toHaveProperty('transactionIndex', 1)
      }

      const txSummariesTwo = await txResolvers.transactionSummariesForBlockNumber(new BigNumber(5), 2, 2)
      expect(txSummariesTwo).not.toBeNull()
      expect(txSummariesTwo).toBeInstanceOf(TransactionSummaryPageDto)
      expect(txSummariesTwo).toHaveProperty('items')
      expect(txSummariesTwo).toHaveProperty('totalCount', 3)
      if (txSummariesTwo) {
        expect(txSummariesTwo.items).toHaveLength(1)
        expect(txSummariesTwo.items[0]).toHaveProperty('blockNumber', 5)
        expect(txSummariesTwo.items[0]).toHaveProperty('transactionIndex', 0)
      }

      expect(txSummariesOne).not.toEqual(txSummariesTwo)

      // Check an empty array is returned if no items available for requested page
      const txSummariesThree = await txResolvers.transactionSummariesForBlockNumber(new BigNumber(5), 4, 2)
      expect(txSummariesThree).not.toBeNull()
      expect(txSummariesThree).toBeInstanceOf(TransactionSummaryPageDto)
      expect(txSummariesThree).toHaveProperty('items')
      expect(txSummariesThree).toHaveProperty('totalCount')

      if (txSummariesThree) {
        expect(txSummariesThree.items).toHaveLength(0)
        expect(txSummariesThree.totalCount).toBe(3)
      }
    })
    it('should only return Txs for the given block number', async () => {
      const txSummariesPage = await txResolvers.transactionSummariesForBlockNumber(new BigNumber(2), 0, 10)
      expect(txSummariesPage).not.toBeNull()
      expect(txSummariesPage).toBeInstanceOf(TransactionSummaryPageDto)
      expect(txSummariesPage).toHaveProperty('items')
      expect(txSummariesPage).toHaveProperty('totalCount', 1)
      if (txSummariesPage) {
        expect(txSummariesPage.items).toHaveLength(1)
        expect(txSummariesPage.items[0]).toHaveProperty('blockNumber', 2)
      }

      // Confirm an empty page is returned if no txs for given block number
      const txSummariesPageTwo = await txResolvers.transactionSummariesForBlockNumber(new BigNumber(6), 0, 10)
      expect(txSummariesPageTwo).not.toBeNull()
      expect(txSummariesPageTwo).toBeInstanceOf(TransactionSummaryPageDto)
      expect(txSummariesPageTwo).toHaveProperty('items')
      expect(txSummariesPageTwo).toHaveProperty('totalCount', 0)
      if (txSummariesPageTwo) {
        expect(txSummariesPageTwo.items).toHaveLength(0)
      }
    })
    it('should return tx summaries in descending transactionIndex order', async () => {
      const txSummariesPage = await txResolvers.transactionSummariesForBlockNumber(new BigNumber(5), 0, 10)
      expect(txSummariesPage).not.toBeNull()
      expect(txSummariesPage).toBeInstanceOf(TransactionSummaryPageDto)
      expect(txSummariesPage).toHaveProperty('items')
      expect(txSummariesPage).toHaveProperty('totalCount', 3)
      if (txSummariesPage) {
        expect(txSummariesPage.items).toHaveLength(3)
        expect(txSummariesPage.items[0]).toHaveProperty('transactionIndex', 2)
        expect(txSummariesPage.items[1]).toHaveProperty('transactionIndex', 1)
        expect(txSummariesPage.items[2]).toHaveProperty('transactionIndex', 0)
      }
    })
  })
  describe('transactionSummariesForBlockHash', () => {
    it('should return an instance of TransactionSummaryPageDto, with totalCount and items array of TransactionSummaryDto', async () => {
      const txSummariesPage = await txResolvers.transactionSummariesForBlockHash(blockHashFive, 0, 10)
      expect(txSummariesPage).not.toBeNull()
      expect(txSummariesPage).toBeInstanceOf(TransactionSummaryPageDto)
      expect(txSummariesPage).toHaveProperty('items')
      expect(txSummariesPage).toHaveProperty('totalCount', 3)
      if (txSummariesPage) {
        expect(txSummariesPage.items).toHaveLength(3)
        expect(txSummariesPage.items[0]).toBeInstanceOf(TransactionSummaryDto)
      }
    })
    it('should respect given paging parameters', async () => {
      const txSummariesOne = await txResolvers.transactionSummariesForBlockHash(blockHashFive, 0, 2)
      expect(txSummariesOne).not.toBeNull()
      expect(txSummariesOne).toBeInstanceOf(TransactionSummaryPageDto)
      expect(txSummariesOne).toHaveProperty('items')
      expect(txSummariesOne).toHaveProperty('totalCount', 3)
      if (txSummariesOne) {
        expect(txSummariesOne.items).toHaveLength(2)
        expect(txSummariesOne.items[0]).toHaveProperty('blockNumber', 5)
        expect(txSummariesOne.items[0]).toHaveProperty('transactionIndex', 2)
        expect(txSummariesOne.items[1]).toHaveProperty('blockNumber', 5)
        expect(txSummariesOne.items[1]).toHaveProperty('transactionIndex', 1)
      }

      const txSummariesTwo = await txResolvers.transactionSummariesForBlockHash(blockHashFive, 2, 2)
      expect(txSummariesTwo).not.toBeNull()
      expect(txSummariesTwo).toBeInstanceOf(TransactionSummaryPageDto)
      expect(txSummariesTwo).toHaveProperty('items')
      expect(txSummariesTwo).toHaveProperty('totalCount', 3)
      if (txSummariesTwo) {
        expect(txSummariesTwo.items).toHaveLength(1)
        expect(txSummariesTwo.items[0]).toHaveProperty('blockNumber', 5)
        expect(txSummariesTwo.items[0]).toHaveProperty('transactionIndex', 0)
      }

      expect(txSummariesOne).not.toEqual(txSummariesTwo)

      // Check an empty array is returned if no items available for requested page
      const txSummariesThree = await txResolvers.transactionSummariesForBlockHash(blockHashFive, 4, 2)
      expect(txSummariesThree).not.toBeNull()
      expect(txSummariesThree).toBeInstanceOf(TransactionSummaryPageDto)
      expect(txSummariesThree).toHaveProperty('items')
      expect(txSummariesThree).toHaveProperty('totalCount')

      if (txSummariesThree) {
        expect(txSummariesThree.items).toHaveLength(0)
        expect(txSummariesThree.totalCount).toBe(3)
      }
    })
    it('should only return Txs for the given block hash', async () => {
      const txSummariesPage = await txResolvers.transactionSummariesForBlockHash(blockHashTwo, 0, 10)
      expect(txSummariesPage).not.toBeNull()
      expect(txSummariesPage).toBeInstanceOf(TransactionSummaryPageDto)
      expect(txSummariesPage).toHaveProperty('items')
      expect(txSummariesPage).toHaveProperty('totalCount', 1)
      if (txSummariesPage) {
        expect(txSummariesPage.items).toHaveLength(1)
        expect(txSummariesPage.items[0]).toHaveProperty('blockNumber', 2)
      }

      // Confirm an empty page is returned if no txs for given block hash
      const txSummariesPageTwo = await txResolvers.transactionSummariesForBlockHash(blockHashSix, 0, 10)
      expect(txSummariesPageTwo).not.toBeNull()
      expect(txSummariesPageTwo).toBeInstanceOf(TransactionSummaryPageDto)
      expect(txSummariesPageTwo).toHaveProperty('items')
      expect(txSummariesPageTwo).toHaveProperty('totalCount', 0)
      if (txSummariesPageTwo) {
        expect(txSummariesPageTwo.items).toHaveLength(0)
      }
    })
    it('should return tx summaries in descending transactionIndex order', async () => {
      const txSummariesPage = await txResolvers.transactionSummariesForBlockHash(blockHashFive, 0, 10)
      expect(txSummariesPage).not.toBeNull()
      expect(txSummariesPage).toBeInstanceOf(TransactionSummaryPageDto)
      expect(txSummariesPage).toHaveProperty('items')
      expect(txSummariesPage).toHaveProperty('totalCount', 3)
      if (txSummariesPage) {
        expect(txSummariesPage.items).toHaveLength(3)
        expect(txSummariesPage.items[0]).toHaveProperty('transactionIndex', 2)
        expect(txSummariesPage.items[1]).toHaveProperty('transactionIndex', 1)
        expect(txSummariesPage.items[2]).toHaveProperty('transactionIndex', 0)
      }
    })
  })

  describe('transactionSummariesForAddress', () => {
    it('should return an instance of TransactionSummaryPageDto, with totalCount and items array of TransactionSummaryDto', async () => {
      const txSummariesPage = await txResolvers.transactionSummariesForAddress(address1, FilterEnum.all, undefined, undefined, undefined, 0, 10)
      expect(txSummariesPage).not.toBeNull()
      expect(txSummariesPage).toBeInstanceOf(TransactionSummaryPageDto)
      expect(txSummariesPage).toHaveProperty('items')
      expect(txSummariesPage).toHaveProperty('totalCount', 5)
      if (txSummariesPage) {
        expect(txSummariesPage.items).toHaveLength(5)
        expect(txSummariesPage.items[0]).toBeInstanceOf(TransactionSummaryDto)
      }
    })
    it('should respect given paging parameters', async () => {
      const txSummariesOne = await txResolvers.transactionSummariesForAddress(address1, FilterEnum.all, undefined, undefined, undefined,  0, 2)
      expect(txSummariesOne).not.toBeNull()
      expect(txSummariesOne).toBeInstanceOf(TransactionSummaryPageDto)
      expect(txSummariesOne).toHaveProperty('items')
      expect(txSummariesOne).toHaveProperty('totalCount', 5)
      if (txSummariesOne) {
        expect(txSummariesOne.items).toHaveLength(2)
        expect(txSummariesOne.items[0]).toHaveProperty('blockNumber', 5)
        expect(txSummariesOne.items[0]).toHaveProperty('transactionIndex', 2)
        expect(txSummariesOne.items[1]).toHaveProperty('blockNumber', 5)
        expect(txSummariesOne.items[1]).toHaveProperty('transactionIndex', 0)
      }

      const txSummariesTwo = await txResolvers.transactionSummariesForAddress(address1, FilterEnum.all, undefined, undefined, undefined,  2, 2)
      expect(txSummariesTwo).not.toBeNull()
      expect(txSummariesTwo).toBeInstanceOf(TransactionSummaryPageDto)
      expect(txSummariesTwo).toHaveProperty('items')
      expect(txSummariesTwo).toHaveProperty('totalCount', 5)
      if (txSummariesTwo) {
        expect(txSummariesTwo.items).toHaveLength(2)
        expect(txSummariesTwo.items[0]).toHaveProperty('blockNumber', 3)
        expect(txSummariesTwo.items[0]).toHaveProperty('transactionIndex', 0)
        expect(txSummariesTwo.items[1]).toHaveProperty('blockNumber', 1)
        expect(txSummariesTwo.items[1]).toHaveProperty('transactionIndex', 1)
      }

      expect(txSummariesOne).not.toEqual(txSummariesTwo)

      // Check an empty array is returned if no items available for requested page
      const txSummariesThree = await txResolvers.transactionSummariesForAddress(address1, FilterEnum.all, undefined, undefined, undefined, 10, 10)
      expect(txSummariesThree).not.toBeNull()
      expect(txSummariesThree).toBeInstanceOf(TransactionSummaryPageDto)
      expect(txSummariesThree).toHaveProperty('items')
      expect(txSummariesThree).toHaveProperty('totalCount')

      if (txSummariesThree) {
        expect(txSummariesThree.items).toHaveLength(0)
        expect(txSummariesThree.totalCount).toBe(5)
      }
    })
    it('should only return Txs for the given address', async () => {
      const txSummariesPage = await txResolvers.transactionSummariesForAddress(address1, FilterEnum.all, undefined, undefined, undefined,  0, 10)
      expect(txSummariesPage).not.toBeNull()
      expect(txSummariesPage).toBeInstanceOf(TransactionSummaryPageDto)
      expect(txSummariesPage).toHaveProperty('items')
      expect(txSummariesPage).toHaveProperty('totalCount', 5)
      if (txSummariesPage) {
        expect(txSummariesPage.items).toHaveLength(5)
        expect(txSummariesPage.items[0]).toHaveProperty('from', address1)
        expect(txSummariesPage.items[1]).toHaveProperty('to', address1)
        expect(txSummariesPage.items[2]).toHaveProperty('from', address1)
        expect(txSummariesPage.items[3]).toHaveProperty('from', address1)
        expect(txSummariesPage.items[4]).toHaveProperty('from', address1)
      }

      // Confirm an empty page is returned if no txs for given address
      const txSummariesPageTwo = await txResolvers.transactionSummariesForAddress(address5, FilterEnum.all, undefined, undefined, undefined,  0, 10)
      expect(txSummariesPageTwo).not.toBeNull()
      expect(txSummariesPageTwo).toBeInstanceOf(TransactionSummaryPageDto)
      expect(txSummariesPageTwo).toHaveProperty('items')
      expect(txSummariesPageTwo).toHaveProperty('totalCount', 0)
      if (txSummariesPageTwo) {
        expect(txSummariesPageTwo.items).toHaveLength(0)
      }
    })
    it('should respect given filter parameter', async () => {
      const txSummariesIn = await txResolvers.transactionSummariesForAddress(address4, FilterEnum.in, undefined, undefined, undefined,  0, 10)
      expect(txSummariesIn).not.toBeNull()
      expect(txSummariesIn).toHaveProperty('items')
      expect(txSummariesIn).toHaveProperty('totalCount', 3)
      if (txSummariesIn) {
        expect(txSummariesIn.items).toHaveLength(3)
        expect(txSummariesIn.items[0]).toHaveProperty('to', address4)
        expect(txSummariesIn.items[1]).toHaveProperty('to', address4)
        expect(txSummariesIn.items[2]).toHaveProperty('to', address4)
      }

      const txSummariesOut = await txResolvers.transactionSummariesForAddress(address3, FilterEnum.out, undefined, undefined, undefined, 0, 10)
      expect(txSummariesOut).not.toBeNull()
      expect(txSummariesOut).toHaveProperty('items')
      expect(txSummariesOut).toHaveProperty('totalCount', 1)
      if (txSummariesOut) {
        expect(txSummariesOut.items).toHaveLength(1)
        expect(txSummariesOut.items[0]).toHaveProperty('from', address3)
      }

      expect(txSummariesIn).not.toEqual(txSummariesOut)
    })
    it('should return tx summaries in descending timestamp order by default', async () => {
      const txSummariesPage = await txResolvers.transactionSummariesForAddress(address1, FilterEnum.all, undefined, undefined, undefined)
      expect(txSummariesPage).not.toBeNull()
      expect(txSummariesPage).toBeInstanceOf(TransactionSummaryPageDto)
      expect(txSummariesPage).toHaveProperty('items')
      expect(txSummariesPage).toHaveProperty('totalCount', 5)
      if (txSummariesPage) {
        expect(txSummariesPage.items).toHaveLength(5)
        expect(txSummariesPage.items[0]).toHaveProperty('timestamp', '2016-11-24T17:21:50Z')
        expect(txSummariesPage.items[1]).toHaveProperty('timestamp', '2016-11-24T17:21:48Z')
        expect(txSummariesPage.items[2]).toHaveProperty('timestamp', '2016-11-24T17:21:44Z')
        expect(txSummariesPage.items[3]).toHaveProperty('timestamp', '2016-11-24T17:21:42Z')
        expect(txSummariesPage.items[4]).toHaveProperty('timestamp', '2016-11-24T17:21:41Z')
      }
    })
    it('should order tx summaries by given sortField and order', async () => {
      const txsPageValueAsc = await txResolvers.transactionSummariesForAddress(address1, FilterEnum.all, undefined, TxSortField.value, Order.asc)
      expect(txsPageValueAsc).not.toBeNull()
      expect(txsPageValueAsc).toHaveProperty('items')
      expect(txsPageValueAsc).toHaveProperty('totalCount', 5)

      if (txsPageValueAsc) {
        const { items } = txsPageValueAsc
        expect(items[0].value).toBeLessThanOrEqual(items[1].value)
        expect(items[1].value).toBeLessThanOrEqual(items[2].value)
        expect(items[2].value).toBeLessThanOrEqual(items[3].value)
        expect(items[3].value).toBeLessThanOrEqual(items[4].value)
      }

      const txsPageValueDesc = await txResolvers.transactionSummariesForAddress(address1, FilterEnum.all, undefined, TxSortField.value, Order.desc)
      expect(txsPageValueDesc).not.toBeNull()
      expect(txsPageValueDesc).toHaveProperty('items')
      expect(txsPageValueDesc).toHaveProperty('totalCount', 5)

      if (txsPageValueDesc) {
        const { items } = txsPageValueDesc
        expect(items[0].value).toBeGreaterThanOrEqual(items[1].value)
        expect(items[1].value).toBeGreaterThanOrEqual(items[2].value)
        expect(items[2].value).toBeGreaterThanOrEqual(items[3].value)
        expect(items[3].value).toBeGreaterThanOrEqual(items[4].value)
      }

      const txsPageFeeAsc = await txResolvers.transactionSummariesForAddress(address1, FilterEnum.all, undefined, TxSortField.fee, Order.asc)
      expect(txsPageFeeAsc).not.toBeNull()
      expect(txsPageFeeAsc).toHaveProperty('items')
      expect(txsPageFeeAsc).toHaveProperty('totalCount', 5)

      if (txsPageFeeAsc) {
        const { items } = txsPageFeeAsc
        expect(items[0].fee).toBeLessThanOrEqual(items[1].fee)
        expect(items[1].fee).toBeLessThanOrEqual(items[2].fee)
        expect(items[2].fee).toBeLessThanOrEqual(items[3].fee)
        expect(items[3].fee).toBeLessThanOrEqual(items[4].fee)
      }

      const txsPageFeeDesc = await txResolvers.transactionSummariesForAddress(address1, FilterEnum.all, undefined, TxSortField.fee, Order.desc)
      expect(txsPageFeeDesc).not.toBeNull()
      expect(txsPageFeeDesc).toHaveProperty('items')
      expect(txsPageFeeDesc).toHaveProperty('totalCount', 5)

      if (txsPageFeeDesc) {
        const { items } = txsPageFeeDesc
        expect(items[0].fee).toBeGreaterThanOrEqual(items[1].fee)
        expect(items[1].fee).toBeGreaterThanOrEqual(items[2].fee)
        expect(items[2].fee).toBeGreaterThanOrEqual(items[3].fee)
        expect(items[3].fee).toBeGreaterThanOrEqual(items[4].fee)
      }

    })
    it('should filter by given searchHash', async () => {
      const filteredByAddressTwo = await txResolvers.transactionSummariesForAddress(address1, FilterEnum.all, address2)
      expect(filteredByAddressTwo).not.toBeNull()
      if (filteredByAddressTwo) {
        expect(filteredByAddressTwo).toHaveProperty('items')
        expect(filteredByAddressTwo).toHaveProperty('totalCount', 2)
        expect(filteredByAddressTwo.items[0]).toHaveProperty('to', address1)
        expect(filteredByAddressTwo.items[0]).toHaveProperty('from', address2)
        expect(filteredByAddressTwo.items[1]).toHaveProperty('to', address2)
        expect(filteredByAddressTwo.items[1]).toHaveProperty('from', address1)
      }

      // Check filter param is still respected
      const filteredByAddressTwoIn = await txResolvers.transactionSummariesForAddress(address1, FilterEnum.in, address2)
      expect(filteredByAddressTwoIn).not.toBeNull()
      if (filteredByAddressTwoIn) {
        expect(filteredByAddressTwoIn).toHaveProperty('items')
        expect(filteredByAddressTwoIn).toHaveProperty('totalCount', 1)
        expect(filteredByAddressTwoIn.items[0]).toHaveProperty('to', address1)
        expect(filteredByAddressTwoIn.items[0]).toHaveProperty('from', address2)
      }

      const filteredByHashTwo = await txResolvers.transactionSummariesForAddress(address1, FilterEnum.all, hashTwo)
      expect(filteredByHashTwo).not.toBeNull()
      if (filteredByHashTwo) {
        expect(filteredByHashTwo).toHaveProperty('items')
        expect(filteredByHashTwo).toHaveProperty('totalCount', 1)
        expect(filteredByHashTwo.items[0]).toHaveProperty('from', address1)
        expect(filteredByHashTwo.items[0]).toHaveProperty('transactionHash', hashTwo)
      }

      // Check filter param is respected
      const filteredByHashTwoIn = await txResolvers.transactionSummariesForAddress(address1, FilterEnum.in, hashTwo)
      expect(filteredByHashTwoIn).not.toBeNull()
      if (filteredByHashTwoIn) {
        expect(filteredByHashTwoIn).toHaveProperty('items')
        expect(filteredByHashTwoIn).toHaveProperty('totalCount', 0)
        expect(filteredByHashTwoIn.items[0]).toBeUndefined()
      }
    })
  })

  describe('tx', () => {
    it('should return null if tx does not exist for a given hash', async () => {
      expect(await txResolvers.tx(hashEleven)).toBeUndefined()
    })

    it('should return an instance of TxDto matching the address hash provided', async () => {
      const txOne = await txResolvers.tx(hashOne)
      const txTwo = await txResolvers.tx(hashTwo)

      // check that distinct objects are returned based on hash and that they do not equal each other

      expect(txOne).not.toBeNull()
      expect(txOne).toBeInstanceOf(TxDto)
      if (txOne) {
        expect(txOne).toHaveProperty('transactionHash', hashOne)
      }

      expect(txTwo).not.toBeNull()
      expect(txTwo).toBeInstanceOf(TxDto)
      if (txTwo) {
        expect(txTwo).toHaveProperty('transactionHash', hashTwo)
      }

      expect(txOne).not.toEqual(txTwo)
    })
  })

})
