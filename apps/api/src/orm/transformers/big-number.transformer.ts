import { ValueTransformer } from 'typeorm'
import { BigNumber } from 'bignumber.js'

export class BigNumberTransformer implements ValueTransformer {

  to(value: BigNumber): string | undefined {
    if (!value) return undefined
    return value.toString(10)
  }

  from(value: string): BigNumber | undefined {
    if (!value) return undefined
    return new BigNumber(value, 10)
  }

}
