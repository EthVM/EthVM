import { Column, Entity, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'

@Entity('contract')
export class ContractEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({type: 'character', length: 42, readonly: true})
  address!: string

  @Column({type: 'character', length: 42, readonly: true})
  creator?: string

  @Column({type: 'text', readonly: true})
  init?: string

  @Column({type: 'text', readonly: true})
  code?: string

  @Column({type: 'character', length: 66, readonly: true})
  refundAddress?: string

  @Column({type: 'numeric', readonly: true})
  refundBalance?: string

  @Column({type: 'text', readonly: true})
  traceCreatedAt?: string

  @Column({type: 'text', readonly: true})
  traceDestroyedAt?: string

}
