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

  @Column({type: 'string'})
  bigInteger: string

  @Column({type: 'long'})
  date: number

  @Column({type: 'double'})
  double: number

  @Column({type: 'double'})
  float: number

  @Column({type: 'int'})
  int: number

  @Column({type: 'long'})
  long: number

  @Column({type: 'string'})
  name: string

}
