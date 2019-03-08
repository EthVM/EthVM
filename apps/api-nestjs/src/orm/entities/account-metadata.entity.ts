import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'

@Entity('account_metadata')
export class AccountMetadataEntity {

  constructor(data: any) {
    assignClean(this, data)
  }

  @ObjectIdColumn({name: '_id', type: 'decimal', readonly: true})
  id: ObjectID

  @Column({type: 'long'})
  inTxCount: number

  @Column({type: 'boolean'})
  isContractCreator: boolean

  @Column({type: 'boolean'})
  isMiner: boolean

  @Column({type: 'long'})
  outTxCount: number

  @Column({type: 'long'})
  totalTxCount: number

}
