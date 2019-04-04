import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'

@Entity('token_exchange_rates')
export class TokenExchangeRateEntity {
  constructor(data: any) {
    assignClean(this, data)
  }

  @ObjectIdColumn({ name: '_id', type: 'string', readonly: true })
  id!: ObjectID

  @Column({ type: 'string', readonly: true })
  address!: string

  @Column({ type: 'string', name: 'circulating_supply', readonly: true })
  circulatingSupply!: string

  @Column({ type: 'double', name: 'current_price', readonly: true })
  currentPrice!: number

  @Column({ type: 'double', name: 'high_24h', readonly: true })
  high24h!: number

  @Column({ type: 'string', readonly: true })
  image!: string

  @Column({ type: 'string', name: 'last_updated', readonly: true })
  lastUpdated!: string

  @Column({ type: 'double', name: 'low_24h', readonly: true })
  low24h!: number

  @Column({ type: 'double', name: 'market_cap', readonly: true })
  marketCap!: number

  @Column({ type: 'double', name: 'market_cap_change_24h', readonly: true })
  marketCapChange24h!: number

  @Column({ type: 'double', name: 'market_cap_change_percentage_24h', readonly: true })
  marketCapChangePercentage24h!: number

  @Column({ type: 'int', name: 'market_cap_rank', readonly: true })
  marketCapRank!: number

  @Column({ type: 'string', readonly: true })
  name!: string

  @Column({ type: 'double', name: 'price_change_24h', readonly: true })
  priceChange24h!: number

  @Column({ type: 'double', name: 'price_change_percentage_24h', readonly: true })
  priceChangePercentage24h!: number

  @Column({ type: 'string', readonly: true })
  symbol!: string

  @Column({ type: 'long', name: 'total_supply', readonly: true })
  totalSupply!: number

  @Column({ type: 'double', name: 'total_volume', readonly: true })
  totalVolume!: number
}
