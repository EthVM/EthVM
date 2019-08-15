import { BlockDetail, BlockDetail_header, BlockDetail_rewards } from '@app/core/api/apollo/types/BlockDetail'
import BigNumber from 'bignumber.js'
import { DeltaType } from '@app/core/api/apollo/types/globalTypes'
import { EthValue } from '@app/core/models'
import { FormattedNumber, NumberFormatHelper } from '@app/core/helper/number-format-helper'

export class BlockDetailExt_header implements BlockDetail_header {
  __typename!: 'BlockHeader'
  author!: string
  blockTime!: number
  difficulty: any
  extraData!: string
  gasLimit: any
  gasUsed: any
  hash!: string
  logsBloom!: string
  nonce: any | null
  number: any
  parentHash!: string
  receiptsRoot!: string
  sha3Uncles!: string
  size!: number
  stateRoot!: string
  timestamp!: any
  totalDifficulty!: any
  transactionsRoot!: string

  constructor(data: any) {
    Object.assign(this, data)
  }

  get difficultyBN(): BigNumber {
    return new BigNumber(this.difficulty)
  }

  get gasLimitBN(): BigNumber {
    return new BigNumber(this.gasLimit)
  }

  get gasUsedBN(): BigNumber {
    return new BigNumber(this.gasUsed)
  }

  get nonceBN(): BigNumber | null {
    return this.nonce ? new BigNumber(this.nonce) : null
  }

  get numberBN(): BigNumber {
    return new BigNumber(this.number)
  }

  get totalDifficultyBN(): BigNumber {
    return new BigNumber(this.totalDifficulty)
  }

  get timestampMs(): number {
    return this.timestamp
  }
}

export class BlockDetailExt_rewards implements BlockDetail_rewards {
  __typename!: 'Reward'
  address!: string
  amount!: any
  deltaType!: DeltaType

  constructor(data: any) {
    Object.assign(this, data)
  }

  get amountBN(): BigNumber {
    return new BigNumber(this.amount)
  }
}

export class BlockDetailExt implements BlockDetail {
  __typename!: 'Block'
  header: BlockDetailExt_header
  rewards: BlockDetailExt_rewards[]
  transactionHashes!: string[]
  uncleHashes!: string[]
  totalTxFees!: BigNumber

  private _minerReward!: EthValue
  private _uncleReward!: EthValue

  constructor(detail: BlockDetail) {
    Object.assign(this, detail)

    const { header, rewards } = detail

    this.header = new BlockDetailExt_header(header)
    this.rewards = rewards.map(r => new BlockDetailExt_rewards(r))

    this.totalTxFees = detail.totalTxFees
  }

  get minerReward(): EthValue {
    if (!this._minerReward) {
      const rawReward = this.rewards!.filter(r => r!.deltaType === 'BLOCK_REWARD')
        .map(r => r!.amountBN!)
        .reduce((acc, value: any) => value, new BigNumber(0))
      this._minerReward = new EthValue(rawReward)
    }
    return this._minerReward
  }

  get minerRewardBN(): BigNumber {
    return this.rewards!.filter(r => r!.deltaType === 'BLOCK_REWARD')
      .map(r => r!.amountBN!)
      .reduce((acc, value: any) => value, new BigNumber(0))
  }

  get minerRewardFormatted(): FormattedNumber {
    return NumberFormatHelper.formatNonVariableEthValue(this.minerRewardBN)
  }

  get uncleReward(): EthValue {
    if (!this._uncleReward) {
      const rawReward = this.rewards!.filter(r => r!.deltaType === 'UNCLE_REWARD')
        .map(r => r!.amountBN!)
        .reduce((acc, value: any) => acc.plus(value), new BigNumber(0))

      this._uncleReward = new EthValue(rawReward)
    }

    return this._uncleReward
  }

  get uncleRewardBN(): BigNumber {
    return this.rewards!.filter(r => r!.deltaType === 'UNCLE_REWARD')
      .map(r => r!.amountBN!)
      .reduce((acc, value: any) => acc.plus(value), new BigNumber(0))
  }

  get uncleRewardFormatted(): FormattedNumber {
    return NumberFormatHelper.formatNonVariableEthValue(this.uncleRewardBN)
  }

  get transactionCount(): number | null {
    return this.transactionHashes ? this.transactionHashes.length : null
  }

  get totalTxFeesFormatted(): FormattedNumber {
    return NumberFormatHelper.formatNonVariableEthValue(this.totalTxFees)
  }
}
