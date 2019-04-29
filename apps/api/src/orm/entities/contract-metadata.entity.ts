import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { ContractEntity } from '@app/orm/entities/contract.entity'
import { Erc20MetadataEntity } from '@app/orm/entities/erc20-metadata.entity'
import { Erc721MetadataEntity } from '@app/orm/entities/erc721-metadata.entity'

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
  logo?: string

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

  @OneToOne(type => Erc20MetadataEntity, erc20 => erc20.contractMetadata)
  @JoinColumn({
    name: 'address',
    referencedColumnName: 'address'
  })
  erc20Metadata?: Erc20MetadataEntity

  @OneToOne(type => Erc721MetadataEntity, erc721 => erc721.contractMetadata)
  @JoinColumn({
    name: 'address',
    referencedColumnName: 'address'
  })
  erc721Metadata?: Erc721MetadataEntity

}
