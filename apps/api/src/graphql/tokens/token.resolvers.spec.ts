import { Test } from '@nestjs/testing'
import { EthService } from '../../shared/eth.service'
import { TokenHoldersPageDto } from './dto/token-holders-page.dto'
import { Erc20BalanceEntity } from '../../orm/entities/erc20-balance.entity'
import { Erc721BalanceEntity } from '../../orm/entities/erc721-balance.entity'
import { TokenResolvers } from './token.resolvers'
import { TokenService } from '../../dao/token.service'
import { TokenHolderDto } from './dto/token-holder.dto'
import { TokenBalanceDto } from './dto/token-balance.dto'
import { TokenBalancePageDto } from './dto/token-balance-page.dto'
import BigNumber from 'bignumber.js'
import { CoinExchangeRateEntity } from '../../orm/entities/coin-exchange-rate.entity'
import { ExchangeRatePair, TokenExchangeRateFilter } from '../schema'
import { CoinExchangeRateDto } from './dto/coin-exchange-rate.dto'
import { TokenExchangeRateEntity } from '../../orm/entities/token-exchange-rate.entity'
import { TokenExchangeRatePageDto } from './dto/token-exchange-rate-page.dto'
import { TokenExchangeRateDto } from './dto/token-exchange-rate.dto'
import { TokenMetadataDto } from './dto/token-metadata.dto'
import { MetadataService } from '../../dao/metadata.service'
import { TokenMetadataEntity } from '../../orm/entities/token-metadata.entity'
import { Erc20MetadataEntity } from '../../orm/entities/erc20-metadata.entity'

const contractAddressOne = '0000000000000000000000000000000000000001'
const contractAddressTwo = '0000000000000000000000000000000000000002'
const contractAddressThree = '0000000000000000000000000000000000000003'
const contractAddressFour = '0000000000000000000000000000000000000004'
const contractAddressFive = '0000000000000000000000000000000000000005'

const holderOne = '0x000000000000000000000000000000000000001'
const holderTwo = '0x000000000000000000000000000000000000002'
const holderThree = '0x000000000000000000000000000000000000003'
const holderFour = '0x000000000000000000000000000000000000004'
const holderFive = '0x000000000000000000000000000000000000005'

const tokenMetadataOne: Erc20MetadataEntity =  {
  name: 'Token 1',
  symbol: 'T1',
  address: contractAddressOne
}
const tokenMetadataTwo: Erc20MetadataEntity = {
  name: 'Token 2',
  symbol: 'T2',
  address: contractAddressTwo
}
const tokenMetadataThree: Erc20MetadataEntity = {
  name: 'Token 3',
  symbol: 'T3',
  address: contractAddressThree
}

const tokenMetadata = [
  tokenMetadataOne,
  tokenMetadataTwo,
  tokenMetadataThree
]

const tokenExchangeRates: TokenExchangeRateEntity[] = [
  {
    address: contractAddressOne,
    currentPrice: new BigNumber(1),
    totalVolume: new BigNumber(1000),
    marketCap: new BigNumber(10),
    marketCapRank: 1,
    symbol: 'T1',
    name: 'Token 1'
  },
  {
    address: contractAddressTwo,
    currentPrice: new BigNumber(2),
    totalVolume: new BigNumber(2000),
    marketCap: new BigNumber(9),
    marketCapRank: 2,
    symbol: 'T2',
    name: 'Token 2'
  },
  {
    address: contractAddressThree,
    currentPrice: new BigNumber(3),
    totalVolume: new BigNumber(3000),
    marketCap: new BigNumber(8),
    marketCapRank: 3,
    symbol: 'T3',
    name: 'Token 3'
  },
  {
    address: contractAddressFour,
    currentPrice: new BigNumber(4),
    totalVolume: new BigNumber(4000),
    marketCap: new BigNumber(7),
    marketCapRank: 4,
    symbol: 'T4',
    name: 'Token 4'
  }
]

const erc20Balances: Erc20BalanceEntity[] = [
  {
    address: holderOne,
    amount: new BigNumber(100),
    contract: contractAddressOne,
    metadata: tokenMetadataOne,
    tokenExchangeRate: tokenExchangeRates[0]
  },
  {
    address: holderTwo,
    amount: new BigNumber(200),
    contract: contractAddressOne,
    metadata: tokenMetadataOne,
    tokenExchangeRate: tokenExchangeRates[0]
  },
  {
    address: holderOne,
    amount: new BigNumber(300),
    contract: contractAddressTwo,
    metadata: tokenMetadataTwo,
    tokenExchangeRate: tokenExchangeRates[1]
  },
  {
    address: holderTwo,
    amount: new BigNumber(100),
    contract: contractAddressTwo,
    metadata: tokenMetadataTwo,
    tokenExchangeRate: tokenExchangeRates[1]
    },
  {
    address: holderThree,
    amount: new BigNumber(400),
    contract: contractAddressTwo,
    metadata: tokenMetadataTwo,
    tokenExchangeRate: tokenExchangeRates[1]
  },
  {
    address: holderFour,
    amount: new BigNumber(300),
    contract: contractAddressTwo,
    metadata: tokenMetadataTwo,
    tokenExchangeRate: tokenExchangeRates[1]
    },
  {
    address: holderOne,
    amount: new BigNumber(500),
    contract: contractAddressThree,
    metadata: tokenMetadataThree,
    tokenExchangeRate: tokenExchangeRates[2]
  },
]

