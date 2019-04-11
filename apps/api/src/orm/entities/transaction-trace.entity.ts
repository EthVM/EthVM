import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { TransactionEntity } from '@app/orm/entities/transaction.entity'
import { PrimaryColumn } from 'typeorm/decorator/columns/PrimaryColumn'

@Entity('canonical_transaction_trace')
export class TransactionTraceEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({type: 'character', length: 66, readonly: true})
  blockHash?: string

  @PrimaryColumn({type: 'character', length: 66, readonly: true})
  transactionHash?: string

  @PrimaryColumn({type: 'text', readonly: true})
  traceAddress?: string

  @Column({type: 'integer', readonly: true})
  transactionPosition?: number

  @Column({type: 'numeric', readonly: true})
  blockNumber?: number

  @Column({type: 'integer', readonly: true})
  subtraces?: number

  @Column({type: 'character varying', length: 66, readonly: true})
  type?: string

  @Column({type: 'character varying', length: 514, readonly: true})
  error?: string

  @Column({type: 'text', readonly: true})
  action?: string

  @Column({type: 'text', readonly: true})
  result?: string

  @ManyToOne(type => TransactionEntity, tx => tx.traces)
  @JoinColumn({
    name: 'transactionHash',
    referencedColumnName: 'hash'
  })
  tx!: TransactionEntity

}
