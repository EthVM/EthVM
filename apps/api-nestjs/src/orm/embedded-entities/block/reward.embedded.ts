import { Column } from 'typeorm'
import { assignClean } from '@app/shared/utils'

export class RewardEmbedded {

  constructor(data: any) {
    assignClean(this, data)
  }

  @Column({type: 'string', readonly: true})
  author: string

  @Column({type: 'string', readonly: true})
  rewardType: string

  @Column({type: 'string', readonly: true})
  value: string

}
