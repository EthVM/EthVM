import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { ContractEntity } from '@app/orm/entities/contract.entity'
import { Erc20BalanceEntity } from '@app/orm/entities/erc20-balance.entity'
import {BigNumberTransformer} from '@app/orm/transformers/big-number.transformer'
import BigNumber from 'bignumber.js'
import {ContractMetadataEntity} from '@app/orm/entities/contract-metadata.entity'
import { TokenExchangeRateEntity } from '@app/orm/entities/token-exchange-rate.entity'

@Entity('erc20_metadata')
export class Erc20MetadataEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({ type: 'character', length: 42, readonly: true })
  address!: string

  @Column({ type: 'character varying', length: 64, readonly: true })
  name?: string

  @Column({ type: 'character varying', length: 64, readonly: true })
  symbol?: string

  @Column({ type: 'integer', readonly: true })
  decimals?: number

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  totalSupply?: BigNumber

  @OneToOne(type => ContractEntity, contract => contract.erc20Metadata)
  @JoinColumn({
    name: 'address',
    referencedColumnName: 'address',
  })
  contract?: ContractEntity

  @OneToMany(type => Erc20BalanceEntity, erc20 => erc20.metadata)
  @JoinColumn({
    name: 'address',
    referencedColumnName: 'contract',
  })
  balances?: Erc20BalanceEntity[]

  @OneToOne(type => ContractMetadataEntity, metadata => metadata.erc20Metadata)
  @JoinColumn({
    name: 'address',
    referencedColumnName: 'address',
  })
  contractMetadata?: ContractMetadataEntity

  @OneToOne(type => TokenExchangeRateEntity, exchangeRate => exchangeRate.erc20Metadata)
  @JoinColumn({
    name: 'address',
    referencedColumnName: 'address',
  })
  tokenExchangeRate?: TokenExchangeRateEntity

}
