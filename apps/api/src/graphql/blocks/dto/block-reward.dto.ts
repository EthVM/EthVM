import { assignClean } from '@app/shared/utils'
import { DeltaType, Reward } from '@app/graphql/schema'
import BigNumber from 'bignumber.js'
import {BlockRewardEntity} from '@app/orm/entities/block-reward.entity';

export class BlockRewardDto implements Reward {

  address!: string
  amount!: BigNumber
  blockHash!: string
  deltaType!: DeltaType

  constructor(data: BlockRewardEntity) {
    assignClean(this, data)
  }

}
