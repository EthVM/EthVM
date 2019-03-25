import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'

@Entity('account_metadata')
export class AccountMetadataEntity {
  constructor(data: any) {
    assignClean(this, data)
  }

  @ObjectIdColumn({ name: '_id', type: 'string', readonly: true })
  id: ObjectID

  @Column({ type: 'long', readonly: true })
  inTxCount: number

  @Column({ type: 'boolean', readonly: true })
  isContractCreator: boolean

  @Column({ type: 'boolean', readonly: true })
  isMiner: boolean

  @Column({ type: 'long', readonly: true })
  outTxCount: number

  @Column({ type: 'long', readonly: true })
  totalTxCount: number
}
