import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'

interface ProcessingMetadataKeyInterface {
  name: string
}

@Entity('processing_metadata')
export class ProcessingMetadataEntity {

  constructor(data: any) {
    assignClean(this, data)
  }

  @ObjectIdColumn({name: '_id', readonly: true})
  id: ProcessingMetadataKeyInterface

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
