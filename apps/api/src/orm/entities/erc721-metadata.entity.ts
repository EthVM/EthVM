import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { ContractEntity } from '@app/orm/entities/contract.entity'

@Entity('erc721_metadata')
export class Erc721MetadataEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({type: 'character', length: 42, readonly: true})
  address!: string

  @Column({type: 'character varying', length: 64, readonly: true})
  name?: string

  @Column({type: 'character varying', length: 64, readonly: true})
  symbol?: string

  @OneToOne(type => ContractEntity, contract => contract.erc721Metadata)
  @JoinColumn({
    name: 'address',
    referencedColumnName: 'address',
  })
  contract?: ContractEntity

}
