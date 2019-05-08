import { FindOperator, FindOperatorType, ValueTransformer } from 'typeorm'
import { BigNumber } from 'bignumber.js'

export class BigNumberTransformer implements ValueTransformer {

  to(value?: BigNumber | FindOperator<BigNumber | BigNumber[]>) {

    if (!value) {

      return undefined

    } else if (value instanceof BigNumber) {

      return value.toString(10)

    } else if (value instanceof FindOperator) {

      // big number is being used as part of a query e.g. In(...), LessThanOrEqual(...)

      const operator = value

      let newValue

      if (value.multipleParameters) {

        const arrayValue = (operator.value as BigNumber[]) || []
        newValue = arrayValue.map(v => v.toString(10))

      } else {
        newValue = value.value ? (value.value as BigNumber).toString(10) : undefined
      }

      // we need this naked reference so we can access the private _type property
      const operatorNaked = value as any

      return new FindOperator(
        operatorNaked._type as FindOperatorType,
        newValue,
        operator.useParameter,
        operator.multipleParameters,
      )

    }
  }

  from(value?: string): BigNumber | undefined {
    if (!value) return undefined
    return new BigNumber(value, 10)
  }

}
