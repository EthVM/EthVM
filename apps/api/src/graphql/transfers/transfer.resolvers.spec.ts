import { Test } from '@nestjs/testing'
import { EthService } from '../../shared/eth.service'
import { FungibleBalanceTransferEntity } from '../../orm/entities/fungible-balance-transfer.entity'
import { TransferResolvers } from './transfer.resolvers'
import { TransferDto } from './dto/transfer.dto'
import { TransferService } from '../../dao/transfer.service'
import { TransferPageDto } from './dto/transfer-page.dto'
import { BalancesPageDto } from './dto/balances-page.dto'
import { BalanceDto } from './dto/balance.dto'
import { FungibleBalanceDeltaEntity } from '../../orm/entities/fungible-balance-delta.entity'
import { MetadataService } from '../../dao/metadata.service'

const address1 = '0000000000000000000000000000000000000001'
const address2 = '0000000000000000000000000000000000000002'
const address3 = '0000000000000000000000000000000000000003'
const address4 = '0000000000000000000000000000000000000004'

const holder1 = '0000000000000000000000000000000000000004'
const holder2 = '0000000000000000000000000000000000000005'
const holder3 = '0000000000000000000000000000000000000006'
const holder4 = '0000000000000000000000000000000000000007'

const transfers = [
  {
    id: 1,
    contractAddress: address1,
    from: holder1,
    to: holder3,
    traceLocationBlockNumber: 1,
    traceLocationTransactionIndex: 0,
    deltaType: 'TOKEN_TRANSFER',
    timestamp: 1400000001
  },
  {
    id: 2,
    contractAddress: address2,
    from: holder2,
    to: holder1,
    traceLocationBlockNumber: 1,
    traceLocationTransactionIndex: 1,
    deltaType: 'TOKEN_TRANSFER',
    timestamp: 1400000002
  },
  {
    id: 3,
    contractAddress: address3,
    from: holder1,
    to: holder2,
    traceLocationBlockNumber: 2,
    traceLocationTransactionIndex: 0,
    deltaType: 'TOKEN_TRANSFER',
    timestamp: 1400000003
  },
  {
    id: 4,
    contractAddress: address1,
    from: holder2,
    to: holder3,
    traceLocationBlockNumber: 2,
    traceLocationTransactionIndex: 4,
    deltaType: 'TOKEN_TRANSFER',
    timestamp: 1400000004
  },
  {
    id: 5,
    contractAddress: address1,
    from: holder1,
    to: holder3,
    traceLocationBlockNumber: 3,
    traceLocationTransactionIndex: 2,
    deltaType: 'TOKEN_TRANSFER',
    timestamp: 1400000005
  },
  {
    id: 6,
    contractAddress: address2,
    from: holder1,
    to: holder2,
    traceLocationBlockNumber: 6,
    traceLocationTransactionIndex: 0,
    deltaType: 'TOKEN_TRANSFER',
    timestamp: 1400000006
  },
  {
    id: 7,
    contractAddress: address1,
    from: holder4,
    to: holder1,
    traceLocationBlockNumber: 8,
    traceLocationTransactionIndex: 0,
    deltaType: 'INTERNAL_TX',
    timestamp: 1400000007
  },
  {
    id: 8,
    contractAddress: address4,
    from: holder2,
    to: holder3,
    traceLocationBlockNumber: 8,
    traceLocationTransactionIndex: 1,
    deltaType: 'INTERNAL_TX',
    timestamp: 1400000008
  },
  {
    id: 9,
    contractAddress: address3,
    from: holder3,
    to: holder2,
    traceLocationBlockNumber: 10,
    traceLocationTransactionIndex: 0,
    deltaType: 'CONTRACT_CREATION',
    timestamp: 1400000009
  },
  {
    id: 10,
    contractAddress: address1,
    from: holder4,
    to: holder3,
    traceLocationBlockNumber: 11,
    traceLocationTransactionIndex: 0,
    deltaType: 'CONTRACT_DESTRUCTION',
    timestamp: 1400000010
  }
]

const balanceDeltas = [
  {
    id: 1,
    address: holder1,
    contractAddress: address1,
    timestamp: 1400000001
  },
  {
    id: 2,
    address: holder1,
    contractAddress: address1,
    timestamp: 1400000010
  },
  {
    id: 3,
    address: holder1,
    contractAddress: address1,
    timestamp: 1400000060
  },
  {
    id: 4,
    address: holder2,
    contractAddress: address1,
    timestamp: 1400000002
  },
  {
    id: 5,
    address: holder3,
    contractAddress: address1,
    timestamp: 1400000003
  },
  {
    id: 6,
    address: holder1,
    contractAddress: address2,
    timestamp: 1400000009
  }
]

