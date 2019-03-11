import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'

interface AggregateBlockMetricKeyInterface {
  date: number
  name: string
}

@Entity('aggregate_block_metrics')
export class AggregateBlockMetricEntity {

  constructor(data: any) {
    assignClean(this, data)
  }

  @ObjectIdColumn({name: '_id', readonly: true})
  id: AggregateBlockMetricKeyInterface

  @Column({type: 'string', readonly: true})
  bigInteger: string

  @Column({type: 'long', readonly: true})
  date: number

  @Column({type: 'double', readonly: true})
  double: number

  @Column({type: 'double', readonly: true})
  float: number

  @Column({type: 'int', readonly: true})
  int: number

  @Column({type: 'long', readonly: true})
  long: number

  @Column({type: 'string', readonly: true})
  name: string

}
