import { Test } from '@nestjs/testing'
import { EthService } from '../../shared/eth.service'
import { ExchangeService } from './exchange.service'
import { TokenExchangeRateResolvers } from './token-exchange-rate.resolvers'
import { TokenTransferService } from '../token-transfers/token-transfer.service'
import { QuoteDto } from './quote.dto'
import { TokenExchangeRateEntity } from '../../orm/entities/token-exchange-rate.entity'
import { TokenExchangeRateDto } from './token-exchange-rate.dto'
import { EthplorerAddressInfoDto } from '../token-transfers/dto/ethplorer-address-info.dto'

const usd = 'USD'
const eur = 'EUR'
const coinGeckoQuotes = {
  'USD': {
    to: usd
  },
  'EUR': {
    to: eur
  }
}

const symbolOne = 'ABT'
const symbolTwo = '0XBTC'
const symbolThree = '1SG'
const symbolFour = '1ST'
const symbolFive = '1WO'
const symbolSix = 'ABYSS'

const addressOne = '0000000000000000000000000000000000000001'
const addressTwo = '0000000000000000000000000000000000000002'
const addressThree = '0000000000000000000000000000000000000003'
const addressFour = '0000000000000000000000000000000000000004'
const addressFive = '0000000000000000000000000000000000000005'
const addressSix = '0000000000000000000000000000000000000006'

const tokenExchangeRates = {
  'ABT': {
    id: symbolOne,
    address: addressOne,
    currentPrice: 1,
    totalVolume: 2,
    marketCap: 3,
    marketCapRank: 4
  },
  '0XBTC': {
    id: symbolTwo,
    address: addressTwo,
    currentPrice: 2,
    totalVolume: 3,
    marketCap: 4,
    marketCapRank: 5
  },
  '1SG': {
    id: symbolThree,
    address: addressThree,
    currentPrice: 3,
    totalVolume: 4,
    marketCap: 5,
    marketCapRank: 1
  },
  '1ST': {
    id: symbolFour,
    address: addressFour,
    currentPrice: 4,
    totalVolume: 5,
    marketCap: 1,
    marketCapRank: 2
  },
  '1WO': {
    id: symbolFive,
    address: addressFive,
    currentPrice: 5,
    totalVolume: 1,
    marketCap: 2,
    marketCapRank: 3
  }
}
const ethplorerTokenInfoResult = {
  balance: 0,
  totalIn: 0,
  totalOut: 0
}

const mockExchangeService = {
  async findQuote(symbol, to) {
    const data = coinGeckoQuotes[to]
    return data ? new QuoteDto(data) : null
  },
  async findTokenExchangeRates(filter, limit = 10, page = 0) {
    const start = limit * page
    const end = start + limit

    const exchangeRates = Object.values(tokenExchangeRates)
    let sorted

    switch (filter) {
      case 'price_high':
        sorted = exchangeRates.sort((a,b) => b.currentPrice - a.currentPrice)
        break
      case 'price_low':
        sorted = exchangeRates.sort((a,b) => a.currentPrice - b.currentPrice)
        break
      case 'volume_high':
        sorted = exchangeRates.sort((a,b) => b.totalVolume - a.totalVolume)
        break
      case 'volume_low':
        sorted = exchangeRates.sort((a,b) => a.totalVolume - b.totalVolume)
        break
      case 'market_cap_high':
        sorted = exchangeRates.sort((a,b) => b.marketCap - a.marketCap)
        break
      case 'market_cap_low':
        sorted = exchangeRates.sort((a,b) => a.marketCap - b.marketCap)
        break
      case 'market_cap_rank':
      default:
        sorted = exchangeRates.sort((a,b) => a.marketCapRank - b.marketCapRank)
        break
    }

    const items = sorted.slice(start, end)
    return items.map(i => new TokenExchangeRateEntity(i))

  },
  async countTokenExchangeRates() {
    return Object.keys(tokenExchangeRates).length
  },
  async findTokenExchangeRateBySymbol(symbol) {
    const data = tokenExchangeRates[symbol]
    return data ? new TokenExchangeRateEntity(data) : null
  },
  async findTokenExchangeRateByAddress(address) {
    const data = Object.values(tokenExchangeRates).find(t => t.address === address)
    return data ? new TokenExchangeRateEntity(data) : null
  }
}
const mockTokenTransferService = {
  async fetchTokenInfo(address) {
    const data = Object.values(tokenExchangeRates).find(t => t.address === address)
    return data ? new EthplorerAddressInfoDto(ethplorerTokenInfoResult) : null
  }
}

