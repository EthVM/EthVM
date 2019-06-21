import { Column, Entity, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'

@Entity('canonical_count')
export class CanonicalCount {

  public constructor(data: any) {
    assignClean(this, data)
  }

  @PrimaryColumn({ type: 'character varying', length: 128, readonly: true })
  entity!: string

  @Column({ type: 'bigint', readonly: true })
  count!: number

}
