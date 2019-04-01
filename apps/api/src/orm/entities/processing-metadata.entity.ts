import { Column, Entity, ObjectIdColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'

@Entity('processing_metadata')
export class ProcessingMetadataEntity {
  constructor(data: any) {
    assignClean(this, data)
  }

  @ObjectIdColumn({ name: '_id', readonly: true })
  id!: string

  @Column({ type: 'boolean', readonly: true })
  boolean!: boolean

  @Column({ type: 'string', readonly: true })
  bigInteger!: string

  @Column({ type: 'double', readonly: true })
  double!: number

  @Column({ type: 'double', readonly: true })
  float!: number

  @Column({ type: 'int', readonly: true })
  int!: number

  @Column({ type: 'long', readonly: true })
  long!: number

  @Column({ type: 'string', readonly: true })
  name!: string

  @Column({ type: 'string', readonly: true })
  string!: string
}
