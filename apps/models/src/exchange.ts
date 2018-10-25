
export interface ExchangeRate {
  symbol: string
  rank?: number | null
  quotes: Quote[]
  total_supply: number | null
}

export interface Quote {
  to: string
  price: string
  market_cap?: number | null
  last_update?: number | null
  vol_24h?: string | null
}
