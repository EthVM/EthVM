import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { Erc20MetadataEntity } from '@app/orm/entities/erc20-metadata.entity'
import { Erc721MetadataEntity } from '@app/orm/entities/erc721-metadata.entity'
import { ContractMetadataEntity } from '@app/orm/entities/contract-metadata.entity'
import { BigNumberTransformer } from '@app/orm/transformers/big-number.transformer'
import BigNumber from 'bignumber.js'
import { TransactionEntity } from '@app/orm/entities/transaction.entity'
import { TokenExchangeRateEntity } from '@app/orm/entities/token-exchange-rate.entity'

@Entity('canonical_contract')
export class ContractEntity {

  constructor(data: any) {
    assignClean(this, data)
  }

  @PrimaryColumn({ type: 'character', length: 42, readonly: true })
  address!: string

  @Column({ type: 'character', length: 42, readonly: true })
  creator?: string

  @Column({ type: 'text', readonly: true })
  init?: string

  @Column({ type: 'text', readonly: true })
  code?: string

  @Column({ type: 'varchar', length: 32, readonly: true })
  contractType?: string

  @Column({ type: 'character', length: 66, readonly: true })
  refundAddress?: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  refundBalance?: BigNumber

  @Column({ type: 'character', length: 66, readonly: true })
  traceCreatedAtBlockHash?: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  traceCreatedAtBlockNumber?: BigNumber

  @Column({ type: 'character', length: 66, readonly: true })
  traceCreatedAtTransactionHash!: string

  @Column({ type: 'integer', readonly: true })
  traceCreatedAtTransactionIndex?: number

  @Column({ type: 'integer', readonly: true })
  traceCreatedAtLogIndex?: number

  @Column({ type: 'character', length: 64, readonly: true })
  traceCreatedAtTraceAddress?: string

  @Column({ type: 'timestamp', readonly: true })
  traceCreatedAtTimestamp?: Date

  @Column({ type: 'character', length: 66, readonly: true })
  traceDestroyedAtBlockHash?: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  traceDestroyedAtBlockNumber?: BigNumber

  @Column({ type: 'character', length: 66, readonly: true })
  traceDestroyedAtTransactionHash?: string

  @Column({ type: 'integer', readonly: true })
  traceDestroyedAtTransactionIndex?: number

  @Column({ type: 'integer', readonly: true })
  traceDestroyedAtLogIndex?: number

  @Column({ type: 'character', length: 64, readonly: true })
  traceDestroyedAtTraceAddress?: string

  @Column({ type: 'timestamp', readonly: true })
  traceDestroyedAtTimestamp?: Date

  @Column({ type: 'timestamp', readonly: true })
  timestamp?: Date

  @OneToOne(type => Erc20MetadataEntity, metadata => metadata.contract)
  @JoinColumn({
    name: 'address',
    referencedColumnName: 'address'
  })
  erc20Metadata?: Erc20MetadataEntity

  @OneToOne(type => Erc721MetadataEntity, metadata => metadata.contract)
  @JoinColumn({
    name: 'address',
    referencedColumnName: 'address'
  })
  erc721Metadata?: Erc721MetadataEntity

  @OneToOne(type => ContractMetadataEntity, metadata => metadata.contract)
  @JoinColumn({
    name: 'address',
    referencedColumnName: 'address'
  })
  metadata?: ContractMetadataEntity

  @ManyToOne(type => TransactionEntity, tx => tx.contracts)
  @JoinColumn({
    name: 'traceCreatedAtTransactionHash',
    referencedColumnName: 'hash'
  })
  createdAtTx?: TransactionEntity

  @OneToOne(type => TokenExchangeRateEntity, t => t.contract)
  @JoinColumn({
    name: 'address',
    referencedColumnName: 'address'
  })
  tokenExchangeRate?: TokenExchangeRateEntity

}