const coinExchangeRates = [
  {
    id: ExchangeRatePair.ethereum_usd,
    currency: 'usd',
    price: 250
  },
  {
    id: 'bitcoin_usd',
    currency: 'usd',
    price: 8000
  }
]

const metadataServiceMock = {
  async isSyncing() {
    return false
  }
}

const tokenServiceMock = {
  async findTokenHolders(address, limit = 10, offset = 0): Promise<[Erc20BalanceEntity[], number]>  {

    let items = erc20Balances.filter(t => t.contract === address)
    const totalCount = items.length

    items = items.slice(offset, offset + limit)

    return [items.map(e => new Erc20BalanceEntity(e)), totalCount]
  },
  async findTokenHolder(tokenAddress: string, holderAddress: string): Promise<Erc20BalanceEntity | Erc721BalanceEntity | undefined> {

    const item = erc20Balances.find(e => e.address === holderAddress && e.contract === tokenAddress)

    return item ? new Erc20BalanceEntity(item) : undefined
  },
  async findAddressAllErc20TokensOwned(address: string, offset: number = 0, limit: number = 10): Promise<[Erc20BalanceEntity[], number]> {

    let items = erc20Balances.filter(e => e.address === address)
    const totalCount = items.length

    items = items.slice(offset, offset + limit)

    return [items, totalCount]
  },
  async totalValueUSDByAddress(address: string): Promise<BigNumber | undefined> {

    const items = erc20Balances.filter(e => e.address === address)

    if (items.length) {
      const sum = items.reduce((memo, next) => {
        const { tokenExchangeRate } = next
        memo += (next.amount.multipliedBy(tokenExchangeRate!.currentPrice!).toNumber())
        return memo
      }, 0)
      return new BigNumber(sum)
    }

    return undefined
  },
  async findCoinExchangeRate(pair: string): Promise<CoinExchangeRateEntity | undefined> {
    const item = coinExchangeRates.find(c => c.id === pair)
    return item ? new CoinExchangeRateEntity(item) : undefined
  },
  async findTokenExchangeRates(
    sort: string = 'market_cap_rank',
    limit: number = 10,
    offset: number = 0,
    addresses: string[] = [],
  ): Promise<[TokenExchangeRateEntity[], number]> {

    // Filter by symbol if set
    let items = addresses.length ?
      tokenExchangeRates.filter(t => addresses.includes(t.address)) :
      tokenExchangeRates

    // Total count
    const totalCount = items.length

    // Sort

    switch (sort) {
      case 'price_high':
        items = items.sort((a,b) => b.currentPrice!.minus(a.currentPrice!).toNumber())
        break
      case 'price_low':
        items = items.sort((a,b) => a.currentPrice!.minus(b.currentPrice!).toNumber())
        break
      case 'volume_high':
        items = items.sort((a,b) => b.totalVolume!.minus(a.totalVolume!).toNumber())
        break
      case 'volume_low':
        items = items.sort((a,b) => a.totalVolume!.minus(b.totalVolume!).toNumber())
        break
      case 'market_cap_high':
        items = items.sort((a,b) => b.marketCap!.minus(a.marketCap!).toNumber())
        break
      case 'market_cap_low':
        items = items.sort((a,b) => a.marketCap!.minus(b.marketCap!).toNumber())
        break
      case 'market_cap_rank':
      default:
        items = items.sort((a,b) => a.marketCapRank! - b.marketCapRank!)
        break
    }

    // Paging
    items = items.slice(offset, offset + limit)

    return [items.map(i => new TokenExchangeRateEntity(i)), totalCount]
  },
  async countTokenExchangeRates(): Promise<number> {
    return tokenExchangeRates.length
  },
  async findTokenExchangeRateBySymbol(symbol: string): Promise<TokenExchangeRateEntity | undefined> {
    const item = tokenExchangeRates.find(t => t.symbol === symbol)
    return item ? new TokenExchangeRateEntity(item) : undefined
  },
  async findTokenExchangeRateByAddress(address: string): Promise<TokenExchangeRateEntity | undefined> {
    const item = tokenExchangeRates.find(t => t.address === address)
    return item ? new TokenExchangeRateEntity(item) : undefined
  },
  async countTokenHolders(address: string): Promise<number> {
    return erc20Balances.filter(e => e.contract === address).length
  },
  async findTokensMetadata(
    symbols: string[] = [],
    names: string[] = [],
    addresses: string[] = [],
    offset: number = 0,
    limit: number = 20,
  ): Promise<[TokenMetadataEntity[], number]> {
    let items = symbols.length || names.length || addresses.length ?
      tokenMetadata.filter(t => symbols.includes(t.symbol!) || names.includes(t.name!) || addresses.includes(t.address)) :
      tokenMetadata

    const totalCount = items.length

    items = items.slice(offset, offset + limit)

    return [items.map(i => new TokenMetadataEntity(i)), totalCount]
  }
}

