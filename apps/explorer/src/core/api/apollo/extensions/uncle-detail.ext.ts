import { UncleDetail } from '@app/core/api/apollo/types/UncleDetail'
import BigNumber from 'bignumber.js'
import { NumberFormatHelper } from '@app/core/helper/number-format-helper'

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

  get numberFormatted(): string {
    return NumberFormatHelper.formatIntegerValue(this.numberBN, false).value
  }

  get nephewNumberBN(): BigNumber {
    return new BigNumber(this.nephewNumber || 0)
  }

  get nephewNumberFormatted(): string {
    return NumberFormatHelper.formatIntegerValue(this.nephewNumberBN, false).value
  }

  get gasLimitBN(): BigNumber {
    return new BigNumber(this.gasLimit || 0)
  }

  get gasLimitFormatted(): string {
    return NumberFormatHelper.formatIntegerValue(this.gasLimitBN, false).value
  }

  get gasUsedBN(): BigNumber {
    return new BigNumber(this.gasUsed || 0)
  }

  get gasUsedFormatted(): string {
    return NumberFormatHelper.formatIntegerValue(this.gasUsedBN, false).value
  }

  get timestampDate(): Date {
    return new Date(this.timestamp)
  }

  get timestampMs(): number {
    return this.timestamp
  }
}
