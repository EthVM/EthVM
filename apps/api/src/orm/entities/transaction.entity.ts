import { Entity, Column, ManyToOne, JoinColumnOptions, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { BlockHeaderEntity } from '@app/orm/entities/block-header.entity'
import { TransactionReceiptEntity } from '@app/orm/entities/transaction-receipt.entity'
import { TransactionTraceEntity } from '@app/orm/entities/transaction-trace.entity'

@Entity('canonical_transaction')
export class TransactionEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({type: 'character', length: 66, readonly: true})
  hash!: string

  @Column({type: 'numeric', readonly: true})
  nonce?: number

  @Column({type: 'character', length: 66, readonly: true})
  blockHash!: string

  @Column({type: 'numeric', readonly: true})
  blockNumber?: number

  @Column({type: 'integer', readonly: true})
  transactionIndex?: number

  @Column({type: 'character', length: 66, readonly: true})
  from?: string

  @Column({type: 'character', length: 66, readonly: true})
  to?: string

  @Column({type: 'numeric', readonly: true})
  value?: number

  @Column({type: 'numeric', readonly: true})
  gasPrice?: number

  @Column({type: 'numeric', readonly: true})
  gas?: number

  @Column({type: 'bytea', readonly: true})
  input?: Buffer  // TODO check typing is correct

  @Column({type: 'bigint', readonly: true})
  v?: number

  @Column({type: 'character', length: 78, readonly: true})
  r?: string

  @Column({type: 'character', length: 78, readonly: true})
  s?: string

  @Column({type: 'bigint', readonly: true})
  timestamp?: number

  @Column({type: 'character', length: 66, readonly: true})
  creates?: string

  @Column({type: 'bigint', readonly: true})
  chainId?: number

  @ManyToOne(type => BlockHeaderEntity, block => block.txs)
  @JoinColumn({
    name: 'blockHash',
    referencedColumnName: 'hash'
  })
  blockHeader!: BlockHeaderEntity

  @OneToOne(type => TransactionReceiptEntity, receipt => receipt.tx)
  @JoinColumn({
    name: 'hash',
    referencedColumnName: 'transactionHash'
  })
  receipt?: TransactionReceiptEntity

  @OneToMany(type => TransactionTraceEntity, trace => trace.tx)
  @JoinColumn({
    name: 'hash',
    referencedColumnName: 'transactionHash'
  })
  traces?: TransactionTraceEntity[]

}
