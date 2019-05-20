import { assignClean } from '@app/shared/utils'
import { DeltaType, Reward } from '@app/graphql/schema'
import BigNumber from 'bignumber.js'

export class BlockRewardDto implements Reward {

  address!: string
  amount!: BigNumber
  blockHash!: string
  deltaType!: DeltaType

  constructor(data: any) {
    assignClean(this, data)
  }

}
