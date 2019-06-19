import { Test } from '@nestjs/testing'
import { SearchResolvers } from './search.resolvers'
import { SearchDto } from './dto/search.dto'
import { SearchType } from '../schema'
import { SearchService } from '../../dao/search.service'
import { BlockDto } from '../blocks/dto/block.dto'
import { UncleDto } from '../uncles/dto/uncle.dto'
import { TxDto } from '../txs/dto/tx.dto'
import { AccountDto } from '../accounts/account.dto'
import { MetadataService } from '../../dao/metadata.service'
import { TokenSearchResultDto } from './dto/token-search-result.dto'

const addressHashOne = '0000000000000000000000000000000000000001'
const addressHashTwo = '0000000000000000000000000000000000000002'
const addressHashThreee = '0000000000000000000000000000000000000003'
const addressBalances = {
  '0000000000000000000000000000000000000001': {
    address: addressHashOne
  },
  '0000000000000000000000000000000000000002': {
    address: addressHashTwo
  }
}

const blockHashOne = '0x0000000000000000000000000000000000000000000000000000000000000001'
const blockHashTwo = '0x0000000000000000000000000000000000000000000000000000000000000002'
const blockHashThree = '0x0000000000000000000000000000000000000000000000000000000000000003'
const blocks = {
  '0x0000000000000000000000000000000000000000000000000000000000000001': {
    hash: blockHashOne
  },
  '0x0000000000000000000000000000000000000000000000000000000000000002': {
    hash: blockHashTwo
  }
}

const txHashOne = '0x0000000000000000000000000000000000000000000000000000000000000004'
const txHashTwo = '0x0000000000000000000000000000000000000000000000000000000000000005'
const txHashThree = '0x0000000000000000000000000000000000000000000000000000000000000006'
const txs = {
  '0x0000000000000000000000000000000000000000000000000000000000000004': {
    hash: txHashOne
  },
  '0x0000000000000000000000000000000000000000000000000000000000000005': {
    hash: txHashTwo
  }
}

const uncleHashOne = '0x0000000000000000000000000000000000000000000000000000000000000007'
const uncleHashTwo = '0x0000000000000000000000000000000000000000000000000000000000000008'
const uncleHashThree = '0x0000000000000000000000000000000000000000000000000000000000000009'
const uncles = {
  '0x0000000000000000000000000000000000000000000000000000000000000007': {
    hash: uncleHashOne
  },
  '0x0000000000000000000000000000000000000000000000000000000000000008': {
    hash: uncleHashTwo
  }
}

const contractAddressHash1 = '0x0000000000000001'
const contractAddressHash2 = '0x0000000000000002'
const contractAddressHash3 = '0x0000000000000003'
const contractAddressHash4 = '0x0000000000000004'
const tokensData = [
  {
    name: 'TokenA',
    symbol: 'A',
    address: contractAddressHash1,
    currentPrice: 1
  },
  {
    name: 'Token B',
    symbol: 'B',
    address: contractAddressHash2,
    currentPrice: 2
  },
  {
    name: 'Token C',
    symbol: 'C',
    address: contractAddressHash3
  },
  {
    name: 'test',
    symbol: 'T',
    address: contractAddressHash4
  }
]

const metadataServiceMock = {
  async isSyncing() {
    return false
  }
}

