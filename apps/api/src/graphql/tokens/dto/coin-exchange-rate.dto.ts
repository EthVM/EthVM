import { CoinExchangeRate, Decimal } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class CoinExchangeRateDto implements CoinExchangeRate {

  currency?: string;
  price?: Decimal;
  marketCap?: Decimal;
  vol24h?: Decimal;
  change24h?: Decimal;
  lastUpdated?: Decimal;

  constructor(data: any) {
    assignClean(this, data)
  }
}
