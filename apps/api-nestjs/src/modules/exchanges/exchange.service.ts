import { HttpException, Injectable } from '@nestjs/common'
import { ConfigService } from '@app/shared/config.service'
import { QuoteDto } from '@app/modules/exchanges/quote.dto'
import { TokenExchangeRateEntity } from '@app/orm/entities/token-exchange-rate.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import axios from 'axios'

@Injectable()
export class ExchangeService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(TokenExchangeRateEntity)
    private readonly tokenExchangeRateRepository: MongoRepository<TokenExchangeRateEntity>,
  ) {}

  async findQuote(token: string, to: string): Promise<QuoteDto> {
    const url = this.configService.coinGecko.url

    const res = await axios.get(url)

    if (res.status !== 200) {
      throw new HttpException(res.statusText, res.status)
    }

    const { ethereum } = res.data

    return new QuoteDto({
      to,
      price: ethereum.usd,
      vol_24h: ethereum.usd_24h_vol,
      last_update: ethereum.last_updated_at,
    })
  }

  async findTokenExchangeRates(sort: string, take: number = 10, page: number = 0): Promise<TokenExchangeRateEntity[]> {
    const skip = take * page
    let order
    switch (sort) {
      case 'price_high':
        order = { current_price: -1 }
        break
      case 'price_low':
        order = { current_price: 1 }
        break
      case 'volume_high':
        order = { total_volume: -1 }
        break
      case 'volume_low':
        order = { total_volume: 1 }
        break
      case 'market_cap_high':
        order = { market_cap: -1 }
        break
      case 'market_cap_low':
        order = { market_cap: 1 }
        break
      case 'market_cap_rank':
      default:
        order = { market_cap_rank: 1 }
        break
    }

    return this.tokenExchangeRateRepository.find({ order, skip, take })
  }

  async countTokenExchangeRates(): Promise<number> {
    return this.tokenExchangeRateRepository.count()
  }

  async findTokenExchangeRateBySymbol(symbol: string): Promise<TokenExchangeRateEntity | null> {
    return this.tokenExchangeRateRepository.findOne({ where: { _id: symbol } })
  }

  async findTokenExchangeRateByAddress(address: string): Promise<TokenExchangeRateEntity | null> {
    return this.tokenExchangeRateRepository.findOne({ where: { address } })
  }
}
