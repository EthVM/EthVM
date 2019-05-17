import { Test } from '@nestjs/testing'
import { EthService } from '../../shared/eth.service'
import { FungibleBalanceTransferEntity } from '../../orm/entities/fungible-balance-transfer.entity'
import { TransferResolvers } from './transfer.resolvers'
import { TransferPageDto } from './dto/transfer-page.dto'
import { TransferDto } from './dto/transfer.dto'
import { TransferService } from '../../dao/transfer.service'

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
    deltaType: 'TOKEN_TRANSFER'
  },
  {
    id: 2,
    contractAddress: address2,
    from: holder2,
    to: holder1,
    traceLocationBlockNumber: 1,
    traceLocationTransactionIndex: 1,
    deltaType: 'TOKEN_TRANSFER'
  },
  {
    id: 3,
    contractAddress: address3,
    from: holder1,
    to: holder2,
    traceLocationBlockNumber: 2,
    traceLocationTransactionIndex: 0,
    deltaType: 'TOKEN_TRANSFER'
  },
  {
    id: 4,
    contractAddress: address1,
    from: holder2,
    to: holder3,
    traceLocationBlockNumber: 2,
    traceLocationTransactionIndex: 4,
    deltaType: 'TOKEN_TRANSFER'
  },
  {
    id: 5,
    contractAddress: address1,
    from: holder1,
    to: holder3,
    traceLocationBlockNumber: 3,
    traceLocationTransactionIndex: 2,
    deltaType: 'TOKEN_TRANSFER'
  },
  {
    id: 6,
    contractAddress: address2,
    from: holder1,
    to: holder2,
    traceLocationBlockNumber: 6,
    traceLocationTransactionIndex: 0,
    deltaType: 'TOKEN_TRANSFER'
  },
  {
    id: 7,
    contractAddress: address1,
    from: holder4,
    to: holder1,
    traceLocationBlockNumber: 8,
    traceLocationTransactionIndex: 0,
    deltaType: 'INTERNAL_TX'
  },
  {
    id: 8,
    contractAddress: address4,
    from: holder2,
    to: holder3,
    traceLocationBlockNumber: 8,
    traceLocationTransactionIndex: 1,
    deltaType: 'INTERNAL_TX'
  },
  {
    id: 9,
    contractAddress: address3,
    from: holder3,
    to: holder2,
    traceLocationBlockNumber: 10,
    traceLocationTransactionIndex: 0,
    deltaType: 'CONTRACT_CREATION'
  },
  {
    id: 10,
    contractAddress: address1,
    from: holder4,
    to: holder3,
    traceLocationBlockNumber: 11,
    traceLocationTransactionIndex: 0,
    deltaType: 'CONTRACT_DESTRUCTION'
  }
]

