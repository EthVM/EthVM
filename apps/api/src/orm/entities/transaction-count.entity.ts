import { Column, Entity, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'

@Entity('transaction_count')
export class TransactionCountEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({ type: 'character', length: 42, readonly: true })
  address!: string

  @Column({ type: 'integer', readonly: true })
  totalIn!: number

  @Column({ type: 'integer', readonly: true })
  totalOut!: number

  @Column({ type: 'timestamp', readonly: true })
  timestamp!: Date
}
