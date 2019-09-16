import {Column, Entity, PrimaryColumn, OneToOne, JoinColumn} from 'typeorm'
import {assignClean} from '@app/shared/utils'
import {BigNumberTransformer} from '@app/orm/transformers/big-number.transformer'
import BigNumber from 'bignumber.js'
import {ContractEntity} from '@app/orm/entities/contract.entity';

@Entity('contract_metadata')
export class ContractMetadataEntity {

  constructor(data: any) {
    assignClean(this, data)
  }

  @PrimaryColumn({ type: 'char', length: 42, readonly: true })
  address!: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  blockNumber!: BigNumber

  @Column({ type: 'varchar', length: 128, readonly: true })
  name?: string

  @Column({ type: 'varchar', length: 128, readonly: true })
  symbol?: string

  @Column({ type: 'int', readonly: true })
  decimals?: number

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  totalSupply?: BigNumber

  @OneToOne(type => ContractEntity, contract => contract.contractMetadata)
  @JoinColumn({
    name: 'address',
    referencedColumnName: 'address',
  })
  contract?: ContractEntity
}
