import Bn from 'bignumber.js'
import ethUnits from 'ethereumjs-units'
import NumberFormatter from 'number-formatter'

export class EthValue {
  private value: string | number

  constructor(raw: Buffer | string | number) {
    if (raw instanceof Buffer) {
      this.value = '0x' + Buffer.from(raw).toString('hex')
      this.value = this.value === '0x' ? '0x0' : this.value
      return
    }

    if (typeof raw  === 'string' || typeof raw === 'number') {
      this.value = raw
      return
    }

    this.value = '0'
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

  public toEthFormated(): number {
    return NumberFormatter('#,##0.##', ethUnits.convert(new Bn(this.value).toFixed(), 'wei', 'eth'))
  }

  public toString(): string {
    if (typeof this.value === 'number') {
      return this.value.toString()
    }
    return this.value
  }
}
