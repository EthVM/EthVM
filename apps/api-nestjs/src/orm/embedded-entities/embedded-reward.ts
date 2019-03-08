import { Column } from 'typeorm'

export class EmbeddedReward {

  @Column({type: 'string', readonly: true})
  author: string

  @Column({type: 'string', readonly: true})
  rewardType: string

  @Column({type: 'string', readonly: true})
  value: string

}
