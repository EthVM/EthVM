import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'

@Entity('token_exchange_rates')
export class TokenExchangeRateEntity {

  constructor(data: any) {
    assignClean(this, data)
  }

  @ObjectIdColumn({name: '_id', type: 'string', readonly: true})
  id: ObjectID

  @Column({type: 'string'})
  address: string

  @Column({type: 'string', name: 'circulating_supply'})
  circulatingSupply: string

  @Column({type: 'double', name: 'current_price'})
  currentPrice: number

  @Column({type: 'double', name: 'high_24h'})
  high24h: number

  @Column({type: 'string'})
  image: string

  @Column({type: 'string', name: 'last_updated'})
  lastUpdated: string

  @Column({type: 'double', name: 'low_24h'})
  low24h: number

  @Column({type: 'double', name: 'market_cap'})
  marketCap: number

  @Column({type: 'double', name: 'market_cap_change_24h'})
  marketCapChange24h: number

  @Column({type: 'double', name: 'market_cap_change_percentage_24h'})
  marketCapChangePercentage24h: number

  @Column({type: 'int', name: 'market_cap_rank'})
  marketCapRank: number

  @Column({type: 'string'})
  name: string

  @Column({type: 'double', name: 'price_change_24h'})
  priceChange24h: number

  @Column({type: 'double', name: 'price_change_percentage_24h'})
  priceChangePercentage24h: number

  @Column({type: 'string'})
  symbol: string

  @Column({type: 'long', name: 'total_supply'})
  totalSupply: number

  @Column({type: 'double', name: 'total_volume'})
  totalVolume: number

}
