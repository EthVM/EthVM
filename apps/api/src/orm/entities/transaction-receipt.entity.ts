import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { TransactionEntity } from '@app/orm/entities/transaction.entity'

@Entity('canonical_transaction_receipt')
export class TransactionReceiptEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @Column({type: 'character', length: 66, readonly: true})
  transactionHash?: string

  @Column({type: 'integer', readonly: true})
  transactionIndex?: number

  @Column({type: 'character', length: 66, readonly: true})
  blockHash?: string

  @Column({type: 'numeric', readonly: true})
  blockNumber?: number

  @Column({type: 'character', length: 66, readonly: true})
  from?: string

  @Column({type: 'character', length: 66, readonly: true})
  to?: string

  @Column({type: 'character', length: 66, readonly: true})
  contractAddress?: string

  @Column({type: 'numeric', readonly: true})
  cumulativeGasUsed?: number

  @Column({type: 'numeric', readonly: true})
  gasUsed?: number

  @Column({type: 'text', readonly: true})
  logs?: string

  @Column({type: 'character', length: 514, readonly: true})
  logsBloom?: string

  @Column({type: 'character', length: 66, readonly: true})
  root?: string

  @Column({type: 'numeric', readonly: true})
  status?: number

  @ManyToOne(type => TransactionEntity, tx => tx.receipts)
  @JoinColumn({
    name: 'transactionHash',
    referencedColumnName: 'hash'
  })
  tx!: TransactionEntity

}