describe('TokenResolvers', () => {
  let tokenTransferService: TokenService
  let tokenResolvers: TokenResolvers

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TokenResolvers,
        EthService,
        {
          provide: TokenService,
          useValue: tokenServiceMock
        },
        {
          provide: MetadataService,
          useValue: metadataServiceMock
        }
      ]
    }).compile()
    tokenTransferService = module.get<TokenService>(TokenService)
    tokenResolvers = module.get<TokenResolvers>(TokenResolvers)
  })

  describe('tokenHolders', () => {
    it('should return an instance of TokenHoldersPageDto with an array of TokenHolderDto and totalCount for the contract address provided', async () => {
      const tokenHoldersPage = await tokenResolvers.tokenHolders(contractAddressOne, 0, 10)

      expect(tokenHoldersPage).not.toBeNull()
      expect(tokenHoldersPage).toBeInstanceOf(TokenHoldersPageDto)
      expect(tokenHoldersPage).toHaveProperty('items')
      expect(tokenHoldersPage).toHaveProperty('totalCount', 2)
      expect(tokenHoldersPage.items).toHaveLength(2)
      expect(tokenHoldersPage.items[0]).toBeInstanceOf(TokenHolderDto)
      expect(tokenHoldersPage.items[0]).toHaveProperty('contract', contractAddressOne)
    })

    it('should respect the given offset and limit parameters', async () => {

      const tokenHoldersPageOne = await tokenResolvers.tokenHolders(contractAddressTwo, 0, 2)

      expect(tokenHoldersPageOne).not.toBeNull()
      expect(tokenHoldersPageOne).toBeInstanceOf(TokenHoldersPageDto)
      expect(tokenHoldersPageOne).toHaveProperty('items')
      expect(tokenHoldersPageOne).toHaveProperty('totalCount', 4)
      expect(tokenHoldersPageOne.items).toHaveLength(2)
      expect(tokenHoldersPageOne.items[0]).toBeInstanceOf(TokenHolderDto)
      expect(tokenHoldersPageOne.items[0]).toHaveProperty('contract', contractAddressTwo)
      expect(tokenHoldersPageOne.items[0]).toHaveProperty('address', holderOne)
      expect(tokenHoldersPageOne.items[1]).toBeInstanceOf(TokenHolderDto)
      expect(tokenHoldersPageOne.items[1]).toHaveProperty('contract', contractAddressTwo)
      expect(tokenHoldersPageOne.items[1]).toHaveProperty('address', holderTwo)

      const tokenHoldersPageTwo = await tokenResolvers.tokenHolders(contractAddressTwo, 2, 2)

      expect(tokenHoldersPageTwo).not.toBeNull()
      expect(tokenHoldersPageTwo).toBeInstanceOf(TokenHoldersPageDto)
      expect(tokenHoldersPageTwo).toHaveProperty('items')
      expect(tokenHoldersPageTwo).toHaveProperty('totalCount', 4)
      expect(tokenHoldersPageTwo.items).toHaveLength(2)
      expect(tokenHoldersPageTwo.items[0]).toBeInstanceOf(TokenHolderDto)
      expect(tokenHoldersPageTwo.items[0]).toHaveProperty('contract', contractAddressTwo)
      expect(tokenHoldersPageTwo.items[0]).toHaveProperty('address', holderThree)
      expect(tokenHoldersPageTwo.items[1]).toBeInstanceOf(TokenHolderDto)
      expect(tokenHoldersPageTwo.items[1]).toHaveProperty('contract', contractAddressTwo)
      expect(tokenHoldersPageTwo.items[1]).toHaveProperty('address', holderFour)

      expect(tokenHoldersPageOne).not.toEqual(tokenHoldersPageTwo)

      // Empty array of items should be returned if offset >= totalCount
      const tokenHoldersPageThree = await tokenResolvers.tokenHolders(contractAddressTwo, 4, 2)

      expect(tokenHoldersPageThree).not.toBeNull()
      expect(tokenHoldersPageThree).toBeInstanceOf(TokenHoldersPageDto)
      expect(tokenHoldersPageThree).toHaveProperty('items')
      expect(tokenHoldersPageThree).toHaveProperty('totalCount', 4)
      expect(tokenHoldersPageThree.items).toHaveLength(0)

    })

    it('should return an instance of TokenHoldersPageDto with an empty items array if no token holders are found', async () => {

      const tokenHoldersPage = await tokenResolvers.tokenHolders(contractAddressFour, 0, 10)

      expect(tokenHoldersPage).not.toBeNull()
      expect(tokenHoldersPage).toBeInstanceOf(TokenHoldersPageDto)
      expect(tokenHoldersPage).toHaveProperty('items')
      expect(tokenHoldersPage).toHaveProperty('totalCount', 0)
      expect(tokenHoldersPage.items).toHaveLength(0)

    })

  })

  describe('tokenHolder', () => {
    it('should return an instance of TokenHolderDto matching the holderAddress provided', async () => {

      const tokenHolderContractOne = await tokenResolvers.tokenHolder(contractAddressOne, holderOne)
      const tokenHolderContractTwo = await tokenResolvers.tokenHolder(contractAddressTwo, holderOne)

      // check that distinct objects are returned based on address and holderAddress and that they do not equal each other

      expect(tokenHolderContractOne).not.toBeNull()
      expect(tokenHolderContractOne).toBeInstanceOf(TokenHolderDto)
      expect(tokenHolderContractOne).toHaveProperty('address', holderOne)

      expect(tokenHolderContractTwo).not.toBeNull()
      expect(tokenHolderContractTwo).toBeInstanceOf(TokenHolderDto)
      expect(tokenHolderContractTwo).toHaveProperty('address', holderOne)

      expect(tokenHolderContractOne).not.toEqual(tokenHolderContractTwo)

    })

    it('should return undefined if no matching token holder is found', async () => {
      expect(await tokenResolvers.tokenHolder(contractAddressFour, holderOne)).toBeNull()
    })
  })

  describe('addressAllTokensOwned', () => {
    it('should return an instance of TokenPageDto with an array of TokenDto and totalCount for the address provided', async () => {
      const tokenPage = await tokenResolvers.addressAllTokensOwned(holderOne, 0, 10)

      expect(tokenPage).not.toBeNull()
      expect(tokenPage).toBeInstanceOf(TokenBalancePageDto)
      expect(tokenPage).toHaveProperty('items')
      expect(tokenPage).toHaveProperty('totalCount', 3)
      expect(tokenPage.items).toHaveLength(3)
      expect(tokenPage.items[0]).toBeInstanceOf(TokenBalanceDto)
      expect(tokenPage.items[0]).toHaveProperty('address', holderOne)
      expect(tokenPage.items[0]).toHaveProperty('contract', contractAddressOne)
      expect(tokenPage.items[1]).toBeInstanceOf(TokenBalanceDto)
      expect(tokenPage.items[1]).toHaveProperty('address', holderOne)
      expect(tokenPage.items[1]).toHaveProperty('contract', contractAddressTwo)
      expect(tokenPage.items[2]).toBeInstanceOf(TokenBalanceDto)
      expect(tokenPage.items[2]).toHaveProperty('address', holderOne)
      expect(tokenPage.items[2]).toHaveProperty('contract', contractAddressThree)
    })

    it('should respect the given offset and limit parameters', async () => {

      const tokensPageOne = await tokenResolvers.addressAllTokensOwned(holderOne, 0, 2)

      expect(tokensPageOne).not.toBeNull()
      expect(tokensPageOne).toBeInstanceOf(TokenBalancePageDto)
      expect(tokensPageOne).toHaveProperty('items')
      expect(tokensPageOne).toHaveProperty('totalCount', 3)
      expect(tokensPageOne.items).toHaveLength(2)
      expect(tokensPageOne.items[0]).toBeInstanceOf(TokenBalanceDto)
      expect(tokensPageOne.items[0]).toHaveProperty('contract', contractAddressOne)
      expect(tokensPageOne.items[1]).toBeInstanceOf(TokenBalanceDto)
      expect(tokensPageOne.items[1]).toHaveProperty('contract', contractAddressTwo)

      const tokensPageTwo = await tokenResolvers.addressAllTokensOwned(holderOne, 2, 2)

      expect(tokensPageTwo).not.toBeNull()
      expect(tokensPageTwo).toBeInstanceOf(TokenBalancePageDto)
      expect(tokensPageTwo).toHaveProperty('items')
      expect(tokensPageTwo).toHaveProperty('totalCount', 3)
      expect(tokensPageTwo.items).toHaveLength(1)
      expect(tokensPageTwo.items[0]).toBeInstanceOf(TokenBalanceDto)
      expect(tokensPageTwo.items[0]).toHaveProperty('contract', contractAddressThree)

      expect(tokensPageOne).not.toEqual(tokensPageTwo)

      // Empty array of items should be returned if offset >= totalCount
      const tokenPageThree = await tokenResolvers.addressAllTokensOwned(holderOne, 4, 2)

      expect(tokenPageThree).not.toBeNull()
      expect(tokenPageThree).toBeInstanceOf(TokenBalancePageDto)
      expect(tokenPageThree).toHaveProperty('items')
      expect(tokenPageThree).toHaveProperty('totalCount', 3)
      expect(tokenPageThree.items).toHaveLength(0)

    })

    it('should return an instance of TokenPageDto with an empty items array if no token holders are found', async () => {

      const tokenPage = await tokenResolvers.addressAllTokensOwned(holderFive, 0, 10)

      expect(tokenPage).not.toBeNull()
      expect(tokenPage).toBeInstanceOf(TokenBalancePageDto)
      expect(tokenPage).toHaveProperty('items')
      expect(tokenPage).toHaveProperty('totalCount', 0)
      expect(tokenPage.items).toHaveLength(0)

    })
  })

  describe('addressTotalTokenValueUSD', () => {
    it('should return an instance of BigNumber if there are erc20Balances matching the address', async () => {

      const totalValue = await tokenResolvers.addressTotalTokenValueUSD(holderOne)
      expect(totalValue).not.toBeNull()
      expect(totalValue).toBeInstanceOf(BigNumber)

      const totalValueTwo = await tokenResolvers.addressTotalTokenValueUSD(holderTwo)
      expect(totalValueTwo).not.toBeNull()
      expect(totalValueTwo).toBeInstanceOf(BigNumber)

      // Ensure distinct responses are returned for different addresses
      expect(totalValue).not.toEqual(totalValueTwo)
    })

    it('should return undefined if there are no erc20Balances matching the address', async () => {

      const totalValue = await tokenResolvers.addressTotalTokenValueUSD(holderFive)
      expect(totalValue).toBeUndefined()
    })

    it('should return a BigNumber matching the total value in USD of all erc20 tokens held by address', async () => {

      const totalValue = await tokenResolvers.addressTotalTokenValueUSD(holderOne)
      const expectedValue = erc20Balances
        .filter(e => e.address === holderOne)
        .reduce((memo, next) => memo += (next.amount.multipliedBy(next.tokenExchangeRate!.currentPrice!).toNumber()), 0)

      expect(totalValue).not.toBeNull()
      expect(totalValue).toEqual(new BigNumber(expectedValue))
    })

  })

  describe('coinExchangeRate', () => {
    it('should return an instance of CoinExchangeRateDto matching the pair provided', async () => {

      const coinExchangeRateEthereum = await tokenResolvers.coinExchangeRate(ExchangeRatePair.ethereum_usd)

      expect(coinExchangeRateEthereum).not.toBeNull()
      expect(coinExchangeRateEthereum).toBeInstanceOf(CoinExchangeRateDto)
      expect(coinExchangeRateEthereum).toHaveProperty('currency', 'usd')

      const coinExchangeRateBitcoin = await tokenResolvers.coinExchangeRate('bitcoin_usd')

      expect(coinExchangeRateBitcoin).not.toBeNull()
      expect(coinExchangeRateBitcoin).toBeInstanceOf(CoinExchangeRateDto)
      expect(coinExchangeRateBitcoin).toHaveProperty('currency', 'usd')

      // Ensure distinct items are returned for different pairs
      expect(coinExchangeRateEthereum).not.toEqual(coinExchangeRateBitcoin)
    })

    it('should return undefined for a pair for which there is no data', async () => {
      const coinExchangeRate = await tokenResolvers.coinExchangeRate('monero_usd')
      expect(coinExchangeRate).toBeUndefined()
    })
  })

  describe('tokenExchangeRates', () => {
    it('should return an instance of TokenExchangeRatePageDto with items and totalCount', async () => {

      const tokenExchangeRatesPage = await tokenResolvers.tokenExchangeRates([], TokenExchangeRateFilter.price_high, 10, 0)

      expect(tokenExchangeRatesPage).not.toBeNull()
      expect(tokenExchangeRatesPage).toBeInstanceOf(TokenExchangeRatePageDto)
      expect(tokenExchangeRatesPage).toHaveProperty('items')
      expect(tokenExchangeRatesPage).toHaveProperty('totalCount', 4)

      expect(tokenExchangeRatesPage.items).toHaveLength(4)
      expect(tokenExchangeRatesPage.items[0]).toBeInstanceOf(TokenExchangeRateDto)
    })

    it('should respect given offset and limit parameters', async () => {

      const pageOne = await tokenResolvers.tokenExchangeRates([], TokenExchangeRateFilter.price_high, 2, 0)

      expect(pageOne).not.toBeNull()
      expect(pageOne).toBeInstanceOf(TokenExchangeRatePageDto)
      expect(pageOne).toHaveProperty('items')
      expect(pageOne).toHaveProperty('totalCount', 4)

      expect(pageOne.items).toHaveLength(2)
      expect(pageOne.items[0]).toHaveProperty('address', contractAddressFour)
      expect(pageOne.items[0]).toHaveProperty('currentPrice', new BigNumber(4))
      expect(pageOne.items[1]).toHaveProperty('address', contractAddressThree)
      expect(pageOne.items[1]).toHaveProperty('currentPrice', new BigNumber(3))

      const pageTwo = await tokenResolvers.tokenExchangeRates([], TokenExchangeRateFilter.price_high, 2, 2)

      expect(pageTwo).not.toBeNull()
      expect(pageTwo).toBeInstanceOf(TokenExchangeRatePageDto)
      expect(pageTwo).toHaveProperty('items')
      expect(pageTwo).toHaveProperty('totalCount', 4)

      expect(pageTwo.items).toHaveLength(2)
      expect(pageTwo.items[0]).toHaveProperty('address', contractAddressTwo)
      expect(pageTwo.items[0]).toHaveProperty('currentPrice', new BigNumber(2))
      expect(pageTwo.items[1]).toHaveProperty('address', contractAddressOne)
      expect(pageTwo.items[1]).toHaveProperty('currentPrice', new BigNumber(1))

      // Ensure pages returned are distinct
      expect(pageOne).not.toEqual(pageTwo)

      // Check an empty array is returned if offset >= totalCount

      const pageThree = await tokenResolvers.tokenExchangeRates([], TokenExchangeRateFilter.price_high, 2, 4)

      expect(pageThree).not.toBeNull()
      expect(pageThree).toBeInstanceOf(TokenExchangeRatePageDto)
      expect(pageThree).toHaveProperty('items')
      expect(pageThree).toHaveProperty('totalCount', 4)
      expect(pageThree.items).toHaveLength(0)
    })

    it('should filter by provided addresses array', async () => {

      const pageOne = await tokenResolvers.tokenExchangeRates([contractAddressOne, contractAddressTwo], TokenExchangeRateFilter.price_high, 10, 0)
      expect(pageOne).not.toBeNull()
      expect(pageOne).toBeInstanceOf(TokenExchangeRatePageDto)
      expect(pageOne).toHaveProperty('items')
      expect(pageOne).toHaveProperty('totalCount', 2)
      expect(pageOne.items).toHaveLength(2)
      expect(pageOne.items[0]).toHaveProperty('address', contractAddressTwo)
      expect(pageOne.items[1]).toHaveProperty('address', contractAddressOne)

      const pageTwo = await tokenResolvers.tokenExchangeRates([contractAddressFour], TokenExchangeRateFilter.price_high, 10, 0)
      expect(pageTwo).not.toBeNull()
      expect(pageTwo).toBeInstanceOf(TokenExchangeRatePageDto)
      expect(pageTwo).toHaveProperty('items')
      expect(pageTwo).toHaveProperty('totalCount', 1)
      expect(pageTwo.items).toHaveLength(1)
      expect(pageTwo.items[0]).toHaveProperty('address', contractAddressFour)

      expect(pageOne).not.toEqual(pageTwo)

      // Ensure page with no items is returned for symbol not matching data

      const pageThree = await tokenResolvers.tokenExchangeRates([contractAddressFive], TokenExchangeRateFilter.price_high, 10, 0)
      expect(pageThree).not.toBeNull()
      expect(pageThree).toBeInstanceOf(TokenExchangeRatePageDto)
      expect(pageThree).toHaveProperty('items')
      expect(pageThree).toHaveProperty('totalCount', 0)
      expect(pageThree.items).toHaveLength(0)

    })

    it('should sort items array by the given sort parameter', async () => {

      const priceHighPage = await tokenResolvers.tokenExchangeRates([], TokenExchangeRateFilter.price_high, 2, 0)
      expect(priceHighPage).not.toBeNull()
      expect(priceHighPage).toHaveProperty('items')
      expect(priceHighPage).toHaveProperty('totalCount', 4)
      expect(priceHighPage.items).toHaveLength(2)
      expect(priceHighPage.items[0]).toHaveProperty('currentPrice', new BigNumber(4))
      expect(priceHighPage.items[1]).toHaveProperty('currentPrice', new BigNumber(3))

      const priceLowPage = await tokenResolvers.tokenExchangeRates([], TokenExchangeRateFilter.price_low, 2, 0)
      expect(priceLowPage).not.toBeNull()
      expect(priceLowPage).toHaveProperty('items')
      expect(priceLowPage).toHaveProperty('totalCount', 4)
      expect(priceLowPage.items).toHaveLength(2)
      expect(priceLowPage.items[0]).toHaveProperty('currentPrice', new BigNumber(1))
      expect(priceLowPage.items[1]).toHaveProperty('currentPrice', new BigNumber(2))

      const volumeHighPage = await tokenResolvers.tokenExchangeRates([], TokenExchangeRateFilter.volume_high, 2, 0)
      expect(volumeHighPage).not.toBeNull()
      expect(volumeHighPage).toHaveProperty('items')
      expect(volumeHighPage).toHaveProperty('totalCount', 4)
      expect(volumeHighPage.items).toHaveLength(2)
      expect(volumeHighPage.items[0]).toHaveProperty('totalVolume', new BigNumber(4000))
      expect(volumeHighPage.items[1]).toHaveProperty('totalVolume', new BigNumber(3000))

      const volumeLowPage = await tokenResolvers.tokenExchangeRates([], TokenExchangeRateFilter.volume_low, 2, 0)
      expect(volumeLowPage).not.toBeNull()
      expect(volumeLowPage).toHaveProperty('items')
      expect(volumeLowPage).toHaveProperty('totalCount', 4)
      expect(volumeLowPage.items).toHaveLength(2)
      expect(volumeLowPage.items[0]).toHaveProperty('totalVolume', new BigNumber(1000))
      expect(volumeLowPage.items[1]).toHaveProperty('totalVolume', new BigNumber(2000))

      const marketCapHighPage = await tokenResolvers.tokenExchangeRates([], TokenExchangeRateFilter.market_cap_high, 2, 0)
      expect(marketCapHighPage).not.toBeNull()
      expect(marketCapHighPage).toHaveProperty('items')
      expect(marketCapHighPage).toHaveProperty('totalCount', 4)
      expect(marketCapHighPage.items).toHaveLength(2)
      expect(marketCapHighPage.items[0]).toHaveProperty('marketCap', new BigNumber(10))
      expect(marketCapHighPage.items[1]).toHaveProperty('marketCap', new BigNumber(9))

      const marketCapLowPage = await tokenResolvers.tokenExchangeRates([], TokenExchangeRateFilter.market_cap_low, 2, 0)
      expect(marketCapLowPage).not.toBeNull()
      expect(marketCapLowPage).toHaveProperty('items')
      expect(marketCapLowPage).toHaveProperty('totalCount', 4)
      expect(marketCapLowPage.items).toHaveLength(2)
      expect(marketCapLowPage.items[0]).toHaveProperty('marketCap', new BigNumber(7))
      expect(marketCapLowPage.items[1]).toHaveProperty('marketCap', new BigNumber(8))

      const marketCapRankPage = await tokenResolvers.tokenExchangeRates([], TokenExchangeRateFilter.market_cap_rank, 2, 0)
      expect(marketCapRankPage).not.toBeNull()
      expect(marketCapRankPage).toHaveProperty('items')
      expect(marketCapRankPage).toHaveProperty('totalCount', 4)
      expect(marketCapRankPage.items).toHaveLength(2)
      expect(marketCapRankPage.items[0]).toHaveProperty('marketCapRank', 1)
      expect(marketCapRankPage.items[1]).toHaveProperty('marketCapRank', 2)
    })
  })

  describe('totalNumTokenExchangeRates', () => {
    it('should return a the total number of token exchange rates', async () => {
      const total = await tokenResolvers.totalNumTokenExchangeRates()
      expect(total).not.toBeNull()
      expect(total).toEqual(4)
    })
  })

  describe('tokenExchangeRateBySymbol', () => {
    it('should return an instance of TokenExchangeRateDto matching the symbol parameter', async () => {
      const tokenExchangeRateThree = await tokenResolvers.tokenExchangeRateBySymbol('T3')
      expect(tokenExchangeRateThree).not.toBeNull()
      expect(tokenExchangeRateThree).toBeInstanceOf(TokenExchangeRateDto)
      expect(tokenExchangeRateThree).toHaveProperty('symbol', 'T3')

      const tokenExchangeRateFour = await tokenResolvers.tokenExchangeRateBySymbol('T4')
      expect(tokenExchangeRateFour).not.toBeNull()
      expect(tokenExchangeRateFour).toBeInstanceOf(TokenExchangeRateDto)
      expect(tokenExchangeRateFour).toHaveProperty('symbol', 'T4')

      expect(tokenExchangeRateThree).not.toEqual(tokenExchangeRateFour)
    })

    it('should return null if a token exchange rate is not found matching the symbol parameter', async () => {
      const tokenExchangeRateFive = await tokenResolvers.tokenExchangeRateBySymbol('T5')
      expect(tokenExchangeRateFive).toBeNull()
    })
  })


  describe('tokenExchangeRateByAddress', () => {
    it('should return an instance of TokenExchangeRateDto matching the symbol parameter', async () => {
      const tokenExchangeRateThree = await tokenResolvers.tokenExchangeRateByAddress(contractAddressThree)
      expect(tokenExchangeRateThree).not.toBeNull()
      expect(tokenExchangeRateThree).toBeInstanceOf(TokenExchangeRateDto)
      expect(tokenExchangeRateThree).toHaveProperty('symbol', 'T3')

      const tokenExchangeRateFour = await tokenResolvers.tokenExchangeRateByAddress(contractAddressFour)
      expect(tokenExchangeRateFour).not.toBeNull()
      expect(tokenExchangeRateFour).toBeInstanceOf(TokenExchangeRateDto)
      expect(tokenExchangeRateFour).toHaveProperty('symbol', 'T4')

      expect(tokenExchangeRateThree).not.toEqual(tokenExchangeRateFour)
    })

    it('should return null if a token exchange rate is not found matching the symbol parameter', async () => {
      const tokenExchangeRateFive = await tokenResolvers.tokenExchangeRateByAddress(contractAddressFive)
      expect(tokenExchangeRateFive).toBeNull()
    })

    it('should return an instance of TokenExchangeRateDto with holdersCount set', async () => {
      const tokenExchangeRateTwo = await tokenResolvers.tokenExchangeRateByAddress(contractAddressTwo)
      expect(tokenExchangeRateTwo).not.toBeNull()
      expect(tokenExchangeRateTwo).toBeInstanceOf(TokenExchangeRateDto)
      expect(tokenExchangeRateTwo).toHaveProperty('symbol', 'T2')
      expect(tokenExchangeRateTwo).toHaveProperty('holdersCount', 4)
    })
  })

  describe('tokensMetadata', () => {
    it('should return an instance of TokenMetadataPageDto with an array of items and totalCount', async () => {
      const metadata = await tokenResolvers.tokensMetadata([])
      expect(metadata).not.toBeNull()
      expect(metadata).toHaveProperty('totalCount', 3)
      expect(metadata).toHaveProperty('items')
      expect(metadata.items).toHaveLength(3)
      expect(metadata.items[0]).toBeInstanceOf(TokenMetadataDto)
    })

    it('should return TokenMetadataDtos matching the addresses provided', async () => {
      const metadata = await tokenResolvers.tokensMetadata([contractAddressOne, contractAddressTwo])
      expect(metadata).not.toBeNull()
      expect(metadata).toHaveProperty('totalCount', 2)
      expect(metadata).toHaveProperty('items')
      expect(metadata.items).toHaveLength(2)
      expect(metadata.items[0]).toHaveProperty('address', contractAddressOne)
      expect(metadata.items[1]).toHaveProperty('address', contractAddressTwo)

      const metadataTwo = await tokenResolvers.tokensMetadata([contractAddressThree])
      expect(metadataTwo).not.toBeNull()
      expect(metadataTwo).toHaveProperty('totalCount', 1)
      expect(metadataTwo).toHaveProperty('items')
      expect(metadataTwo.items).toHaveLength(1)
      expect(metadataTwo.items[0]).toHaveProperty('address', contractAddressThree)

      expect(metadata).not.toEqual(metadataTwo)

      // Check an empty array is returned if no tokens match address provided
      const metadataThree = await tokenResolvers.tokensMetadata([contractAddressFive])
      expect(metadataThree).not.toBeNull()
      expect(metadataThree).toHaveProperty('totalCount', 0)
      expect(metadataThree).toHaveProperty('items')
      expect(metadataThree.items).toHaveLength(0)
    })
    it('should respect limit and offset parameters', async () => {
      const pageOne = await tokenResolvers.tokensMetadata([], 0, 2)
      expect(pageOne).not.toBeNull()
      expect(pageOne).toHaveProperty('totalCount', 3)
      expect(pageOne).toHaveProperty('items')
      expect(pageOne.items).toHaveLength(2)

      const pageTwo = await tokenResolvers.tokensMetadata([], 2, 2)
      expect(pageTwo).not.toBeNull()
      expect(pageTwo).toHaveProperty('totalCount', 3)
      expect(pageTwo).toHaveProperty('items')
      expect(pageTwo.items).toHaveLength(1)

      expect(pageOne).not.toEqual(pageTwo)
    })
  })

})
