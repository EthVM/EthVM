import { Test } from '@nestjs/testing'
import { SearchService } from './search.service'
import { SearchResolvers } from './search.resolvers'
import { SearchDto } from './search.dto'
import { BalanceEntity } from '../../orm/entities/balance.entity'
import { BlockEntity } from '../../orm/entities/block.entity'
import { TransactionEntity } from '../../orm/entities/transaction.entity'
import { UncleEntity } from '../../orm/entities/uncle.entity'
import { SearchType } from '../../graphql/schema'
import { BlockDto } from '../blocks/block.dto'

const balanceHashOne = '0000000000000000000000000000000000000001'
const balanceHashTwo = '0000000000000000000000000000000000000002'
const balanceHashThree = '0000000000000000000000000000000000000003'
const balances = {
  '0000000000000000000000000000000000000001': {
    id: {
      balanceType: 'ETHER',
      address: balanceHashOne
    }
  },
  '0000000000000000000000000000000000000002': {
    id: {
      balanceType: 'ETHER',
      address: balanceHashTwo
    }
  }
}

const blockHashOne = '0x0000000000000000000000000000000000000000000000000000000000000001'
const blockHashTwo = '0x0000000000000000000000000000000000000000000000000000000000000002'
const blockHashThree = '0x0000000000000000000000000000000000000000000000000000000000000003'
const blocks = {
  '0x0000000000000000000000000000000000000000000000000000000000000001': {
    id: 1,
    header: {
      hash: blockHashOne
    }
  },
  '0x0000000000000000000000000000000000000000000000000000000000000002': {
    id: 2,
    header: {
      hash: blockHashTwo
    }
  }
}

const txHashOne = '0x0000000000000000000000000000000000000000000000000000000000000004'
const txHashTwo = '0x0000000000000000000000000000000000000000000000000000000000000005'
const txHashThree = '0x0000000000000000000000000000000000000000000000000000000000000006'
const txs = {
  '0x0000000000000000000000000000000000000000000000000000000000000004': {
    id: txHashOne
  },
  '0x0000000000000000000000000000000000000000000000000000000000000005': {
    id: txHashTwo
  }
}

const uncleHashOne = '0x0000000000000000000000000000000000000000000000000000000000000007'
const uncleHashTwo = '0x0000000000000000000000000000000000000000000000000000000000000008'
const uncleHashThree = '0x0000000000000000000000000000000000000000000000000000000000000009'
const uncles = {
  '0x0000000000000000000000000000000000000000000000000000000000000007': {
    id: uncleHashOne
  },
  '0x0000000000000000000000000000000000000000000000000000000000000008': {
    id: uncleHashTwo
  }
}

const mockService = {
  async search(query) {
    const s = new SearchDto({ type: SearchType.None })

    const balance = balances[query]
    if (balance) {
      s.address = new BalanceEntity(balance)
      s.type = SearchType.Address
      return s
    }

    const block = blocks[query]
    if (block) {
      s.block = new BlockEntity(block)
      s.type = SearchType.Block
      return s
    }

    const tx = txs[query]
    if (tx) {
      s.tx = new TransactionEntity(tx)
      s.type = SearchType.Tx
      return s
    }

    const uncle = uncles[query]
    if (uncle) {
      s.uncle = new UncleEntity(uncle)
      s.type = SearchType.Uncle
      return s
    }

    return s
  }
}

