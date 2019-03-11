import { Entity, ObjectID, ObjectIdColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { TxEmbedded } from '@app/orm/embedded-entities/block/tx.embedded'

@Entity('transactions')
export class TransactionEntity extends TxEmbedded {

  constructor(data: any) {
    super(data)
    assignClean(this, data)
  }

  @ObjectIdColumn({name: '_id', type: 'string', readonly: true})
  id: ObjectID

}
