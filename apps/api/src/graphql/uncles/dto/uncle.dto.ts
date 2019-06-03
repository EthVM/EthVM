import { BigNumber, Uncle } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class UncleDto implements Uncle {

  hash!: string
  index!: number
  nephewNumber!: BigNumber
  nephewHash!: string
  number!: BigNumber
  height!: string
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

  constructor(data: any) {
    assignClean(this, data)
  }

}
