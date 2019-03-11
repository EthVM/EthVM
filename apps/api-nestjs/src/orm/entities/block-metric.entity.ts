import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'

@Entity('block_metrics')
export class BlockMetricEntity {

  constructor(data: any) {
    assignClean(this, data)
  }

  @ObjectIdColumn({name: '_id', type: 'decimal', readonly: true})
  id: ObjectID

  @Column({type: 'string', readonly: true})
  avgGasLimit: string

  @Column({type: 'string', readonly: true})
  avgGasPrice: string

  @Column({type: 'string', readonly: true})
  avgTxFees: string

  @Column({type: 'string', readonly: true})
  blockTime: string

  @Column({type: 'string', readonly: true})
  difficulty: string

  @Column({type: 'string', readonly: true})
  hash: string

  @Column({type: 'long', readonly: true})
  number: number

  @Column({type: 'int', readonly: true})
  numFailedTxs: number

  @Column({type: 'int', readonly: true})
  numPendingTxs: number

  @Column({type: 'int', readonly: true})
  numSuccessfulTxs: number

  @Column({type: 'int', readonly: true})
  numUncles: number

  @Column({type: 'long', readonly: true})
  timestamp: number

  @Column({type: 'string', readonly: true})
  totalDifficulty: string

  @Column({type: 'int', readonly: true})
  totalTxs: number

}