const mockService = {
  async findTokenTransfersByContractAddress(address, take: number = 10, page: number = 0) {
    const data = transfers.filter(t => t.contractAddress === address && t.deltaType === 'TOKEN_TRANSFER')

    const sorted = data.map(t => new FungibleBalanceTransferEntity(t)).sort(this.sortTokenTransfers)

    const start = page * take
    const end = start + take
    const items = sorted.slice(start, end)
    return [items, data.length]
  },
  sortTokenTransfers(a: FungibleBalanceTransferEntity, b: FungibleBalanceTransferEntity) {
    if (a.traceLocationBlockNumber == b.traceLocationBlockNumber) {
      return (b.traceLocationTransactionIndex || 0) - (a.traceLocationTransactionIndex || 0)
    } else {
      return +b.traceLocationBlockNumber - +a.traceLocationBlockNumber
    }
  },
  async findTokenTransfersByContractAddressForHolder(address: string, holder: string, filter: string = 'all', take: number = 10, page: number = 0) {

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

    const start = page * take
    const end = start + take
    const items = sorted.slice(start, end)
    return [items, data.length]
  },
  async findInternalTransactionsByAddress(address: string, take: number = 10, page: number = 0) {

    const data = transfers.filter(t => {
      return (t.to === address || t.from === address) && ['INTERNAL_TX', 'CONTRACT_CREATION', 'CONTRACT_DESTRUCTION'].indexOf(t.deltaType) > -1
    })

    const sorted = data.map(t => new FungibleBalanceTransferEntity(t)).sort(this.sortTokenTransfers)

    const start = page * take
    const end = start + take
    const items = sorted.slice(start, end)
    return [items, data.length]
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
          useValue: mockService
        }
      ]
    }).compile()

    // fetch dependencies
    transferService = module.get<TransferService>(TransferService)
    transferResolvers = module.get<TransferResolvers>(TransferResolvers)
  })

  describe('tokenTransfersByContractAddress', () => {
    it('should return a TransfersPageDto with items (TransferDto[]) and totalCount where "contractAddress" matches the address provided', async () => {

      const transfersForAddress1 = await transferResolvers.tokenTransfersByContractAddress(address1)
      const transfersForAddress2 = await transferResolvers.tokenTransfersByContractAddress(address2)

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
      const transfers1 = await transferResolvers.tokenTransfersByContractAddress(address1, 2, 0)

      expect(transfers1).toHaveProperty('totalCount', 3)
      expect(transfers1).toHaveProperty('items')
      if (transfers1.items) {
        expect(transfers1.items).toHaveLength(2)
        expect(transfers1.items[0]).toHaveProperty('id', 5)
        expect(transfers1.items[1]).toHaveProperty('id', 4)
      }

      const transfers2 = await transferResolvers.tokenTransfersByContractAddress(address1, 2, 1)

      expect(transfers2).toHaveProperty('totalCount', 3)
      expect(transfers2).toHaveProperty('items')
      if (transfers2.items) {
        expect(transfers2.items).toHaveLength(1)
        expect(transfers2.items[0]).toHaveProperty('id', 1)
      }

      // Check an empty array is returned if no items available for requested page
      const transfers3 = await transferResolvers.tokenTransfersByContractAddress(address4, 10, 1)
      expect(transfers3).toHaveProperty('totalCount', 0)
      expect(transfers3).toHaveProperty('items')
      expect(transfers3.items).toHaveLength(0)
    })

    it('should convert an array of TransferEntity instances to an array of TransferDto instances', async () => {
      const transfers = await transferResolvers.tokenTransfersByContractAddress(address1)
      const expected = [
        new TransferDto({
          id: 5,
          contractAddress: address1,
          from: holder1,
          to: holder3,
          traceLocationBlockNumber: 3,
          traceLocationTransactionIndex: 2,
          deltaType: 'TOKEN_TRANSFER'
        }),
        new TransferDto({
          id: 4,
          contractAddress: address1,
          from: holder2,
          to: holder3,
          traceLocationBlockNumber: 2,
          traceLocationTransactionIndex: 4,
          deltaType: 'TOKEN_TRANSFER'
        }),
        new TransferDto({
          id: 1,
          contractAddress: address1,
          from: holder1,
          to: holder3,
          traceLocationBlockNumber: 1,
          traceLocationTransactionIndex: 0,
          deltaType: 'TOKEN_TRANSFER'
        }),
      ]
      expect(transfers.items).toEqual(expect.arrayContaining(expected))
    })

    it('should return Transfers ordered by "traceLocationBlockNumber" and "traceLocationTransactionIndex" decending', async () => {
      const transfers = await transferResolvers.tokenTransfersByContractAddress(address1)
      expect(transfers).toHaveProperty('items')
      if (transfers.items) {
        expect(transfers.items[0]).toHaveProperty('id', 5)
        expect(transfers.items[1]).toHaveProperty('id', 4)
        expect(transfers.items[2]).toHaveProperty('id', 1)
      }
    })
  })

  describe('tokenTransfersByContractAddressForHolder', () => {
    it('should return a TransfersPageDto of items matching the contractAddress and holderAddress provided', async () => {

      const transfers1 = await transferResolvers.tokenTransfersByContractAddressForHolder(address1, holder1, 'all')
      const transfers2 = await transferResolvers.tokenTransfersByContractAddressForHolder(address1, holder2, 'all')

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
      const transfersIn = await transferResolvers.tokenTransfersByContractAddressForHolder(address1, holder1, 'in')
      const transfersOut = await transferResolvers.tokenTransfersByContractAddressForHolder(address1, holder3, 'out')

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
      const transfers1 = await transferResolvers.tokenTransfersByContractAddressForHolder(address1, holder1, 'all', 1, 0)

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
      const transfers3 = await transferResolvers.tokenTransfersByContractAddressForHolder(address1, holder4, 'all', 10, 1)
      expect(transfers3).toHaveProperty('totalCount', 0)
      expect(transfers3).toHaveProperty('items')
      expect(transfers3.items).toHaveLength(0)
    })

    it('should convert an array of TransferEntity instances to an array of TransferDto instances', async () => {
      const transfers = await transferResolvers.tokenTransfersByContractAddressForHolder(address1, holder1, 'all')
      const expected = [
        new TransferDto({
          id: 5,
          contractAddress: address1,
          from: holder1,
          to: holder3,
          traceLocationBlockNumber: 3,
          traceLocationTransactionIndex: 2,
          deltaType: 'TOKEN_TRANSFER'
        }),
        new TransferDto({
          id: 1,
          contractAddress: address1,
          from: holder1,
          to: holder3,
          traceLocationBlockNumber: 1,
          traceLocationTransactionIndex: 0,
          deltaType: 'TOKEN_TRANSFER'
        }),
      ]
      expect(transfers.items).toEqual(expect.arrayContaining(expected))
    })

    it('should return Transfers ordered by "traceLocationBlockNumber" and "traceLocationTransactionIndex" decending', async () => {
      const transfers = await transferResolvers.tokenTransfersByContractAddressForHolder(address1, holder1, 'all')
      expect(transfers).toHaveProperty('items')
      if (transfers.items) {
        expect(transfers.items[0]).toHaveProperty('id', 5)
        expect(transfers.items[1]).toHaveProperty('id', 1)
      }
    })
  })

  describe('internalTransactionsByAddress', () => {
    it('should return a TransfersPageDto with items where "to" or "from" matches the address provided', async () => {

      const transfersForAddress1 = await transferResolvers.internalTransactionsByAddress(holder3)
      const transfersForAddress2 = await transferResolvers.internalTransactionsByAddress(holder4)

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
      const transfers1 = await transferResolvers.internalTransactionsByAddress(holder3, 2, 0)

      expect(transfers1).toHaveProperty('totalCount', 3)
      expect(transfers1).toHaveProperty('items')
      if (transfers1.items) {
        expect(transfers1.items).toHaveLength(2)
        expect(transfers1.items[0]).toHaveProperty('id', 10)
        expect(transfers1.items[1]).toHaveProperty('id', 9)
      }

      const transfers2 = await transferResolvers.internalTransactionsByAddress(holder3, 2, 1)

      expect(transfers2).toHaveProperty('totalCount', 3)
      expect(transfers2).toHaveProperty('items')
      if (transfers2.items) {
        expect(transfers2.items).toHaveLength(1)
        expect(transfers2.items[0]).toHaveProperty('id', 8)
      }

      // Check an empty array is returned if no items available for requested page
      const transfers3 = await transferResolvers.tokenTransfersByContractAddress(holder3, 10, 1)
      expect(transfers3).toHaveProperty('totalCount', 0)
      expect(transfers3).toHaveProperty('items')
      expect(transfers3.items).toHaveLength(0)
    })

    it('should convert an array of TransferEntity instances to an array of TransferDto instances', async () => {
      const transfers = await transferResolvers.internalTransactionsByAddress(holder3)
      const expected = [
        new TransferDto({
          id: 10,
          contractAddress: address1,
          from: holder4,
          to: holder3,
          traceLocationBlockNumber: 11,
          traceLocationTransactionIndex: 0,
          deltaType: 'CONTRACT_DESTRUCTION'
        }),
        new TransferDto({
          id: 9,
          contractAddress: address3,
          from: holder3,
          to: holder2,
          traceLocationBlockNumber: 10,
          traceLocationTransactionIndex: 0,
          deltaType: 'CONTRACT_CREATION'
        }),
        new TransferDto({
          id: 8,
          contractAddress: address4,
          from: holder2,
          to: holder3,
          traceLocationBlockNumber: 8,
          traceLocationTransactionIndex: 1,
          deltaType: 'INTERNAL_TX'
        }),
      ]
      expect(transfers.items).toEqual(expect.arrayContaining(expected))
    })

    it('should return Transfers ordered by "traceLocationBlockNumber" and "traceLocationTransactionIndex" decending', async () => {
      const transfers = await transferResolvers.internalTransactionsByAddress(holder3)
      expect(transfers).toHaveProperty('items')
      if (transfers.items) {
        expect(transfers.items[0]).toHaveProperty('id', 10)
        expect(transfers.items[1]).toHaveProperty('id', 9)
        expect(transfers.items[2]).toHaveProperty('id', 8)
      }
    })
  })
})
