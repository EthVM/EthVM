import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { EmbeddedTx } from '@app/orm/embedded-entities/embedded-tx'
import { EmbeddedHeader } from '@app/orm/embedded-entities/embedded-header'
import { EmbeddedReward } from '@app/orm/embedded-entities/embedded-reward'

@Entity('blocks')
export class BlockEntity {

  constructor(data: any) {
    assignClean(this, data)
  }

  @ObjectIdColumn({name: '_id', type: 'decimal', readonly: true})
  number: ObjectID

  @Column({type: 'string', readonly: true})
  totalDifficulty: string

  @Column(type => EmbeddedHeader)
  header: EmbeddedHeader

  @Column(type => EmbeddedReward)
  rewards: EmbeddedReward[]

  @Column(type => EmbeddedTx)
  transactions: EmbeddedTx[]

}
