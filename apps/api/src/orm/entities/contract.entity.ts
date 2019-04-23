import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { Erc20MetadataEntity } from '@app/orm/entities/erc20-metadata.entity'
import { Erc721MetadataEntity } from '@app/orm/entities/erc721-metadata.entity'
import { ContractMetadataEntity } from '@app/orm/entities/contract-metadata.entity'

@Entity('canonical_contract')
export class ContractEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({type: 'character', length: 42, readonly: true})
  address!: string

  @Column({type: 'character', length: 42, readonly: true})
  creator?: string

  @Column({type: 'text', readonly: true})
  init?: string

  @Column({type: 'text', readonly: true})
  code?: string

  @Column({type: 'character', length: 66, readonly: true})
  refundAddress?: string

  @Column({type: 'numeric', readonly: true})
  refundBalance?: string

  @Column({type: 'character', length: 66, readonly: true})
  traceCreatedAtBlockHash?: string

  @Column({type: 'numeric', readonly: true})
  traceCreatedAtBlockNumber?: string

  @Column({type: 'character', length: 66, readonly: true})
  traceCreatedAtTransactionHash?: string

  @Column({type: 'integer', readonly: true})
  traceCreatedAtTransactionIndex?: number

  @Column({type: 'integer', readonly: true})
  traceCreatedAtLogIndex?: number

  @Column({type: 'character', length: 64, readonly: true})
  traceCreatedAtTraceAddress?: string

  @Column({type: 'character', length: 66, readonly: true})
  traceDestroyedAtBlockHash?: string

  @Column({type: 'numeric', readonly: true})
  traceDestroyedAtBlockNumber?: string

  @Column({type: 'character', length: 66, readonly: true})
  traceDestroyedAtTransactionHash?: string

  @Column({type: 'integer', readonly: true})
  traceDestroyedAtTransactionIndex?: number

  @Column({type: 'integer', readonly: true})
  traceDestroyedAtLogIndex?: number

  @Column({type: 'character', length: 64, readonly: true})
  traceDestroyedAtTraceAddress?: string

  @Column({type: 'text', readonly: true})
  traceDestroyedAt?: string

  @OneToOne(type => Erc20MetadataEntity, metadata => metadata.contract)
  @JoinColumn({
    name: 'address',
    referencedColumnName: 'address',
  })
  erc20Metadata?: Erc20MetadataEntity

  @OneToOne(type => Erc721MetadataEntity, metadata => metadata.contract)
  @JoinColumn({
    name: 'address',
    referencedColumnName: 'address',
  })
  erc721Metadata?: Erc721MetadataEntity

  @OneToOne(type => ContractMetadataEntity, metadata => metadata.contract)
  @JoinColumn({
    name: 'address',
    referencedColumnName: 'address',
  })
  metadata?: ContractMetadataEntity

}