const searchServiceMock = {
  async search(query) {
    const s = new SearchDto({ type: SearchType.None })

    const balance = addressBalances[query]
    if (balance) {
      s.address = new AccountDto(balance)
      s.type = SearchType.Address
      return s
    }

    const block = blocks[query]
    if (block) {
      s.block = new BlockDto(block)
      s.type = SearchType.Block
      return s
    }

    const tx = txs[query]
    if (tx) {
      s.tx = new TxDto(tx)
      s.type = SearchType.Tx
      return s
    }

    const uncle = uncles[query]
    if (uncle) {
      s.uncle = new UncleDto(uncle)
      s.type = SearchType.Uncle
      return s
    }

    const tokens = tokensData.filter(t => t.name.toLowerCase().includes(query.toLowerCase()) ||  t.symbol.toLowerCase().includes(query.toLowerCase()))
    if (tokens.length) {
      s.type = SearchType.Token
      s.tokens = tokens.map(t => new TokenSearchResultDto(t))
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
          useValue: searchServiceMock
        },
        {
          provide: MetadataService,
          useValue: metadataServiceMock
        }
      ]
    }).compile()

    // fetch dependencies
    searchService = module.get<SearchService>(SearchService)
    searchResolvers = module.get<SearchResolvers>(SearchResolvers)
  })

  describe('search', () => {
    it('should return an instance of SearchDto with Type = SearchType.address and address field set when query matches an address', async () => {
      const balanceOne = await searchResolvers.search(addressHashOne)
      const balanceTwo = await searchResolvers.search(addressHashTwo)

      // check that distinct objects are returned based on hash and that they do not equal each other

      expect(balanceOne).not.toBeNull()
      expect(balanceOne).toBeInstanceOf(SearchDto)
      expect(balanceOne).toHaveProperty('type', SearchType.Address)
      expect(balanceOne).toHaveProperty('address', { address: addressHashOne, inTxCount: 0, outTxCount: 0, totalTxCount: 0 })

      expect(balanceTwo).not.toBeNull()
      expect(balanceTwo).toBeInstanceOf(SearchDto)
      expect(balanceOne).toHaveProperty('type', SearchType.Address)
      expect(balanceTwo).toHaveProperty('address', { address: addressHashTwo, inTxCount: 0, outTxCount: 0, totalTxCount: 0 })

      expect(balanceOne).not.toEqual(balanceTwo)

    })

    it('should return an instance of SearchDto with Type = SearchType.block and block field set when query matches a block', async () => {
      const blockOne = await searchResolvers.search(blockHashOne)
      const blockTwo = await searchResolvers.search(blockHashTwo)

      // check that distinct objects are returned based on hash and that they do not equal each other

      expect(blockOne).not.toBeNull()
      expect(blockOne).toBeInstanceOf(SearchDto)
      expect(blockOne).toHaveProperty('type', SearchType.Block)
      expect(blockOne).toHaveProperty('block')
      if (blockOne) {
        expect(blockOne.block).toHaveProperty('header')
        if (blockOne.block) {
          expect(blockOne.block.header).toHaveProperty('hash', blockHashOne)
        }
      }

      expect(blockTwo).not.toBeNull()
      expect(blockTwo).toBeInstanceOf(SearchDto)
      expect(blockOne).toHaveProperty('type', SearchType.Block)
      expect(blockTwo).toHaveProperty('block')
      if (blockTwo) {
        expect(blockTwo.block).toHaveProperty('header')
        if (blockTwo.block) {
          expect(blockTwo.block.header).toHaveProperty('hash', blockHashTwo)
        }
      }

      expect(blockOne).not.toEqual(blockTwo)
    })

    it('should return an instance of SearchDto with Type = SearchType.tx and tx field set when query matches a tx', async () => {
      const txOne = await searchResolvers.search(txHashOne)
      const txTwo = await searchResolvers.search(txHashTwo)

      // check that distinct objects are returned based on hash and that they do not equal each other

      expect(txOne).not.toBeNull()
      expect(txOne).toBeInstanceOf(SearchDto)
      expect(txOne).toHaveProperty('type', SearchType.Tx)
      expect(txOne).toHaveProperty('tx', { hash: txHashOne })

      expect(txTwo).not.toBeNull()
      expect(txTwo).toBeInstanceOf(SearchDto)
      expect(txOne).toHaveProperty('type', SearchType.Tx)
      expect(txTwo).toHaveProperty('tx', { hash: txHashTwo })

      expect(txOne).not.toEqual(txTwo)
    })

    it('should return an instance of SearchDto with Type = SearchType.uncle and uncle field set when query matches a uncle', async () => {
      const uncleOne = await searchResolvers.search(uncleHashOne)
      const uncleTwo = await searchResolvers.search(uncleHashTwo)

      // check that distinct objects are returned based on hash and that they do not equal each other

      expect(uncleOne).not.toBeNull()
      expect(uncleOne).toBeInstanceOf(SearchDto)
      expect(uncleOne).toHaveProperty('type', SearchType.Uncle)
      expect(uncleOne).toHaveProperty('uncle', { hash: uncleHashOne })

      expect(uncleTwo).not.toBeNull()
      expect(uncleTwo).toBeInstanceOf(SearchDto)
      expect(uncleOne).toHaveProperty('type', SearchType.Uncle)
      expect(uncleTwo).toHaveProperty('uncle', { hash: uncleHashTwo })

      expect(uncleOne).not.toEqual(uncleTwo)
    })

    it('should should return an instance of SearchDto with Type = SearchType.Token and tokens field set when query matches one or more tokens', async () => {
      const tokensOne = await searchResolvers.search('token')
      const tokensTwo = await searchResolvers.search('A')

      expect(tokensOne).not.toBeNull()
      expect(tokensOne).toBeInstanceOf(SearchDto)
      expect(tokensOne).toHaveProperty('type', SearchType.Token)
      expect(tokensOne).toHaveProperty('tokens')
      if (tokensOne) {
        expect(tokensOne.tokens).toHaveLength(3)
      }

      expect(tokensTwo).not.toBeNull()
      expect(tokensTwo).toBeInstanceOf(SearchDto)
      expect(tokensTwo).toHaveProperty('type', SearchType.Token)
      expect(tokensTwo).toHaveProperty('tokens')
      if (tokensTwo) {
        expect(tokensTwo.tokens).toHaveLength(1)
      }

      expect(tokensOne).not.toEqual(tokensTwo)

    })

    it('should return a SearchDto entity with type None and address/block/tx/uncle/tokens fields not set when query does not match any of these types', async () => {
      const balanceThree = await searchResolvers.search(addressHashThreee)
      const blockThree = await searchResolvers.search(blockHashThree)
      const txThree = await searchResolvers.search(txHashThree)
      const uncleThree = await searchResolvers.search(uncleHashThree)
      const tokensThree = await searchResolvers.search('foo')

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

      expect(tokensThree).not.toBeNull()
      expect(tokensThree).toBeInstanceOf(SearchDto)
      expect(tokensThree).toHaveProperty('type', SearchType.None)
      expect(tokensThree).not.toHaveProperty('tokens')
    })
  })
})
