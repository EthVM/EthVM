import { Column, Entity, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'

@Entity('row_count')
export class RowCount {

  public constructor(data: any) {
    assignClean(this, data)
  }

  @PrimaryColumn({ type: 'character varying', length: 128, readonly: true })
  relation!: string

  @Column({ type: 'bigint', readonly: true })
  count!: number

}
