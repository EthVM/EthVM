import { FindOperator, FindOperatorType, ValueTransformer } from 'typeorm'

export class DateTransformer implements ValueTransformer {

  to(value?: Date | FindOperator<Date | Date[]>) {

    if (!value) {

      return undefined

    } else if (value instanceof Date) {

      return value.toString()

    } else if (value instanceof FindOperator) {

      // date is being used as part of a query e.g. In(...), LessThanOrEqual(...)

      const operator = value

      let newValue

      if (value.multipleParameters) {

        const arrayValue = (operator.value as Date[]) || []
        newValue = arrayValue.map(v => v.toString())

      } else {
        newValue = value.value ? (value.value as Date).toString() : undefined
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

  from(value?: any): Date | undefined {
    if (!value) return undefined
    if (value instanceof Date) {
      return value
    }
    return new Date(value)
  }

}
