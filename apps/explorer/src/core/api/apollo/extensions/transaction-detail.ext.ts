import { TransactionDetail, TransactionDetail_receipt } from '@app/core/api/apollo/types/TransactionDetail'
import BigNumber from 'bignumber.js'
import Signatures from '@app/core/helper/signatures.json'
import { FormattedNumber, NumberFormatHelper } from '@app/core/helper/number-format-helper'

export class TransactionDetailExt_receipt implements TransactionDetail_receipt {
  __typename!: 'Receipt'
  contractAddress: string | null
  gasUsed: any

  constructor(proto: TransactionDetail_receipt) {
    this.contractAddress = proto.contractAddress
    this.gasUsed = proto.gasUsed
  }

  get gasUsedBN(): BigNumber {
    return new BigNumber(this.gasUsed || 0)
  }

  get gasUsedFormatted(): string {
    return NumberFormatHelper.formatIntegerValue(this.gasUsedBN).value
  }
}

export class TransactionDetailExt implements TransactionDetail {
  __typename!: 'Transaction'
  blockHash!: string
  blockNumber: any
  from!: string
  gas: any
  gasPrice: any
  hash!: string
  input: any
  nonce: any
  timestamp!: any
  to: string | null
  value: any
  receipt: TransactionDetailExt_receipt | null

  constructor(proto: TransactionDetail) {
    this.blockHash = proto.blockHash
    this.blockNumber = proto.blockNumber
    this.from = proto.from
    this.gas = proto.gas
    this.gasPrice = proto.gasPrice
    this.hash = proto.hash
    this.input = proto.input
    this.nonce = proto.nonce
    this.timestamp = proto.timestamp
    this.to = proto.to
    this.value = proto.value

    const { receipt } = proto
    this.receipt = receipt ? new TransactionDetailExt_receipt(receipt) : null
  }

  get blockNumberBN(): BigNumber {
    return new BigNumber(this.blockNumber)
  }

  get blockNumberFormatted(): string {
    return NumberFormatHelper.formatIntegerValue(this.blockNumberBN).value
  }

  get gasBN(): BigNumber {
    return new BigNumber(this.gas)
  }

  get gasFormatted(): string {
    return NumberFormatHelper.formatIntegerValue(this.gasBN).value
  }

  get gasPriceBN(): BigNumber {
    return new BigNumber(this.gasPrice)
  }

  get gasPriceFormatted(): FormattedNumber {
    return NumberFormatHelper.formatNonVariableGWeiValue(this.gasPriceBN)
  }

  get nonceBN(): BigNumber {
    return new BigNumber(this.nonce)
  }

  get nonceFormatted(): string {
    return NumberFormatHelper.formatIntegerValue(this.nonceBN).value
  }

  get valueBN(): BigNumber {
    return new BigNumber(this.value)
  }

  get valueFormatted(): FormattedNumber {
    return NumberFormatHelper.formatVariableUnitEthValue(this.valueBN, true)
  }

  get timestampMs(): number {
    return this.timestamp
  }

  get feeFormatted(): FormattedNumber {
    if (this.blockNumber == new BigNumber(0)) {
      // for genesis block we have no receipt
      return NumberFormatHelper.formatNonVariableEthValue(new BigNumber(0), true)
    }
    const gasUsed = this.receipt!.gasUsedBN
    return NumberFormatHelper.formatNonVariableEthValue(this.gasPriceBN.multipliedBy(gasUsed), true)
  }

  get inputMethodId(): string | null {
    return this.input ? `0x${this.input.substr(0, 8)}` : null
  }

  get inputFunction(): string | null {
    if (!this.input) {
      return null
    }

    const methodId = this.inputMethodId

    const signatures = Signatures.results

    if (!signatures && signatures.length) {
      return null
    }

    const index = signatures.findIndex(i => i.hex_signature === methodId)

    return index > -1 ? signatures[index].text_signature : null
  }
}
