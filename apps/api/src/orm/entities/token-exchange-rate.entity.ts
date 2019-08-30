import {assignClean} from '@app/shared/utils'
import BigNumber from 'bignumber.js'
import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn} from 'typeorm'
import {BigNumberTransformer} from '../transformers/big-number.transformer'
import {ContractEntity} from '@app/orm/entities/contract.entity'

@Entity('canonical_token_exchange_rate')
export class TokenExchangeRateEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({ type: 'char', length: 42, readonly: true })
  address!: string

  @Column({ type: 'varchar', length: 128, readonly: true })
  symbol?: string

  @Column({ type: 'varchar', length: 128, readonly: true })
  name?: string

  @Column({ type: 'text', readonly: true })
  image?: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  currentPrice?: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  marketCap?: BigNumber

  @Column({ type: 'int', readonly: true })
  marketCapRank?: number

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  totalVolume?: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  high24h?: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  low24h?: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  priceChange24h?: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  priceChangePercentage24h?: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  marketCapChange24h?: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  marketCapChangePercentage24h?: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  circulatingSupply?: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  totalSupply?: BigNumber

  @Column({ type: 'bigint', readonly: true, transformer: new BigNumberTransformer() })
  lastUpdated?: BigNumber

  @OneToOne(type => ContractEntity, c => c.tokenExchangeRate)
  @JoinColumn({
    name: 'address',
    referencedColumnName: 'address',
  })
  contract?: ContractEntity
}