const metadataServiceMock = {
  async isSyncing() {
    return false
  }
}


const transferServiceMock = {
  async findTokenTransfersByContractAddress(address: string, offset: number = 0, limit: number = 10): Promise<[FungibleBalanceTransferEntity[], number]> {
    const data = transfers.filter(t => t.contractAddress === address && t.deltaType === 'TOKEN_TRANSFER')

    const sorted = data.map(t => new FungibleBalanceTransferEntity(t)).sort(this.sortTokenTransfers)

    const items = sorted.slice(offset, offset + limit)
    return [items, data.length]
  },
  sortTokenTransfers(a: FungibleBalanceTransferEntity, b: FungibleBalanceTransferEntity) {
    if (a.traceLocationBlockNumber == b.traceLocationBlockNumber) {
      return (b.traceLocationTransactionIndex || 0) - (a.traceLocationTransactionIndex || 0)
    } else {
      return +b.traceLocationBlockNumber - +a.traceLocationBlockNumber
    }
  },
  async findTokenTransfersByContractAddressForHolder(address: string, holder: string, filter: string = 'all', offset: number = 0, limit: number = 10) {

    let data

    switch (filter) {
      case 'in':
        data = transfers.filter(t => t.contractAddress === address && t.from === holder && t.deltaType === 'TOKEN_TRANSFER')
        break
      case 'out':
        data = transfers.filter(t => t.contractAddress === address && t.to === holder && t.deltaType === 'TOKEN_TRANSFER')
        break
      default:
        data = transfers.filter(t => t.contractAddress === address && (t.to === holder || t.from === holder) && t.deltaType === 'TOKEN_TRANSFER')
    }

    const sorted = data.map(t => new FungibleBalanceTransferEntity(t)).sort(this.sortTokenTransfers)

    const items = sorted.slice(offset, offset + limit)
    return [items, data.length]
  },
  async findInternalTransactionsByAddress(address: string, offset: number = 0, limit: number = 10) {

    const data = transfers.filter(t => {
      return (t.to === address || t.from === address) && ['INTERNAL_TX', 'CONTRACT_CREATION', 'CONTRACT_DESTRUCTION'].indexOf(t.deltaType) > -1
    })

    const sorted = data.map(t => new FungibleBalanceTransferEntity(t)).sort(this.sortTokenTransfers)

    const items = sorted.slice(offset, offset + limit)
    return [items, data.length]
  },
  async findTokenTransfersByContractAddressesForHolder(
    addresses: string[],
    holder: string,
    filter: string = 'all',
    take: number = 10,
    page: number = 0,
    timestampFrom: number = 0,
    timestampTo: number = 0,
  ): Promise<[FungibleBalanceTransferEntity[], number]> {
    let data

    switch (filter) {
      case 'in':
        data = transfers.filter(t => {
          return addresses.includes(t.contractAddress)
            && t.from === holder
            && t.deltaType === 'TOKEN_TRANSFER'
            && t.timestamp >= timestampFrom
            && t.timestamp <= timestampTo
        })
        break
      case 'out':
        data = transfers.filter(t => {
          return addresses.includes(t.contractAddress)
            && t.to === holder
            && t.deltaType === 'TOKEN_TRANSFER'
            && t.timestamp >= timestampFrom
            && t.timestamp <= timestampTo
        })
        break
      default:
        data = transfers.filter(t => {
          return addresses.includes(t.contractAddress)
            && (t.to === holder || t.from === holder)
            && t.deltaType === 'TOKEN_TRANSFER'
            && t.timestamp >= timestampFrom
            && t.timestamp <= timestampTo
        })
    }
    const totalCount = data.length

    const sorted = data.map(t => new FungibleBalanceTransferEntity(t)).sort(this.sortTokenTransfers)

    const start = take * page
    const end = start + take
    const items = sorted.slice(start, end)
    return [items, totalCount]
  },
  async findTokenBalancesByContractAddressForHolder(
    address: string,
    holder: string,
    timestampFrom: number = 0,
    timestampTo: number = 0,
  ): Promise<[FungibleBalanceDeltaEntity[], number]> {
    const items = balanceDeltas
      .filter(b => b.contractAddress === address && b.address === holder && b.timestamp >= timestampFrom && b.timestamp <= timestampTo)

    return [items.map(i => new FungibleBalanceDeltaEntity(i)), items.length]
  }
}

