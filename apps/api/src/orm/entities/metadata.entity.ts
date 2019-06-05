import { Column, Entity, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'

@Entity('metadata')
export class MetadataEntity {

  public constructor(data: any) {
    assignClean(this, data)
  }

  @PrimaryColumn({ type: 'varchar', length: 64, readonly: true })
  key!: string

  @Column({ type: 'varchar', length: 256, readonly: true })
  value!: string

}
