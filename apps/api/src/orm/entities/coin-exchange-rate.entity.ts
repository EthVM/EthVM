import { Column, PrimaryColumn, Entity } from 'typeorm'
import { assignClean } from '@app/shared/utils'

@Entity('coin_exchange_rates')
export class CoinExchangeRateEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({type: 'character varying', length: 24, readonly: true})
  id!: string

  @Column({type: 'character', length: 3, readonly: true})
  currency!: string

  @Column({type: 'numeric', readonly: true})
  price!: number

  @Column({type: 'numeric', readonly: true})
  marketCap!: number

  @Column({type: 'numeric', readonly: true})
  vol24h!: number

  @Column({type: 'numeric', readonly: true})
  change24h!: number

  @Column({type: 'bigint', readonly: true})
  lastUpdated!: string

}
