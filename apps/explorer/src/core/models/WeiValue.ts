import Bn from 'bignumber.js'
import ethUnits from 'ethereumjs-units'
import NumberFormatter from 'number-formatter'

export class WeiValue {
  public value: number

  constructor(_value: number) {
    this.value = _value
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
}
