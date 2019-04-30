import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { ContractEntity } from '@app/orm/entities/contract.entity'
import { Erc20BalanceEntity } from '@app/orm/entities/erc20-balance.entity'
import { Erc721BalanceEntity } from '@app/orm/entities/erc721-balance.entity'
import { ContractMetadataEntity } from '@app/orm/entities/contract-metadata.entity'

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

  @OneToMany(type => Erc721BalanceEntity, erc721 => erc721.metadata)
  @JoinColumn({
    name: 'address',
    referencedColumnName: 'contract',
  })
  balances?: Erc721BalanceEntity[]

  @OneToOne(type => ContractMetadataEntity, metadata => metadata.erc721Metadata)
  @JoinColumn({
    name: 'address',
    referencedColumnName: 'address',
  })
  contractMetadata?: ContractMetadataEntity

}
