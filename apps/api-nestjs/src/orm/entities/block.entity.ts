import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { HeaderEmbedded } from '@app/orm/embedded-entities/block/header.embedded'
import { RewardEmbedded } from '@app/orm/embedded-entities/block/reward.embedded'
import { TxEmbedded } from '@app/orm/embedded-entities/block/tx.embedded'
import { UncleEmbedded } from '@app/orm/embedded-entities/block/uncle.embedded'

@Entity('blocks')
export class BlockEntity {

  constructor(data: any) {
    assignClean(this, data)
  }

  @ObjectIdColumn({name: '_id', readonly: true})
  id: ObjectID

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
