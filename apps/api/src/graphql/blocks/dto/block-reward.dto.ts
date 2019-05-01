import { assignClean } from '@app/shared/utils'
import { Reward } from '@app/graphql/schema'

export class BlockRewardDto extends Reward {
  constructor(data: any) {
    super()
    assignClean(this, data)
  }
}
