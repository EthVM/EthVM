import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { UncleEmbedded } from '@app/orm/embedded-entities/block/uncle.embedded'

@Entity('uncles')
export class UncleEntity extends UncleEmbedded {

  constructor(data: any) {
    super(data)
    assignClean(this, data)
  }

  @ObjectIdColumn({name: '_id', type: 'string', readonly: true})
  id: ObjectID

  @Column({type: 'long', readonly: true})
  blockNumber: number

  @Column({type: 'string', readonly: true})
  receiptsRoot: string

  @Column({type: 'int', readonly: true})
  uncleIndex: number

}
