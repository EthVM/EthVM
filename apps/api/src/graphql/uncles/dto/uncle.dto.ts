import { BigNumber, Uncle } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import { UncleEntity } from '@app/orm/entities/uncle.entity'

export class UncleDto implements Uncle {

  hash!: string
  index!: number
  nephewHash!: string
  number!: BigNumber
  height!: BigNumber
  parentHash!: string
  nonce?: BigNumber
  sha3Uncles!: string
  logsBloom!: string
  transactionsRoot!: string
  stateRoot!: string
  receiptsRoot!: string
  author!: string
  difficulty!: BigNumber
  totalDifficulty!: BigNumber
  extraData!: string
  gasLimit!: BigNumber
  gasUsed!: BigNumber
  timestamp!: Date
  size!: number
  rewardAmount!: BigNumber

  constructor(data: UncleEntity) {
    assignClean(this, data)
    if (data.reward) {
      this.rewardAmount = data.reward.amount
    }
  }

}
