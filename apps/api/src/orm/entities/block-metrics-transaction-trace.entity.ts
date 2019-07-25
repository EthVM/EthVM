import { Column, Entity, PrimaryColumn } from 'typeorm'
import { DateTransformer } from '@app/orm/transformers/date.transformer'

@Entity('canonical_block_metrics_transaction_trace')
export class BlockMetricsTransactionTraceEntity {

  @PrimaryColumn({ type: 'character', length: 66, unique: true, readonly: true })
  blockHash!: string

  @PrimaryColumn({ type: 'timestamp', readonly: true, transformer: new DateTransformer() })
  timestamp!: Date

  @Column({type: 'int', readonly: true})
  totalTxs!: number

  @Column({type: 'int', readonly: true})
  numSuccessfulTxs!: number

  @Column({type: 'int', readonly: true})
  numFailedTxs!: number

  @Column({type: 'int', readonly: true})
  numInternalTxs!: number
}
