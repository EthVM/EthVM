import { Test } from '@nestjs/testing'
import { EthService } from '../../shared/eth.service'
import { FungibleBalanceTransferEntity } from '../../orm/entities/fungible-balance-transfer.entity'
import { TransferService } from './transfer.service'
import { TransferResolvers } from './transfer.resolvers'
import { TransfersPageDto } from './dto/transfers-page.dto'
import { TransferDto } from './dto/transfer.dto'

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
    traceLocationTransactionIndex: 0
  },
  {
    id: 2,
    contractAddress: address2,
    from: holder2,
    to: holder1,
    traceLocationBlockNumber: 1,
    traceLocationTransactionIndex: 1
  },
  {
    id: 3,
    contractAddress: address3,
    from: holder1,
    to: holder2,
    traceLocationBlockNumber: 2,
    traceLocationTransactionIndex: 0
  },
  {
    id: 4,
    contractAddress: address1,
    from: holder2,
    to: holder3,
    traceLocationBlockNumber: 2,
    traceLocationTransactionIndex: 4
  },
  {
    id: 5,
    contractAddress: address1,
    from: holder1,
    to: holder3,
    traceLocationBlockNumber: 3,
    traceLocationTransactionIndex: 2
  },
  {
    id: 6,
    contractAddress: address2,
    from: holder1,
    to: holder2,
    traceLocationBlockNumber: 6,
    traceLocationTransactionIndex: 0
  }
]

const mockService = {
  async findTokenTransfersByContractAddress(address, take: number = 10, page: number = 0) {
    const data = transfers.filter(t => t.contractAddress === address)

    const sorted = data.map(t => new FungibleBalanceTransferEntity(t)).sort(this.sortTokenTransfers)

    const start = page * take
    const end = start + take
    const items = sorted.slice(start, end)
    return [items, data.length]
  },
  sortTokenTransfers(a: FungibleBalanceTransferEntity, b: FungibleBalanceTransferEntity) {
  if(a.traceLocationBlockNumber == b.traceLocationBlockNumber) {
    return (b.traceLocationTransactionIndex || 0) - (a.traceLocationTransactionIndex || 0)
  } else {
    return +b.traceLocationBlockNumber - +a.traceLocationBlockNumber
  }
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

      expect(transfersForAddress1).toBeInstanceOf(TransfersPageDto)
      expect(transfersForAddress1).toHaveProperty('items')
      expect(transfersForAddress1).toHaveProperty('totalCount', 3)
      if (transfersForAddress1.items) {
        expect(transfersForAddress1.items).toHaveLength(3)
        expect(transfersForAddress1.items[0]).toHaveProperty('contractAddress', address1)
      }

      expect(transfersForAddress2).toBeInstanceOf(TransfersPageDto)
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
        new TransferDto({ id: 5, contractAddress: address1, from: holder1, to: holder3, traceLocationBlockNumber: 3, traceLocationTransactionIndex: 2 }),
        new TransferDto({ id: 4, contractAddress: address1, from: holder2, to: holder3,traceLocationBlockNumber: 2, traceLocationTransactionIndex: 4 }),
        new TransferDto({ id: 1, contractAddress: address1, from: holder1, to: holder3,traceLocationBlockNumber: 1, traceLocationTransactionIndex: 0 }),
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
})
