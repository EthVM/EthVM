import {Column, Entity, PrimaryColumn, OneToOne, JoinColumn, OneToMany} from 'typeorm'
import {assignClean} from '@app/shared/utils'
import {BalanceEntity} from '@app/orm/entities/balance.entity'
import {ContractEntity} from '@app/orm/entities/contract.entity';

@Entity('eth_list_contract_metadata')
export class EthListContractMetadataEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({type: 'char', length: 42, readonly: true})
  address!: string

  @Column({type: 'varchar', length: 128, readonly: true})
  name?: string

  @Column({type: 'varchar', length: 128, readonly: true})
  symbol?: string

  @Column({type: 'int', readonly: true})
  decimals?: number

  @Column({type: 'varchar', length: 256, readonly: true})
  ensAddress?: string

  @Column({type: 'varchar', length: 32, readonly: true})
  type?: string

  @Column({type: 'text', readonly: true})
  logo?: string

  @Column({type: 'text', readonly: true})
  support?: string

  @Column({type: 'text', readonly: true})
  social?: string

  @Column({type: 'varchar', length: 256, readonly: true})
  website?: string

  @OneToOne(type => ContractEntity, contract => contract.ethListContractMetadata)
  @JoinColumn({
    name: 'address',
    referencedColumnName: 'address',
  })
  contract?: ContractEntity
}
