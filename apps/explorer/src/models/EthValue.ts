import Bn from 'bignumber.js'
import ethUnits from 'ethereumjs-units'
import NumberFormatter from 'number-formatter'

export class EthValue {
  public value: string

  constructor(_value: Buffer) {
    this.value = '0x' + Buffer.from(_value).toString('hex')
    this.value = this.value === '0x' ? '0x0' : this.value
  }

  public toEth(): number {
    return ethUnits.convert(new Bn(this.value).toFixed(), 'wei', 'eth')
  }

  public toWei(): number {
    return ethUnits.convert(new Bn(this.value).toFixed(), 'wei', 'wei')
  }

  public toGWei(): number {
    return ethUnits.convert(new Bn(this.value).toFixed(), 'wei', 'gwei')
  }

  public toString(): string {
    return this.value
  }

  public toEthFormated(): number {
    return NumberFormatter('#,##0.##', ethUnits.convert(new Bn(this.value).toFixed(), 'wei', 'eth'))
  }
}
