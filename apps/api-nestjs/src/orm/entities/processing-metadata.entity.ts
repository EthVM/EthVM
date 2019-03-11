import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'

@Entity('processing_metadata')
export class ProcessingMetadataEntity {

  constructor(data: any) {
    assignClean(this, data)
  }

  // TODO fix ID column nested {name: string}
  @ObjectIdColumn({name: '_id', type: 'string', readonly: true})
  id: ObjectID

  @Column({type: 'boolean'})
  boolean: boolean

  @Column({type: 'string'})
  bigInteger: string

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

  @Column({type: 'string'})
  string: string

}
