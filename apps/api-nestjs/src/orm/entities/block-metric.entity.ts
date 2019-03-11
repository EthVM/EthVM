import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'

@Entity('block_metrics')
export class BlockMetricEntity {

  constructor(data: any) {
    assignClean(this, data)
  }

  @ObjectIdColumn({name: '_id', type: 'decimal', readonly: true})
  id: ObjectID

  @Column({type: 'string'})
  avgGasLimit: string

  @Column({type: 'string'})
  avgGasPrice: string

  @Column({type: 'string'})
  avgTxFees: string

  @Column({type: 'string'})
  blockTime: string

  @Column({type: 'string'})
  difficulty: string

  @Column({type: 'string'})
  hash: string

  @Column({type: 'long'})
  number: number

  @Column({type: 'int'})
  numFailedTxs: number

  @Column({type: 'int'})
  numPendingTxs: number

  @Column({type: 'int'})
  numSuccessfulTxs: number

  @Column({type: 'int'})
  numUncles: number

  @Column({type: 'long'})
  timestamp: number

  @Column({type: 'string'})
  totalDifficulty: string

  @Column({type: 'int'})
  totalTxs: number

}