describe('TransferResolvers', () => {
  let transferService: TransferService
  let transferResolvers: TransferResolvers

  beforeEach(async () => {
    // test module
    const module = await Test.createTestingModule({
      providers: [
        TransferResolvers,
        EthService,
        {
          provide: TransferService,
          useValue: transferServiceMock
        },
        {
          provide: MetadataService,
          useValue: metadataServiceMock
        }
      ]
    }).compile()

    // fetch dependencies
    transferService = module.get<TransferService>(TransferService)
    transferResolvers = module.get<TransferResolvers>(TransferResolvers)
  })

  describe('tokenTransfersByContractAddress', () => {
    it('should return a TransfersPageDto with items (TransferDto[]) and totalCount where "contractAddress" matches the address provided', async () => {

      const transfersForAddress1 = await transferResolvers.tokenTransfersByContractAddress(address1, 0, 10)
      const transfersForAddress2 = await transferResolvers.tokenTransfersByContractAddress(address2, 0, 10)

      expect(transfersForAddress1).toBeInstanceOf(TransferPageDto)
      expect(transfersForAddress1).toHaveProperty('items')
      expect(transfersForAddress1).toHaveProperty('totalCount', 3)
      if (transfersForAddress1.items) {
        expect(transfersForAddress1.items).toHaveLength(3)
        expect(transfersForAddress1.items[0]).toHaveProperty('contractAddress', address1)
      }

      expect(transfersForAddress2).toBeInstanceOf(TransferPageDto)
      expect(transfersForAddress2).toHaveProperty('items')
      expect(transfersForAddress2).toHaveProperty('totalCount', 2)
      if (transfersForAddress2.items) {
        expect(transfersForAddress2.items).toHaveLength(2)
        expect(transfersForAddress2.items[0]).toHaveProperty('contractAddress', address2)
      }

      expect(transfersForAddress1).not.toEqual(transfersForAddress2)
    })

    it('should respect given limit and page parameters', async () => {
      const transfers1 = await transferResolvers.tokenTransfersByContractAddress(address1, 0, 2)

      expect(transfers1).toHaveProperty('totalCount', 3)
      expect(transfers1).toHaveProperty('items')
      if (transfers1.items) {
        expect(transfers1.items).toHaveLength(2)
        expect(transfers1.items[0]).toHaveProperty('id', 5)
        expect(transfers1.items[1]).toHaveProperty('id', 4)
      }

      const transfers2 = await transferResolvers.tokenTransfersByContractAddress(address1, 2, 2)

      expect(transfers2).toHaveProperty('totalCount', 3)
      expect(transfers2).toHaveProperty('items')
      if (transfers2.items) {
        expect(transfers2.items).toHaveLength(1)
        expect(transfers2.items[0]).toHaveProperty('id', 1)
      }

      // Check an empty array is returned if no items available for requested page
      const transfers3 = await transferResolvers.tokenTransfersByContractAddress(address4, 10, 10)
      expect(transfers3).toHaveProperty('totalCount', 0)
      expect(transfers3).toHaveProperty('items')
      expect(transfers3.items).toHaveLength(0)
    })

    it('should convert an array of TransferEntity instances to an array of TransferDto instances', async () => {
      const transfers = await transferResolvers.tokenTransfersByContractAddress(address1, 0, 10)
      const expected = [
        new TransferDto({
          id: 5,
          contractAddress: address1,
          from: holder1,
          to: holder3,
          traceLocationBlockNumber: 3,
          traceLocationTransactionIndex: 2,
          deltaType: 'TOKEN_TRANSFER',
          timestamp: 1400000005
        }),
        new TransferDto({
          id: 4,
          contractAddress: address1,
          from: holder2,
          to: holder3,
          traceLocationBlockNumber: 2,
          traceLocationTransactionIndex: 4,
          deltaType: 'TOKEN_TRANSFER',
          timestamp: 1400000004
        }),
        new TransferDto({
          id: 1,
          contractAddress: address1,
          from: holder1,
          to: holder3,
          traceLocationBlockNumber: 1,
          traceLocationTransactionIndex: 0,
          deltaType: 'TOKEN_TRANSFER',
          timestamp: 1400000001
        }),
      ]
      expect(transfers.items).toEqual(expect.arrayContaining(expected))
    })

    it('should return Transfers ordered by "traceLocationBlockNumber" and "traceLocationTransactionIndex" decending', async () => {
      const transfers = await transferResolvers.tokenTransfersByContractAddress(address1, 0, 10)
      expect(transfers).toHaveProperty('items')
      if (transfers.items) {
        expect(transfers.items[0]).toHaveProperty('id', 5)
        expect(transfers.items[1]).toHaveProperty('id', 4)
        expect(transfers.items[2]).toHaveProperty('id', 1)
      }
    })
  })

  describe('tokenTransfersByContractAddressForHolder', () => {
    it('should return a TransferPageDto of items matching the contractAddress and holderAddress provided', async () => {

      const transfers1 = await transferResolvers.tokenTransfersByContractAddressForHolder(address1, holder1, 'all', 0, 10)
      const transfers2 = await transferResolvers.tokenTransfersByContractAddressForHolder(address1, holder2, 'all', 0, 10)

      expect(transfers1).toBeInstanceOf(TransferPageDto)
      expect(transfers1).toHaveProperty('items')
      expect(transfers1).toHaveProperty('totalCount', 2)
      if (transfers1.items) {
        expect(transfers1.items).toHaveLength(2)
        expect(transfers1.items[0]).toHaveProperty('contractAddress', address1)
        expect(transfers1.items[0]).toHaveProperty('from', holder1)
        expect(transfers1.items[1]).toHaveProperty('contractAddress', address1)
        expect(transfers1.items[1]).toHaveProperty('from', holder1)
      }

      expect(transfers2).toBeInstanceOf(TransferPageDto)
      expect(transfers2).toHaveProperty('items')
      expect(transfers2).toHaveProperty('totalCount', 1)
      if (transfers2.items) {
        expect(transfers2.items).toHaveLength(1)
        expect(transfers2.items[0]).toHaveProperty('contractAddress', address1)
        expect(transfers2.items[0]).toHaveProperty('from', holder2)
      }

      expect(transfers1).not.toEqual(transfers2)
    })

    it('should respect provided filter', async () => {
      const transfersIn = await transferResolvers.tokenTransfersByContractAddressForHolder(address1, holder1, 'in', 0, 10)
      const transfersOut = await transferResolvers.tokenTransfersByContractAddressForHolder(address1, holder3, 'out', 0, 10)

      expect(transfersIn).toHaveProperty('totalCount', 2)
      expect(transfersIn).toHaveProperty('items')
      if (transfersIn.items) {
        expect(transfersIn.items).toHaveLength(2)
        expect(transfersIn.items[0]).toHaveProperty('from', holder1)
        expect(transfersIn.items[1]).toHaveProperty('from', holder1)
      }

      expect(transfersOut).toHaveProperty('totalCount', 3)
      expect(transfersOut).toHaveProperty('items')
      if (transfersOut.items) {
        expect(transfersOut.items).toHaveLength(3)
        expect(transfersOut.items[0]).toHaveProperty('to', holder3)
        expect(transfersOut.items[1]).toHaveProperty('to', holder3)
        expect(transfersOut.items[2]).toHaveProperty('to', holder3)
      }

      expect(transfersIn).not.toEqual(transfersOut)
    })

    it('should respect given limit and page parameters', async () => {
      const transfers1 = await transferResolvers.tokenTransfersByContractAddressForHolder(address1, holder1, 'all', 0, 1)

      expect(transfers1).toHaveProperty('totalCount', 2)
      expect(transfers1).toHaveProperty('items')
      if (transfers1.items) {
        expect(transfers1.items).toHaveLength(1)
      }

      const transfers2 = await transferResolvers.tokenTransfersByContractAddressForHolder(address1, holder1, 'all', 1, 1)

      expect(transfers2).toHaveProperty('totalCount', 2)
      expect(transfers2).toHaveProperty('items')
      if (transfers2.items) {
        expect(transfers2.items).toHaveLength(1)
      }
      if (transfers2.items && transfers1.items) {
        expect(transfers2.items[0]).not.toEqual(transfers1.items[0])
      }

      // Check an empty array is returned if no items available for requested page
      const transfers3 = await transferResolvers.tokenTransfersByContractAddressForHolder(address1, holder4, 'all', 0, 10)
      expect(transfers3).toHaveProperty('totalCount', 0)
      expect(transfers3).toHaveProperty('items')
      expect(transfers3.items).toHaveLength(0)
    })

    it('should convert an array of TransferEntity instances to an array of TransferDto instances', async () => {
      const transfers = await transferResolvers.tokenTransfersByContractAddressForHolder(address1, holder1, 'all', 0, 10)
      const expected = [
        new TransferDto({
          id: 5,
          contractAddress: address1,
          from: holder1,
          to: holder3,
          traceLocationBlockNumber: 3,
          traceLocationTransactionIndex: 2,
          deltaType: 'TOKEN_TRANSFER',
          timestamp: 1400000005
        }),
        new TransferDto({
          id: 1,
          contractAddress: address1,
          from: holder1,
          to: holder3,
          traceLocationBlockNumber: 1,
          traceLocationTransactionIndex: 0,
          deltaType: 'TOKEN_TRANSFER',
          timestamp: 1400000001
        }),
      ]
      expect(transfers.items).toEqual(expect.arrayContaining(expected))
    })

    it('should return Transfers ordered by "traceLocationBlockNumber" and "traceLocationTransactionIndex" decending', async () => {
      const transfers = await transferResolvers.tokenTransfersByContractAddressForHolder(address1, holder1, 'all', 0, 10)
      expect(transfers).toHaveProperty('items')
      if (transfers.items) {
        expect(transfers.items[0]).toHaveProperty('id', 5)
        expect(transfers.items[1]).toHaveProperty('id', 1)
      }
    })
  })

  describe('internalTransactionsByAddress', () => {
    it('should return a TransfersPageDto with items where "to" or "from" matches the address provided', async () => {

      const transfersForAddress1 = await transferResolvers.internalTransactionsByAddress(holder3, 0, 10)
      const transfersForAddress2 = await transferResolvers.internalTransactionsByAddress(holder4, 0, 10)

      expect(transfersForAddress1).toBeInstanceOf(TransferPageDto)
      expect(transfersForAddress1).toHaveProperty('items')
      expect(transfersForAddress1).toHaveProperty('totalCount', 3)
      if (transfersForAddress1.items) {
        expect(transfersForAddress1.items).toHaveLength(3)
        expect(transfersForAddress1.items[0]).toHaveProperty('to', holder3)
        expect(transfersForAddress1.items[1]).toHaveProperty('from', holder3)
        expect(transfersForAddress1.items[2]).toHaveProperty('to', holder3)
      }

      expect(transfersForAddress2).toBeInstanceOf(TransferPageDto)
      expect(transfersForAddress2).toHaveProperty('items')
      expect(transfersForAddress2).toHaveProperty('totalCount', 2)
      if (transfersForAddress2.items) {
        expect(transfersForAddress2.items).toHaveLength(2)
        expect(transfersForAddress2.items[0]).toHaveProperty('from', holder4)
        expect(transfersForAddress2.items[1]).toHaveProperty('from', holder4)
      }

      expect(transfersForAddress1).not.toEqual(transfersForAddress2)
    })

    it('should respect given limit and page parameters', async () => {
      const transfers1 = await transferResolvers.internalTransactionsByAddress(holder3, 0, 2)

      expect(transfers1).toHaveProperty('totalCount', 3)
      expect(transfers1).toHaveProperty('items')
      if (transfers1.items) {
        expect(transfers1.items).toHaveLength(2)
        expect(transfers1.items[0]).toHaveProperty('id', 10)
        expect(transfers1.items[1]).toHaveProperty('id', 9)
      }

      const transfers2 = await transferResolvers.internalTransactionsByAddress(holder3, 2, 2)

      expect(transfers2).toHaveProperty('totalCount', 3)
      expect(transfers2).toHaveProperty('items')
      if (transfers2.items) {
        expect(transfers2.items).toHaveLength(1)
        expect(transfers2.items[0]).toHaveProperty('id', 8)
      }

      // Check an empty array is returned if no items available for requested page
      const transfers3 = await transferResolvers.tokenTransfersByContractAddress(holder3, 10, 10)
      expect(transfers3).toHaveProperty('totalCount', 0)
      expect(transfers3).toHaveProperty('items')
      expect(transfers3.items).toHaveLength(0)
    })

    it('should convert an array of TransferEntity instances to an array of TransferDto instances', async () => {
      const transfers = await transferResolvers.internalTransactionsByAddress(holder3, 0, 10)
      const expected = [
        new TransferDto({
          id: 10,
          contractAddress: address1,
          from: holder4,
          to: holder3,
          traceLocationBlockNumber: 11,
          traceLocationTransactionIndex: 0,
          deltaType: 'CONTRACT_DESTRUCTION',
          timestamp: 1400000010
        }),
        new TransferDto({
          id: 9,
          contractAddress: address3,
          from: holder3,
          to: holder2,
          traceLocationBlockNumber: 10,
          traceLocationTransactionIndex: 0,
          deltaType: 'CONTRACT_CREATION',
          timestamp: 1400000009
        }),
        new TransferDto({
          id: 8,
          contractAddress: address4,
          from: holder2,
          to: holder3,
          traceLocationBlockNumber: 8,
          traceLocationTransactionIndex: 1,
          deltaType: 'INTERNAL_TX',
          timestamp: 1400000008
        }),
      ]
      expect(transfers.items).toEqual(expect.arrayContaining(expected))
    })

    it('should return Transfers ordered by "traceLocationBlockNumber" and "traceLocationTransactionIndex" decending', async () => {
      const transfers = await transferResolvers.internalTransactionsByAddress(holder3, 0, 10)
      expect(transfers).toHaveProperty('items')
      if (transfers.items) {
        expect(transfers.items[0]).toHaveProperty('id', 10)
        expect(transfers.items[1]).toHaveProperty('id', 9)
        expect(transfers.items[2]).toHaveProperty('id', 8)
      }
    })
  })

  describe('tokenTransfersByContractAddressesForHolder', () => {
    it('should return a TransferPageDto of items matching the contractAddress and holderAddresses provided', async () => {

      const transfers1 = await transferResolvers
        .tokenTransfersByContractAddressesForHolder([address1], holder1, 'all', 10, 0, 1400000001, 1400000010)
      const transfers2 = await transferResolvers
        .tokenTransfersByContractAddressesForHolder([address1], holder2, 'all', 10, 0, 1400000001, 1400000010)

      expect(transfers1).toBeInstanceOf(TransferPageDto)
      expect(transfers1).toHaveProperty('items')
      expect(transfers1).toHaveProperty('totalCount', 2)
      if (transfers1.items) {
        expect(transfers1.items).toHaveLength(2)
        expect(transfers1.items[0]).toHaveProperty('contractAddress', address1)
        expect(transfers1.items[0]).toHaveProperty('from', holder1)
        expect(transfers1.items[1]).toHaveProperty('contractAddress', address1)
        expect(transfers1.items[1]).toHaveProperty('from', holder1)
      }

      expect(transfers2).toBeInstanceOf(TransferPageDto)
      expect(transfers2).toHaveProperty('items')
      expect(transfers2).toHaveProperty('totalCount', 1)
      if (transfers2.items) {
        expect(transfers2.items).toHaveLength(1)
        expect(transfers2.items[0]).toHaveProperty('contractAddress', address1)
        expect(transfers2.items[0]).toHaveProperty('from', holder2)
      }

      expect(transfers1).not.toEqual(transfers2)

      const transfers3 = await transferResolvers
        .tokenTransfersByContractAddressesForHolder([address1, address2], holder1, 'all', 10, 0, 1400000001, 1400000010)
      const transfers4 = await transferResolvers
        .tokenTransfersByContractAddressesForHolder([address3, address4], holder2, 'all', 10, 0, 1400000001, 1400000010)

      expect(transfers3).toBeInstanceOf(TransferPageDto)
      expect(transfers3).toHaveProperty('items')
      expect(transfers3).toHaveProperty('totalCount', 4)
      if (transfers3.items) {
        expect(transfers3.items).toHaveLength(4)
        expect(transfers3.items[0]).toHaveProperty('contractAddress', address2)
        expect(transfers3.items[0]).toHaveProperty('from', holder1)
        expect(transfers3.items[1]).toHaveProperty('contractAddress', address1)
        expect(transfers3.items[1]).toHaveProperty('from', holder1)
      }

      expect(transfers4).toBeInstanceOf(TransferPageDto)
      expect(transfers4).toHaveProperty('items')
      expect(transfers4).toHaveProperty('totalCount', 1)
      if (transfers4.items) {
        expect(transfers4.items).toHaveLength(1)
        expect(transfers4.items[0]).toHaveProperty('contractAddress', address3)
        expect(transfers4.items[0]).toHaveProperty('to', holder2)
      }

      expect(transfers3).not.toEqual(transfers4)
    })

    it('should respect provided filter', async () => {
      const transfersIn = await transferResolvers
        .tokenTransfersByContractAddressesForHolder([address1], holder1, 'in', 10, 0, 1400000001, 1400000010)
      const transfersOut = await transferResolvers
        .tokenTransfersByContractAddressesForHolder([address1], holder3, 'out', 10, 0, 1400000001, 1400000010)

      expect(transfersIn).toHaveProperty('totalCount', 2)
      expect(transfersIn).toHaveProperty('items')
      if (transfersIn.items) {
        expect(transfersIn.items).toHaveLength(2)
        expect(transfersIn.items[0]).toHaveProperty('from', holder1)
        expect(transfersIn.items[1]).toHaveProperty('from', holder1)
      }

      expect(transfersOut).toHaveProperty('totalCount', 3)
      expect(transfersOut).toHaveProperty('items')
      if (transfersOut.items) {
        expect(transfersOut.items).toHaveLength(3)
        expect(transfersOut.items[0]).toHaveProperty('to', holder3)
        expect(transfersOut.items[1]).toHaveProperty('to', holder3)
        expect(transfersOut.items[2]).toHaveProperty('to', holder3)
      }

      expect(transfersIn).not.toEqual(transfersOut)
    })

    it('should respect given limit and page parameters', async () => {
      const transfers1 = await transferResolvers
        .tokenTransfersByContractAddressesForHolder([address1], holder1, 'all', 1, 0, 1400000001, 1400000010)

      expect(transfers1).toHaveProperty('totalCount', 2)
      expect(transfers1).toHaveProperty('items')
      if (transfers1.items) {
        expect(transfers1.items).toHaveLength(1)
      }

      const transfers2 = await transferResolvers
        .tokenTransfersByContractAddressesForHolder([address1], holder1, 'all', 1, 1, 1400000001, 1400000010)

      expect(transfers2).toHaveProperty('totalCount', 2)
      expect(transfers2).toHaveProperty('items')
      if (transfers2.items) {
        expect(transfers2.items).toHaveLength(1)
      }
      if (transfers2.items && transfers1.items) {
        expect(transfers2.items[0]).not.toEqual(transfers1.items[0])
      }

      // Check an empty array is returned if no items available for requested page
      const transfers3 = await transferResolvers
        .tokenTransfersByContractAddressesForHolder([address1], holder4, 'all', 10, 0, 1400000001, 1400000010)
      expect(transfers3).toHaveProperty('totalCount', 0)
      expect(transfers3).toHaveProperty('items')
      expect(transfers3.items).toHaveLength(0)
    })

    it('should convert an array of TransferEntity instances to an array of TransferDto instances', async () => {
      const transfers = await transferResolvers
        .tokenTransfersByContractAddressesForHolder([address1], holder1, 'all', 10, 0, 1400000001, 1400000010)
      expect(transfers).not.toBeNull()
      expect(transfers.items).toHaveLength(2)
      expect(transfers.items[0]).toBeInstanceOf(TransferDto)
      expect(transfers.items[1]).toBeInstanceOf(TransferDto)
    })

    it('should return Transfers ordered by "traceLocationBlockNumber" and "traceLocationTransactionIndex" decending', async () => {
      const transfers = await transferResolvers
        .tokenTransfersByContractAddressesForHolder([address1], holder1, 'all', 10, 0, 1400000001, 1400000010)
      expect(transfers).toHaveProperty('items')
      if (transfers.items) {
        expect(transfers.items[0]).toHaveProperty('id', 5)
        expect(transfers.items[1]).toHaveProperty('id', 1)
      }
    })

    it('should return Transfers with timestamps between the timestampFrom and timestampTo provided', async () => {

      const transfers = await transferResolvers
        .tokenTransfersByContractAddressesForHolder([address1, address2], holder1, 'all', 10, 0, 1400000001, 1400000005)
      expect(transfers).not.toBeNull()
      expect(transfers).toBeInstanceOf(TransferPageDto)
      expect(transfers).toHaveProperty('items')
      expect(transfers).toHaveProperty('totalCount', 3)
      expect(transfers.items[0].timestamp).toBeGreaterThanOrEqual(1400000001)
      expect(transfers.items[1].timestamp).toBeGreaterThanOrEqual(1400000001)
      expect(transfers.items[2].timestamp).toBeGreaterThanOrEqual(1400000001)
      expect(transfers.items[0].timestamp).toBeLessThanOrEqual(1400000005)
      expect(transfers.items[1].timestamp).toBeLessThanOrEqual(1400000005)
      expect(transfers.items[2].timestamp).toBeLessThanOrEqual(1400000005)

      const transfersTwo = await transferResolvers
        .tokenTransfersByContractAddressesForHolder([address1, address2], holder1, 'all', 10, 0, 1400000006, 14000000010)
      expect(transfersTwo).not.toBeNull()
      expect(transfersTwo).toBeInstanceOf(TransferPageDto)
      expect(transfersTwo).toHaveProperty('items')
      expect(transfersTwo).toHaveProperty('totalCount', 1)
      expect(transfersTwo.items[0].timestamp).toBeGreaterThanOrEqual(1400000006)
      expect(transfersTwo.items[0].timestamp).toBeLessThanOrEqual(14000000010)

      expect(transfers).not.toEqual(transfersTwo)
    })
  })

  describe('tokenBalancesByContractAddressForHolder', () => {
    it('should return an instance of BalancesPageDto with totalCount and items array of BalanceDto', async () => {
      const balances = await transferResolvers.tokenBalancesByContractAddressForHolder(address1, holder1, 1400000001, 1400001000)
      expect(balances).not.toBeNull()
      expect(balances).toBeInstanceOf(BalancesPageDto)
      expect(balances).toHaveProperty('items')
      expect(balances).toHaveProperty('totalCount', 3)
      expect(balances.items).toHaveLength(3)
      expect(balances.items[0]).toBeInstanceOf(BalanceDto)
      expect(balances.items[1]).toBeInstanceOf(BalanceDto)
      expect(balances.items[2]).toBeInstanceOf(BalanceDto)
    })

    it('should only return Balances matching the contract address and holder parameters', async () => {
      const balances = await transferResolvers.tokenBalancesByContractAddressForHolder(address1, holder1, 1400000001, 1400001000)
      expect(balances).not.toBeNull()
      expect(balances).toBeInstanceOf(BalancesPageDto)
      expect(balances).toHaveProperty('items')
      expect(balances).toHaveProperty('totalCount', 3)
      expect(balances.items).toHaveLength(3)
      expect(balances.items[0]).toHaveProperty('address', holder1)
      expect(balances.items[0]).toHaveProperty('contractAddress', address1)
      expect(balances.items[1]).toHaveProperty('address', holder1)
      expect(balances.items[1]).toHaveProperty('contractAddress', address1)
      expect(balances.items[2]).toHaveProperty('address', holder1)
      expect(balances.items[2]).toHaveProperty('contractAddress', address1)

      const balancesTwo = await transferResolvers.tokenBalancesByContractAddressForHolder(address2, holder1, 1400000001, 1400001000)
      expect(balancesTwo).not.toBeNull()
      expect(balancesTwo).toBeInstanceOf(BalancesPageDto)
      expect(balancesTwo).toHaveProperty('items')
      expect(balancesTwo).toHaveProperty('totalCount', 1)
      expect(balancesTwo.items).toHaveLength(1)
      expect(balancesTwo.items[0]).toHaveProperty('address', holder1)
      expect(balancesTwo.items[0]).toHaveProperty('contractAddress', address2)

      expect(balances).not.toEqual(balancesTwo)
    })

    it('should only return Balances between the timestampFrom and timestampTo parameters', async () => {
      const balances = await transferResolvers.tokenBalancesByContractAddressForHolder(address1, holder1, 1400000001, 1400000010)
      expect(balances).not.toBeNull()
      expect(balances).toBeInstanceOf(BalancesPageDto)
      expect(balances).toHaveProperty('items')
      expect(balances).toHaveProperty('totalCount', 2)
      expect(balances.items).toHaveLength(2)
      expect(balances.items[0]).toHaveProperty('timestamp')
      expect(balances.items[0].timestamp).toBeGreaterThanOrEqual(1400000001)
      expect(balances.items[0].timestamp).toBeLessThanOrEqual(1400000010)
      expect(balances.items[1]).toHaveProperty('timestamp')
      expect(balances.items[1].timestamp).toBeGreaterThanOrEqual(1400000001)
      expect(balances.items[1].timestamp).toBeLessThanOrEqual(1400000010)

      const balancesTwo = await transferResolvers.tokenBalancesByContractAddressForHolder(address1, holder1, 1400000010, 1400001000)
      expect(balancesTwo).not.toBeNull()
      expect(balancesTwo).toBeInstanceOf(BalancesPageDto)
      expect(balancesTwo).toHaveProperty('items')
      expect(balancesTwo).toHaveProperty('totalCount', 2)
      expect(balancesTwo.items).toHaveLength(2)
      expect(balancesTwo.items[0]).toHaveProperty('timestamp')
      expect(balancesTwo.items[0].timestamp).toBeGreaterThanOrEqual(1400000010)
      expect(balancesTwo.items[0].timestamp).toBeLessThanOrEqual(1400001000)
      expect(balancesTwo.items[1]).toHaveProperty('timestamp')
      expect(balancesTwo.items[1].timestamp).toBeGreaterThanOrEqual(1400000010)
      expect(balancesTwo.items[1].timestamp).toBeLessThanOrEqual(1400001000)

      expect(balances).not.toEqual(balancesTwo)
    })

    it('should return an empty items array if there are no Balances matching the parameters', async () => {
      const balances = await transferResolvers.tokenBalancesByContractAddressForHolder(address4, holder4, 1400000001, 1400001000)
      expect(balances).not.toBeNull()
      expect(balances).toBeInstanceOf(BalancesPageDto)
      expect(balances).toHaveProperty('items')
      expect(balances).toHaveProperty('totalCount', 0)
    })
  })
})
