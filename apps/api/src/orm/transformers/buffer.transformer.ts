import { FindOperator, FindOperatorType, ValueTransformer } from 'typeorm'

export class BufferTransformer implements ValueTransformer {

  to(value?: Buffer | FindOperator<Buffer | Buffer[]>) {

    if (!value) {

      return undefined

    } else if (value instanceof Buffer) {

      return value.toString('hex')

    } else if (value instanceof FindOperator) {

      // Buffer is being used as part of a query e.g. In(...), LessThanOrEqual(...)

      const operator = value

      let newValue

      if (value.multipleParameters) {

        const arrayValue = (operator.value as Buffer[]) || []
        newValue = arrayValue.map(v => v.toString('hex'))

      } else {
        newValue = value.value ? (value.value as Buffer).toString('hex') : undefined
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

  from(value?: any): Buffer | undefined {
    if (!value) return undefined
    if (value instanceof Buffer) {
      return value
    }
    if (typeof value === 'string') {
      return Buffer.from(value, 'hex')
    }
    return Buffer.from(value)
  }

}
