import Bn from 'bignumber.js'
import Units from 'ethereumjs-units'

export default class EthValue {
  public value: string

  constructor(_value: Buffer) {
    this.value = '0x' + new Buffer(_value).toString('hex')
    this.value = this.value === '0x' ? '0x0' : this.value
  }

  public toEth(): number {
    return Number(Units.convert(new Bn(this.value).toFixed(), 'wei', 'eth'))
  }

  public toWei(): number {
    return Number(Units.convert(new Bn(this.value).toFixed(), 'wei', 'wei'))
  }

  public toGWei(): number {
    return Number(Units.convert(new Bn(this.value).toFixed(), 'wei', 'gwei'))
  }

  public toString(): string {
    return this.value
  }
}
