import { UncleDetail } from '@app/core/api/apollo/types/UncleDetail'
import BigNumber from 'bignumber.js'

export class UncleDetailExt implements UncleDetail {
  __typename!: 'Uncle'
  author!: string
  gasLimit: any
  gasUsed: any
  hash!: string
  nephewNumber: any
  number: any
  parentHash!: string
  sha3Uncles!: string
  timestamp!: any
  uncleIndex!: number

  constructor(detail: UncleDetail) {
    Object.assign(this, detail)
  }

  get numberBN(): BigNumber {
    return new BigNumber(this.number || 0)
  }

  get nephewNumberBN(): BigNumber {
    return new BigNumber(this.nephewNumber || 0)
  }

  get gasLimitBN(): BigNumber {
    return new BigNumber(this.gasLimit || 0)
  }

  get gasUsedBN(): BigNumber {
    return new BigNumber(this.gasUsed || 0)
  }

  get timestampDate(): Date {
    return new Date(this.timestamp)
  }

  get timestampMs(): number {
    return this.timestamp
  }
}
