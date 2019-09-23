import { CoinExchangeRate, Decimal } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import {CoinExchangeRateEntity} from '@app/orm/entities/coin-exchange-rate.entity'

export class CoinExchangeRateDto implements CoinExchangeRate {

  currency?: string
  price?: Decimal
  marketCap?: Decimal
  vol24h?: Decimal
  change24h?: Decimal
  lastUpdated?: Decimal

  constructor(data: CoinExchangeRateEntity) {
    assignClean(this, data)
  }
}
