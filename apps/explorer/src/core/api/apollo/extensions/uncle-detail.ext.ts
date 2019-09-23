import { UncleDetail } from '@app/core/api/apollo/types/UncleDetail'
import BigNumber from 'bignumber.js'
import { NumberFormatHelper, FormattedNumber } from '@app/core/helper/number-format-helper'

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
    return this.numberBN.toFormat()
  }

  get nephewNumberBN(): BigNumber {
    return new BigNumber(this.nephewNumber || 0)
  }

  get nephewNumberFormatted(): string {
    return this.nephewNumberBN.toFormat()
  }

  get gasLimitBN(): BigNumber {
    return new BigNumber(this.gasLimit || 0)
  }

  get gasLimitFormatted(): FormattedNumber {
    return NumberFormatHelper.formatIntegerValue(this.gasLimitBN)
  }

  get gasUsedBN(): BigNumber {
    return new BigNumber(this.gasUsed || 0)
  }

  get gasUsedFormatted(): FormattedNumber {
    return NumberFormatHelper.formatIntegerValue(this.gasUsedBN)
  }

  get timestampDate(): Date {
    return new Date(this.timestamp)
  }

  get timestampMs(): number {
    return this.timestamp
  }
}