describe('TokenExchangeRateResolvers', () => {

  let exchangeService: ExchangeService
  let tokenTransferService: TokenTransferService
  let tokenExchangeRateResolvers: TokenExchangeRateResolvers

  beforeEach(async () => {

    // test module
    const module = await Test.createTestingModule({
      providers: [
        TokenExchangeRateResolvers,
        EthService,
        {
          provide: ExchangeService,
          useValue: mockExchangeService
        },
        {
          provide: TokenTransferService,
          useValue: mockTokenTransferService
        }
      ],
    }).compile()

    // fetch dependencies
    exchangeService = module.get<ExchangeService>(ExchangeService)
    tokenTransferService = module.get<TokenTransferService>(TokenTransferService)
    tokenExchangeRateResolvers = module.get<TokenExchangeRateResolvers>(TokenExchangeRateResolvers)
  })

  describe('quote', () => {

    it('should return null if quote does not exist for a given "to"', async () => {
      expect(await tokenExchangeRateResolvers.quote('ETH', 'GBP')).toEqual(null)
    })

    it('should return an instance of QuoteDto matching the "to" provided', async () => {

      const quoteOne = await tokenExchangeRateResolvers.quote('ETH', usd)
      const quoteTwo = await tokenExchangeRateResolvers.quote('ETH', eur)

      // check that distinct objects are returned based on hash and that they do not equal each other

      expect(quoteOne).not.toBeNull()
      expect(quoteOne).toBeInstanceOf(QuoteDto)
      expect(quoteOne).toHaveProperty('to', usd)

      expect(quoteTwo).not.toBeNull()
      expect(quoteTwo).toBeInstanceOf(QuoteDto)
      expect(quoteTwo).toHaveProperty('to', eur)

      expect(quoteOne).not.toEqual(quoteTwo)
    })
  })

  describe('tokenExchangeRates', () => {

    it('should return an array of TokenExchangeRateDto instances, respecting given limit and page parameters', async () => {

      const exchangeRatesOne = await tokenExchangeRateResolvers.tokenExchangeRates('price_low', 2, 0)
      expect(exchangeRatesOne).toHaveLength(2)
      expect(exchangeRatesOne[0]).toHaveProperty('id', symbolOne)
      expect(exchangeRatesOne[1]).toHaveProperty('id', symbolTwo)

      const exchangeRatesTwo = await tokenExchangeRateResolvers.tokenExchangeRates('price_low', 2, 1)
      expect(exchangeRatesTwo).toHaveLength(2)
      expect(exchangeRatesTwo[0]).toHaveProperty('id',symbolThree)
      expect(exchangeRatesTwo[1]).toHaveProperty('id', symbolFour)

      // Check an empty array is returned if no items available for requested page
      const exchangeRatesThree = await tokenExchangeRateResolvers.tokenExchangeRates('price_low',10, 1)
      expect(exchangeRatesThree).toHaveLength(0)

    })

    it('should convert an array of TokenExchangeRateEntity instances to an array of TokenExchangeRateDto instances', async () => {

      const tokenExchangeRates = await tokenExchangeRateResolvers.tokenExchangeRates('price_low')
      const expected = [
        new TokenExchangeRateDto({id: symbolOne, address: addressOne, currentPrice: 1, totalVolume: 2, marketCap: 3, marketCapRank: 4}),
        new TokenExchangeRateDto({id: symbolTwo, address: addressTwo, currentPrice: 2, totalVolume: 3, marketCap: 4, marketCapRank: 5}),
        new TokenExchangeRateDto({id: symbolThree, address: addressThree, currentPrice: 3, totalVolume: 4, marketCap: 5, marketCapRank: 1}),
        new TokenExchangeRateDto({id: symbolFour, address: addressFour, currentPrice: 4, totalVolume: 5, marketCap: 1, marketCapRank: 2}),
        new TokenExchangeRateDto({id: symbolFive, address: addressFive, currentPrice: 5, totalVolume: 1, marketCap: 2, marketCapRank: 3})
      ]
      expect(tokenExchangeRates).toEqual(expect.arrayContaining(expected))

    })

    it('should return an array of TokenExchangeRateDto sorted according to the given filter', async () => {

      const exchangeRatesPriceLow = await tokenExchangeRateResolvers.tokenExchangeRates('price_low')
      expect(exchangeRatesPriceLow[0]).toHaveProperty('currentPrice', 1)
      expect(exchangeRatesPriceLow[4]).toHaveProperty('currentPrice', 5)

      const exchangeRatesPriceHigh = await tokenExchangeRateResolvers.tokenExchangeRates('price_high')
      expect(exchangeRatesPriceHigh[0]).toHaveProperty('currentPrice', 5)
      expect(exchangeRatesPriceHigh[4]).toHaveProperty('currentPrice', 1)

      const exchangeRatesVolumeLow = await tokenExchangeRateResolvers.tokenExchangeRates('volume_low')
      expect(exchangeRatesVolumeLow[0]).toHaveProperty('totalVolume', 1)
      expect(exchangeRatesVolumeLow[4]).toHaveProperty('totalVolume', 5)

      const exchangeRatesVolumeHigh = await tokenExchangeRateResolvers.tokenExchangeRates('volume_high')
      expect(exchangeRatesVolumeHigh[0]).toHaveProperty('totalVolume', 5)
      expect(exchangeRatesVolumeHigh[4]).toHaveProperty('totalVolume', 1)

      const exchangeRatesMarketCapLow = await tokenExchangeRateResolvers.tokenExchangeRates('market_cap_low')
      expect(exchangeRatesMarketCapLow[0]).toHaveProperty('marketCap', 1)
      expect(exchangeRatesMarketCapLow[4]).toHaveProperty('marketCap', 5)

      const exchangeRatesMarketCapHigh = await tokenExchangeRateResolvers.tokenExchangeRates('market_cap_high')
      expect(exchangeRatesMarketCapHigh[0]).toHaveProperty('marketCap', 5)
      expect(exchangeRatesMarketCapHigh[4]).toHaveProperty('marketCap', 1)

      const exchangeRatesMarketCapRank = await tokenExchangeRateResolvers.tokenExchangeRates('market_cap_rank')
      expect(exchangeRatesMarketCapRank[0]).toHaveProperty('marketCapRank', 1)
      expect(exchangeRatesMarketCapRank[4]).toHaveProperty('marketCapRank', 5)

    })
  })

  describe('totalNumTokenExchangeRates', () => {
    it('should return the total number of TokenExchangeRate entities in the database', async () => {
      expect(await tokenExchangeRateResolvers.totalNumTokenExchangeRates()).toBe(5)
    })
  })

  describe('tokenExchangeRateBySymbol', () => {
    it('should return null if token exchange rate does not exist for a given symbol', async () => {
      expect(await tokenExchangeRateResolvers.tokenExchangeRateBySymbol(symbolSix)).toEqual(null)
    })

    it('should return an instance of TokenExchangeRateDto matching the symbol provided', async () => {

      const exchangeRateOne = await tokenExchangeRateResolvers.tokenExchangeRateBySymbol(symbolOne)
      const exchangeRateTwo = await tokenExchangeRateResolvers.tokenExchangeRateBySymbol(symbolTwo)

      // check that distinct objects are returned based on number and that they do not equal each other

      expect(exchangeRateOne).not.toBeNull()
      expect(exchangeRateOne).toBeInstanceOf(TokenExchangeRateDto)
      expect(exchangeRateOne).toHaveProperty('id', symbolOne)

      expect(exchangeRateTwo).not.toBeNull()
      expect(exchangeRateTwo).toBeInstanceOf(TokenExchangeRateDto)
      expect(exchangeRateTwo).toHaveProperty('id', symbolTwo)

      expect(symbolOne).not.toEqual(symbolTwo)
    })

    it('should convert a TokenExchangeRateEntity to a TokenExchangeRateDto', async () => {

      const exchangeRate = await tokenExchangeRateResolvers.tokenExchangeRateBySymbol(symbolOne)

      expect(exchangeRate).toEqual(
        new TokenExchangeRateDto({
          id: symbolOne,
          address: addressOne,
          currentPrice: 1,
          totalVolume: 2,
          marketCap: 3,
          marketCapRank: 4
        })
      )

    })
  })

  describe('tokenExchangeRateByAddress', () => {

    it('should return null if token exchange rate does not exist for a given address', async () => {
      expect(await tokenExchangeRateResolvers.tokenExchangeRateByAddress(addressSix)).toEqual(null)
    })

    it('should return an instance of TokenExchangeRateDto matching the address provided', async () => {

      const exchangeRateOne = await tokenExchangeRateResolvers.tokenExchangeRateByAddress(addressOne)
      const exchangeRateTwo = await tokenExchangeRateResolvers.tokenExchangeRateByAddress(addressTwo)

      // check that distinct objects are returned based on number and that they do not equal each other

      expect(exchangeRateOne).not.toBeNull()
      expect(exchangeRateOne).toBeInstanceOf(TokenExchangeRateDto)
      expect(exchangeRateOne).toHaveProperty('address', addressOne)

      expect(exchangeRateTwo).not.toBeNull()
      expect(exchangeRateTwo).toBeInstanceOf(TokenExchangeRateDto)
      expect(exchangeRateTwo).toHaveProperty('address', addressTwo)

      expect(symbolOne).not.toEqual(symbolTwo)
    })

    it('should convert a TokenExchangeRateEntity to a TokenExchangeRateDto', async () => {

      const exchangeRate = await tokenExchangeRateResolvers.tokenExchangeRateByAddress(addressOne)

      expect(exchangeRate).toEqual(
        new TokenExchangeRateDto({
          id: symbolOne,
          address: addressOne,
          currentPrice: 1,
          totalVolume: 2,
          marketCap: 3,
          marketCapRank: 4,
          balance: 0,
          totalIn: 0,
          totalOut: 0
        })
      )

    })

  })

})
