import { BlockDetail, BlockDetail_header, BlockDetail_rewards } from '@app/core/api/apollo/types/BlockDetail'
import BigNumber from 'bignumber.js'
import { DeltaType } from '@app/core/api/apollo/types/globalTypes'
import { EthValue } from '@app/core/models'
import { TransactionSummaryPage } from '@app/core/api/apollo/types/TransactionSummaryPage'
import { TransactionSummaryExt } from '@app/core/api/apollo/extensions/transaction-summary.ext'

export class BlockDetailExt_header implements BlockDetail_header {
  __typename!: 'BlockHeader'
  author!: string | null
  blockTime!: number | null
  difficulty!: any | null
  extraData!: string | null
  gasLimit!: any | null
  gasUsed!: any | null
  hash!: string | null
  logsBloom!: string | null
  nonce!: any | null
  number!: any | null
  parentHash!: string | null
  receiptsRoot!: string | null
  sha3Uncles!: string | null
  size!: number | null
  stateRoot!: string | null
  timestamp!: number | null
  totalDifficulty!: any | null
  transactionsRoot!: string | null

  constructor(data: any) {
    Object.assign(this, data)
  }

  get difficultyBN(): BigNumber | null {
    return this.difficulty ? new BigNumber(this.difficulty) : null
  }

  get gasLimitBN(): BigNumber | null {
    return this.gasLimit ? new BigNumber(this.gasLimit) : null
  }

  get gasUsedBN(): BigNumber | null {
    return this.gasUsed ? new BigNumber(this.gasUsed) : null
  }

  get nonceBN(): BigNumber | null {
    return this.nonce ? new BigNumber(this.nonce) : null
  }

  get numberBN(): BigNumber | null {
    return this.number ? new BigNumber(this.number) : null
  }

  get totalDifficultyBN(): BigNumber | null {
    return this.totalDifficulty ? new BigNumber(this.totalDifficulty) : null
  }

  get timestampMs(): number | null {
    return this.timestamp ? this.timestamp * 1000 : null
  }
}

export class BlockDetailExt_rewards implements BlockDetail_rewards {
  __typename!: 'Reward'
  address!: string | null
  amount!: any | null
  deltaType!: DeltaType | null

  constructor(data: any) {
    Object.assign(this, data)
  }

  get amountBN(): BigNumber | null {
    return this.amount ? new BigNumber(this.amount) : null
  }
}

export class BlockDetailExt implements BlockDetail {
  __typename!: 'Block'
  header!: BlockDetailExt_header | null
  rewards!: (BlockDetailExt_rewards | null)[] | null
  transactionHashes!: (string | null)[] | null
  uncleHashes!: (string | null)[] | null

  totalTxFees: EthValue

  private _minerReward!: EthValue
  private _uncleReward!: EthValue

  constructor(detail: BlockDetail, transactionSummaryPage: TransactionSummaryPage) {
    Object.assign(this, detail)

    const { header, rewards } = detail

    this.header = header ? new BlockDetailExt_header(header) : null
    this.rewards = rewards ? rewards.map(r => (r ? new BlockDetailExt_rewards(r) : null)) : null

    if (!transactionSummaryPage) {
      throw new Error('transactionSummaryPage is required')
    }
    const { totalCount: txCount, items } = transactionSummaryPage

    if (txCount < items!.length) {
      throw new Error('Not all transaction summaries were retrieved')
    }

    const totalTxFees = items!
      .map(summary => new TransactionSummaryExt(summary!))
      .map(summary => summary.feeBN!)
      .reduce((memo, next) => memo.plus(next), new BigNumber(0))

    this.totalTxFees = new EthValue(totalTxFees)
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

  get uncleReward(): EthValue {
    if (!this._uncleReward) {
      const rawReward = this.rewards!.filter(r => r!.deltaType === 'UNCLE_REWARD')
        .map(r => r!.amountBN!)
        .reduce((acc, value: any) => acc.plus(value), new BigNumber(0))

      this._uncleReward = new EthValue(rawReward)
    }

    return this._uncleReward
  }

  get transactionCount(): number | null {
    return this.transactionHashes ? this.transactionHashes.length : null
  }
}
