import {Column, Entity, PrimaryColumn, OneToOne, JoinColumn} from 'typeorm'
import {assignClean} from '@app/shared/utils'
import {BigNumberTransformer} from '@app/orm/transformers/big-number.transformer'
import BigNumber from 'bignumber.js'
import {DateTransformer} from '@app/orm/transformers/date.transformer'
import {EthListContractMetadataEntity} from '@app/orm/entities/eth-list-contract-metadata.entity'
import {ContractMetadataEntity} from '@app/orm/entities/contract-metadata.entity'
import {TokenExchangeRateEntity} from '@app/orm/entities/token-exchange-rate.entity'

@Entity('contract')
export class ContractEntity {

  constructor(data: any) {
    assignClean(this, data)
  }

  @PrimaryColumn({ type: 'char', length: 42, readonly: true })
  address!: string

  @Column({ type: 'char', length: 42, readonly: true })
  creator?: string

  @Column({ type: 'text', readonly: true })
  init?: string

  @Column({ type: 'text', readonly: true })
  code?: string

  @Column({ type: 'varchar', length: 32, readonly: true })
  contractType?: string

  @Column({ type: 'char', length: 66, readonly: true })
  refundAddress?: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  refundBalance?: BigNumber

  @Column({ type: 'char', length: 66, readonly: true })
  createdAtBlockHash?: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  createdAtBlockNumber?: BigNumber

  @Column({ type: 'char', length: 66, readonly: true })
  createdAtTransactionHash!: string

  @Column({ type: 'text', readonly: true })
  createdAtTraceAddress?: string

  @Column({ type: 'timestamp', readonly: true, transformer: new DateTransformer() })
  createdAtTimestamp!: Date

  @Column({ type: 'char', length: 66, readonly: true })
  destroyedAtBlockHash?: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  destroyedAtBlockNumber?: BigNumber

  @Column({ type: 'char', length: 66, readonly: true })
  destroyedAtTransactionHash?: string

  @Column({ type: 'text', readonly: true })
  destroyedAtTraceAddress?: string

  @Column({ type: 'timestamp', readonly: true, transformer: new DateTransformer() })
  destroyedAtTimestamp?: Date

  @OneToOne(type => EthListContractMetadataEntity, metadata => metadata.contract)
  @JoinColumn({
    name: 'address',
    referencedColumnName: 'address',
  })
  ethListContractMetadata?: EthListContractMetadataEntity

  @OneToOne(type => ContractMetadataEntity, metadata => metadata.contract)
  @JoinColumn({
    name: 'address',
    referencedColumnName: 'address',
  })
  contractMetadata?: ContractMetadataEntity

  @OneToOne(type => TokenExchangeRateEntity, t => t.contract)
  @JoinColumn({
    name: 'address',
    referencedColumnName: 'address',
  })
  tokenExchangeRate?: TokenExchangeRateEntity

}