describe('SearchResolvers', () => {
  let searchService: SearchService
  let searchResolvers: SearchResolvers

  beforeEach(async () => {
    // test module
    const module = await Test.createTestingModule({
      providers: [
        SearchResolvers,
        {
          provide: SearchService,
          useValue: mockService
        }
      ]
    }).compile()

    // fetch dependencies
    searchService = module.get<SearchService>(SearchService)
    searchResolvers = module.get<SearchResolvers>(SearchResolvers)
  })

  describe('search', () => {
    it('should return an instance of SearchDto with balance field set when query is an address, where the balance address matches the query', async () => {
      const balanceOne = await searchResolvers.search(balanceHashOne)
      const balanceTwo = await searchResolvers.search(balanceHashTwo)

      // check that distinct objects are returned based on hash and that they do not equal each other

      expect(balanceOne).not.toBeNull()
      expect(balanceOne).toBeInstanceOf(SearchDto)
      expect(balanceOne).toHaveProperty('type', SearchType.Address)
      expect(balanceOne).toHaveProperty('address', { id: { balanceType: 'ETHER', address: balanceHashOne } })

      expect(balanceTwo).not.toBeNull()
      expect(balanceTwo).toBeInstanceOf(SearchDto)
      expect(balanceOne).toHaveProperty('type', SearchType.Address)
      expect(balanceTwo).toHaveProperty('address', { id: { balanceType: 'ETHER', address: balanceHashTwo } })

      expect(balanceOne).not.toEqual(balanceTwo)
    })

    it('should return an instance of SearchDto with block field set when query is a block hash, where the block hash matches the query', async () => {
      const blockOne = await searchResolvers.search(blockHashOne)
      const blockTwo = await searchResolvers.search(blockHashTwo)

      // check that distinct objects are returned based on hash and that they do not equal each other

      expect(blockOne).not.toBeNull()
      expect(blockOne).toBeInstanceOf(SearchDto)
      expect(blockOne).toHaveProperty('type', SearchType.Block)
      expect(blockOne).toHaveProperty('block', { id: 1, header: { hash: blockHashOne } })

      expect(blockTwo).not.toBeNull()
      expect(blockTwo).toBeInstanceOf(SearchDto)
      expect(blockOne).toHaveProperty('type', SearchType.Block)
      expect(blockTwo).toHaveProperty('block', { id: 2, header: { hash: blockHashTwo } })

      expect(blockOne).not.toEqual(blockTwo)
    })

    it('should return an instance of SearchDto with tx field set when query is a tx hash, where the tx hash matches the query', async () => {
      const txOne = await searchResolvers.search(txHashOne)
      const txTwo = await searchResolvers.search(txHashTwo)

      // check that distinct objects are returned based on hash and that they do not equal each other

      expect(txOne).not.toBeNull()
      expect(txOne).toBeInstanceOf(SearchDto)
      expect(txOne).toHaveProperty('type', SearchType.Tx)
      expect(txOne).toHaveProperty('tx', { id: txHashOne })

      expect(txTwo).not.toBeNull()
      expect(txTwo).toBeInstanceOf(SearchDto)
      expect(txOne).toHaveProperty('type', SearchType.Tx)
      expect(txTwo).toHaveProperty('tx', { id: txHashTwo })

      expect(txOne).not.toEqual(txTwo)
    })

    it('should return an instance of SearchDto with uncle field set when query is an uncle hash, where the uncle hash matches the query', async () => {
      const uncleOne = await searchResolvers.search(uncleHashOne)
      const uncleTwo = await searchResolvers.search(uncleHashTwo)

      // check that distinct objects are returned based on hash and that they do not equal each other

      expect(uncleOne).not.toBeNull()
      expect(uncleOne).toBeInstanceOf(SearchDto)
      expect(uncleOne).toHaveProperty('type', SearchType.Uncle)
      expect(uncleOne).toHaveProperty('uncle', { id: uncleHashOne })

      expect(uncleTwo).not.toBeNull()
      expect(uncleTwo).toBeInstanceOf(SearchDto)
      expect(uncleOne).toHaveProperty('type', SearchType.Uncle)
      expect(uncleTwo).toHaveProperty('uncle', { id: uncleHashTwo })

      expect(uncleOne).not.toEqual(uncleTwo)
    })

    it('should return a SearchDto entity with type None and address/block/tx/uncle fields not set when query does not match the hash of any of these types', async () => {
      const balanceThree = await searchResolvers.search(balanceHashThree)
      const blockThree = await searchResolvers.search(blockHashThree)
      const txThree = await searchResolvers.search(txHashThree)
      const uncleThree = await searchResolvers.search(uncleHashThree)

      expect(balanceThree).not.toBeNull()
      expect(balanceThree).toBeInstanceOf(SearchDto)
      expect(balanceThree).toHaveProperty('type', SearchType.None)
      expect(balanceThree).not.toHaveProperty('address')

      expect(blockThree).not.toBeNull()
      expect(blockThree).toBeInstanceOf(SearchDto)
      expect(blockThree).toHaveProperty('type', SearchType.None)
      expect(blockThree).not.toHaveProperty('block')

      expect(txThree).not.toBeNull()
      expect(txThree).toBeInstanceOf(SearchDto)
      expect(txThree).toHaveProperty('type', SearchType.None)
      expect(txThree).not.toHaveProperty('tx')

      expect(uncleThree).not.toBeNull()
      expect(uncleThree).toBeInstanceOf(SearchDto)
      expect(uncleThree).toHaveProperty('type', SearchType.None)
      expect(uncleThree).not.toHaveProperty('uncle')
    })
  })
})
