import BN from 'bignumber.js'
import ethUnits from 'ethereumjs-units'
import NumberFormatter from 'number-formatter'

export class EthValue {

  private value: string | number | BN

  constructor(raw: Buffer | BN | string | number) {
    if (raw instanceof Buffer) {
      this.value = '0x' + Buffer.from(raw).toString('hex')
      this.value = this.value === '0x' ? '0x0' : this.value
      return
    }

    if (typeof raw === 'string' || typeof raw === 'number' || raw instanceof BN) {
      this.value = raw
      return
    }

    this.value = '0'
  }

  public toEth(): number {
    const value = this.value instanceof BN ? this.value : new BN(this.value)
    return ethUnits.convert(value.toFixed(), 'wei', 'eth')
  }

  public toWei(): number {
    const value = this.value instanceof BN ? this.value : new BN(this.value)
    return ethUnits.convert(value.toFixed(), 'wei', 'wei')
  }

  public toGWei(): number {
    const value = this.value instanceof BN ? this.value : new BN(this.value)
    return ethUnits.convert(value.toFixed(), 'wei', 'gwei')
  }

  public toEthFormated(): number {
    const value = this.value instanceof BN ? this.value : new BN(this.value)
    return NumberFormatter('#,##0.##', ethUnits.convert(value.toFixed(), 'wei', 'eth'))
  }

  public toString(): string {
    if (typeof this.value === 'number' || this.value instanceof BN) {
      return this.value.toString()
    }
    return this.value
  }
}
