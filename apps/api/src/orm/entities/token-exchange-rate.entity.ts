import { Erc20BalanceEntity } from '@app/orm/entities/erc20-balance.entity';
import { Erc721BalanceEntity } from '@app/orm/entities/erc721-balance.entity';
import { assignClean } from '@app/shared/utils';
import BigNumber from 'bignumber.js';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm'
import { BigNumberTransformer } from '../transformers/big-number.transformer';
import { ContractEntity } from '@app/orm/entities/contract.entity'

@Entity('canonical_token_exchange_rates')
export class TokenExchangeRateEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({ type: 'character', length: 42, readonly: true })
  address!: string

  @Column({ type: 'character varying', length: 64, readonly: true })
  symbol?: string

  @Column({ type: 'character varying', length: 64, readonly: true })
  name?: string

  @Column({ type: 'text', readonly: true })
  image?: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  currentPrice?: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  marketCap?: BigNumber

  @Column({ type: 'integer', readonly: true })
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

  @Column({ type: 'bigint', readonly: true })
  lastUpdated?: string

  @OneToMany(type => Erc20BalanceEntity, erc20 => erc20.tokenExchangeRate)
  @JoinColumn({
    name: 'address',
    referencedColumnName: 'contract',
  })
  erc20Balances?: Erc20BalanceEntity[]

  @OneToMany(type => Erc721BalanceEntity, erc721 => erc721.tokenExchangeRate)
  @JoinColumn({
    name: 'address',
    referencedColumnName: 'contract',
  })
  erc721Balances?: Erc721BalanceEntity[]

  @OneToOne(type => ContractEntity, c => c.tokenExchangeRate)
  @JoinColumn({
    name: 'address',
    referencedColumnName: 'address',
  })
  contract?: ContractEntity
}
