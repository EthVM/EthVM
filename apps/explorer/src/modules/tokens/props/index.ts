export interface TokenExchange {
  address: string
  circulating_supply?: string
  current_price?: number
  high_24h?: number
  image: string
  last_updated?: string
  low_24h?: number
  market_cap?: number
  market_cap_change_24h?: number
  market_cap_change_percentage_24h?: number
  market_cap_rank?: number
  name: string
  price_change_24h?: number
  price_change_percentage_24h?: number
  symbol: string
  total_supply: number
  total_volume?: number
  _id: string
}
