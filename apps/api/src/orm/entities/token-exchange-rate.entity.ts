import { Column, Entity, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'

@Entity('token_exchange_rates')
export class TokenExchangeRateEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({type: 'character', length: 42, readonly: true})
  address!: string

  @Column({type: 'character varying', length: 64, readonly: true})
  symbol?: string

  @Column({type: 'character varying', length: 64, readonly: true})
  name?: string

  @Column({type: 'text', readonly: true})
  image?: string

  @Column({type: 'numeric', readonly: true})
  currentPrice?: string

  @Column({type: 'numeric', readonly: true})
  marketCap?: string

  @Column({type: 'integer', readonly: true})
  marketCapRank?: number

  @Column({type: 'numeric', readonly: true})
  totalVolume?: string

  @Column({type: 'numeric', readonly: true})
  high24h?: string

  @Column({type: 'numeric', readonly: true})
  low24h?: string

  @Column({type: 'numeric', readonly: true})
  priceChange24h?: string

  @Column({type: 'numeric', readonly: true})
  priceChangePercentage24h?: string

  @Column({type: 'numeric', readonly: true})
  marketCapChange24h?: string

  @Column({type: 'numeric', readonly: true})
  marketCapChangePercentage24h?: string

  @Column({type: 'numeric', readonly: true})
  circulatingSupply?: string

  @Column({type: 'numeric', readonly: true})
  totalSupply?: string

  @Column({type: 'bigint', readonly: true})
  lastUpdated?: string
}
