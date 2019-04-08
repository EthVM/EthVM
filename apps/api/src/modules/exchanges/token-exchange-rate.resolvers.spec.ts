import { Test } from '@nestjs/testing'
import { EthService } from '../../shared/eth.service'
import { ExchangeService } from './exchange.service'
import { TokenExchangeRateResolvers } from './token-exchange-rate.resolvers'
import { TokenTransferService } from '../token-transfers/token-transfer.service'
import { QuoteDto } from './quote.dto'
import { TokenExchangeRateEntity } from '../../orm/entities/token-exchange-rate.entity'
import { TokenExchangeRateDto } from './token-exchange-rate.dto'
import { EthplorerTokenInfoDto } from '../token-transfers/dto/ethplorer-token-info.dto'

const mockExchangeService = {
  async findQuote(symbol, to) {},
  async findTokenExchangeRates(filter, limit, page) {},
  async countTokenExchangeRates() {},
  async findTokenExchangeRateBySymbol(symbol) {},
  async findTokenExchangeRateByAddress(address) {}
}
const mockTokenTransferService = {
  async fetchTokenInfo(address) {}
}

describe('TokenExchangeRateResolvers', () => {

  let exchangeService: ExchangeService
  let tokenTransferService: TokenTransferService
  let tokenExchangeRateResolvers: TokenExchangeRateResolvers

  beforeEach(async () => {
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
    exchangeService = module.get<ExchangeService>(ExchangeService)
    tokenTransferService = module.get<TokenTransferService>(TokenTransferService)
    tokenExchangeRateResolvers = module.get<TokenExchangeRateResolvers>(TokenExchangeRateResolvers)
  })

  const to = 'USD'
  const symbol = 'ETH'
  const address = '0000000000000000000000000000000000000000'
  const quoteResult = {
    to
  }
  const tokenExchangeRateResult = {
    id: 'TEST'
  }
  const ethplorerTokenInfoResult = {
    balance: 0,
    totalIn: 0,
    totalOut: 0
  }

  describe('quote', () => {
    it('should return an instance of QuoteDto matching the symbol and to provided', async () => {

      jest.spyOn(exchangeService, 'findQuote')
        .mockImplementation(() => new Promise(resolve => {
          resolve(new QuoteDto(quoteResult))
        }))

      expect(await tokenExchangeRateResolvers.quote(symbol, to)).toEqual(new QuoteDto(quoteResult))
    })
  })

  describe('tokenExchangeRates', () => {
    it('should return an array of TokenExchangeRateDto entities', async () => {
      jest.spyOn(exchangeService, 'findTokenExchangeRates')
        .mockImplementation(() => new Promise(resolve => {
          resolve([new TokenExchangeRateEntity(tokenExchangeRateResult)])
        }))
      expect(await tokenExchangeRateResolvers.tokenExchangeRates('price_high', 1, 0))
        .toEqual([new TokenExchangeRateDto(tokenExchangeRateResult)])
    })
  })

  describe('totalNumTokenExchangeRates', () => {
    it('should return the total number of TokenExchangeRate entities in the database', async () => {
      const total = 100
      jest.spyOn(exchangeService, 'countTokenExchangeRates')
        .mockImplementation(() => new Promise(resolve => resolve(total)))
      expect(await tokenExchangeRateResolvers.totalNumTokenExchangeRates()).toBe(total)
    })
  })

  describe('tokenExchangeRateBySymbol', () => {
    it('should return an instance of TokenExchangeRateDto with id matching the symbol provided', async () => {
      jest.spyOn(exchangeService, 'findTokenExchangeRateBySymbol')
        .mockImplementation(() => new Promise(resolve => resolve(new TokenExchangeRateEntity(tokenExchangeRateResult))))
      expect(await tokenExchangeRateResolvers.tokenExchangeRateBySymbol(symbol)).toEqual(new TokenExchangeRateDto(tokenExchangeRateResult))
    })
  })

  describe('tokenExchangeRateByAddress', () => {
    it('should return an instance of TokenExchangeRateDto matching the address hash provided', async () => {
      jest.spyOn(exchangeService, 'findTokenExchangeRateByAddress')
        .mockImplementation(() => new Promise(resolve => resolve(new TokenExchangeRateEntity(tokenExchangeRateResult))))
      jest.spyOn(tokenTransferService, 'fetchTokenInfo')
        .mockImplementation(() => new Promise(resolve => resolve(new EthplorerTokenInfoDto(ethplorerTokenInfoResult))))

      expect(await tokenExchangeRateResolvers.tokenExchangeRateByAddress(address))
        .toEqual(new TokenExchangeRateDto({...tokenExchangeRateResult, ...ethplorerTokenInfoResult}))
    })
  })

})
