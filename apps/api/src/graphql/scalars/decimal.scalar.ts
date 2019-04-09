import { Scalar } from '@nestjs/graphql'
import { Kind } from 'graphql'
import { GraphQLError } from 'graphql/error'

const VALUE_TYPES = {
  INT: 'int',
  FLOAT: 'float'
}

@Scalar('Decimal')
export class DecimalScalar {
  name = 'Decimal'
  description = 'Floats that will have a value of 0 or more.'

  public serialize(value) {
    return this.processValue(value, { type: VALUE_TYPES.FLOAT })
  }

  public parseValue(value) {
    return this.processValue(value, { type: VALUE_TYPES.FLOAT })
  }

  public parseLiteral(ast) {
    if (ast.kind !== Kind.FLOAT) {
      throw new GraphQLError(`Can only validate floating point numbers as non-negative floating point numbers but got a: ${ast.kind}`)
    }

    return this.processValue(ast.value, { type: VALUE_TYPES.FLOAT })
  }

  private processValue(value, validation): number | undefined {
    const { type } = validation

    if (value === null || typeof value === 'undefined' || Number.isNaN(value) || value === Number.NaN) {
      throw new TypeError(`Value is not a number: ${value}`)
    }

    let parsedValue

    switch (type) {
      case VALUE_TYPES.FLOAT:
        parsedValue = parseFloat(value)
        this.validateFloat(parsedValue)
        break

      case VALUE_TYPES.INT:
        parsedValue = parseInt(value, 10)
        this.validateInt(parsedValue)
        break

      default:
      // no -op, return undefined
    }

    return parsedValue
  }

  private validateFloat(value: any): void {
    if (!Number.isFinite(value)) {
      throw new TypeError(`Value is not a finite number: ${value}`)
    }
  }

  private validateInt(value: any): void {
    if (!Number.isFinite(value)) {
      throw new TypeError(`Value is not a finite number: ${value}`)
    }

    if (!Number.isInteger(value)) {
      throw new TypeError(`Value is not an integer: ${value}`)
    }

    if (!Number.isSafeInteger(value)) {
      throw new TypeError(`Value is not a safe integer: ${value}`)
    }
  }
}
