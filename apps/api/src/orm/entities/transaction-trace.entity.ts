import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { TransactionEntity } from '@app/orm/entities/transaction.entity'
import { PrimaryColumn } from 'typeorm/decorator/columns/PrimaryColumn'
import { BigNumberTransformer } from '../transformers/big-number.transformer'
import BigNumber from 'bignumber.js'

@Entity('canonical_transaction_trace')
export class TransactionTraceEntity {

  constructor(data: any) {
    assignClean(this, data)
  }

  @PrimaryColumn({ type: 'character', length: 66, readonly: true })
  blockHash!: string

  @PrimaryColumn({ type: 'character', length: 66, readonly: true })
  transactionHash?: string

  @Column({ type: 'character varying', length: 514, readonly: true })
  rootError?: string

  @Column({ type: 'text', readonly: true })
  traces!: string

  @OneToOne(type => TransactionEntity, tx => tx.trace)
  @JoinColumn({
    name: 'transactionHash',
    referencedColumnName: 'hash'
  })
  tx!: TransactionEntity

}
