import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { ContractEntity } from '@app/orm/entities/contract.entity'

@Entity('eth_list_contract_metadata')
export class ContractMetadataEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({type: 'character', length: 42, readonly: true})
  address!: string

  @Column({type: 'character varying', length: 64, readonly: true})
  name?: string

  @Column({type: 'character varying', length: 64, readonly: true})
  symbol?: string

  @Column({type: 'integer', readonly: true})
  decimals?: number

  @Column({type: 'character varying', length: 256, readonly: true})
  ensAddress?: string

  @Column({type: 'character varying', length: 32, readonly: true})
  type?: string

  @Column({type: 'text', readonly: true})
  text?: string

  @Column({type: 'text', readonly: true})
  support?: string

  @Column({type: 'text', readonly: true})
  social?: string

  @Column({type: 'character varying', length: 256, readonly: true})
  website?: string

  @OneToOne(type => ContractEntity, contract => contract.metadata)
  @JoinColumn({
    name: 'address',
    referencedColumnName: 'address',
  })
  contract?: ContractEntity

}
