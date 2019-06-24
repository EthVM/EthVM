import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { BigNumberTransformer } from '@app/orm/transformers/big-number.transformer'
import BigNumber from 'bignumber.js'
import { TokenExchangeRateEntity } from '@app/orm/entities/token-exchange-rate.entity'
import { TokenMetadataEntity } from '@app/orm/entities/token-metadata.entity'

@Entity('token_holder')
export class TokenHolderEntity {
  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({ type: 'character', readonly: true })
  contract!: string

  @PrimaryColumn({ type: 'character', readonly: true })
  address!: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  balance?: BigNumber

  @Column({ type: 'character', readonly: true })
  type!: string

  @ManyToOne(type => TokenExchangeRateEntity, ter => ter.tokenHolders)
  @JoinColumn({
    name: 'contract',
    referencedColumnName: 'address',
  })
  tokenExchangeRate?: TokenExchangeRateEntity

  @ManyToOne(type => TokenMetadataEntity, metadata => metadata.tokenHolders)
  @JoinColumn({
    name: 'contract',
    referencedColumnName: 'address',
  })
  metadata?: TokenMetadataEntity
}
