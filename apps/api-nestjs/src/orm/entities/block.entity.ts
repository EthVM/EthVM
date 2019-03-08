import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { HeaderEmbedded } from '@app/orm/embedded-entities/header.embedded'
import { RewardEmbedded } from '@app/orm/embedded-entities/reward.embedded'
import { TxEmbedded } from '@app/orm/embedded-entities/tx.embedded'
import { UncleEmbedded } from '@app/orm/embedded-entities/uncle.embedded'

@Entity('blocks')
export class BlockEntity {

  constructor(data: any) {
    assignClean(this, data)
  }

  @ObjectIdColumn({name: '_id', type: 'decimal', readonly: true})
  number: ObjectID

  @Column({type: 'string', readonly: true})
  totalDifficulty: string

  @Column(type => HeaderEmbedded)
  header: HeaderEmbedded

  @Column(type => RewardEmbedded)
  rewards: RewardEmbedded[]

  @Column(type => TxEmbedded)
  transactions: TxEmbedded[]

  @Column(type => UncleEmbedded)
  uncles: UncleEmbedded[]

}
