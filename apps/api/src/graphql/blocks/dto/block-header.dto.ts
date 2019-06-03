import { BlockHeader } from '@app/graphql/schema'
import { BlockHeaderEntity } from '@app/orm/entities/block-header.entity'
import { assignClean } from '@app/shared/utils'
import BigNumber from 'bignumber.js'

export class BlockHeaderDto implements BlockHeader {

  author!: string
  blockTime!: number
  difficulty!: BigNumber
  extraData!: string
  gasLimit!: BigNumber
  gasUsed!: BigNumber
  hash!: string
  logsBloom!: string
  nonce?: BigNumber
  number!: BigNumber
  parentHash!: string
  receiptsRoot!: string
  sha3Uncles!: string
  size!: number
  stateRoot!: string
  timestamp!: Date
  totalDifficulty!: BigNumber
  transactionsRoot!: string

  constructor(data: BlockHeaderEntity) {
    assignClean(this, data)
  }

}
