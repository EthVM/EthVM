import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { TokenHolderEntity } from '@app/orm/entities/token-holder.entity'
import { ContractEntity } from '@app/orm/entities/contract.entity'

@Entity('token_metadata')
export class TokenMetadataEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({ type: 'character varying', readonly: true })
  address!: string

  @Column({ type: 'character varying', readonly: true })
  name?: string

  @Column({ type: 'character varying', readonly: true })
  symbol?: string

  @Column({ type: 'character varying', readonly: true })
  website?: string

  @Column({ type: 'text', readonly: true })
  logo?: string

  @Column({ type: 'text', readonly: true })
  support?: string

  @Column({ type: 'integer', readonly: true })
  decimals?: string

  @OneToMany(type => TokenHolderEntity, th => th.metadata)
  @JoinColumn({
    name: 'address',
    referencedColumnName: 'contract',
  })
  tokenHolders?: TokenHolderEntity[]

  @OneToOne(type => ContractEntity, c => c.tokenMetadata)
  @JoinColumn({
    name: 'address',
    referencedColumnName: 'address'
  })
  contract?: ContractEntity
}
