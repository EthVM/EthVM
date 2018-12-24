import { Scalar } from '@nestjs/graphql'
import { Kind } from 'graphql'
import { GraphQLError } from 'graphql/error'

@Scalar('Decimal')
export class DecimalScalar {
  name: 'Decimal'
  description: 'Floats that will have a value of 0 or more.'

  serialize(value) {
    return processValue(value, {
      range: VALUE_RANGES.NON_NEGATIVE,
      type: VALUE_TYPES.FLOAT
    })
  }

  parseValue(value) {
    return processValue(value, {
      range: VALUE_RANGES.NON_NEGATIVE,
      type: VALUE_TYPES.FLOAT
    })
  }

  parseLiteral(ast) {
    if (ast.kind !== Kind.FLOAT) {
      throw new GraphQLError(`Can only validate floating point numbers as non-negative floating point numbers but got a: ${ast.kind}`)
    }

    return processValue(ast.value, {
      range: VALUE_RANGES.NON_NEGATIVE,
      type: VALUE_TYPES.FLOAT
    })
  }
}

const VALUE_RANGES = {
  NEGATIVE: 'NEGATIVE',
  NON_NEGATIVE: 'NON_NEGATIVE',
  POSITIVE: 'POSITIVE',
  NON_POSITIVE: 'NON_POSITIVE'
}

const VALUE_TYPES = {
  INT: 'int',
  FLOAT: 'float'
}

function _validateFloat(value) {
  if (!Number.isFinite(value)) {
    throw new TypeError(`Value is not a finite number: ${value}`)
  }
}

function _validateInt(value) {
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

function processValue(value, validation) {
  console.log("validation",validation)
  const { range, type } = validation

  /* eslint-disable no-restricted-globals */
  if (value === null || typeof value === 'undefined' || isNaN(value) || Number.isNaN(value) || value === Number.NaN) {
    throw new TypeError(`Value is not a number: ${value}`)
  }
  /* eslint-enable */

  let parsedValue

  switch (type) {
    case VALUE_TYPES.FLOAT:
      parsedValue = parseFloat(value)
      _validateFloat(parsedValue)
      break

    case VALUE_TYPES.INT:
      parsedValue = parseInt(value, 10)
      _validateInt(parsedValue)
      break

    default:
    // no -op, return undefined
  }

  if (
    (range === VALUE_RANGES.NEGATIVE && !(parsedValue < 0)) ||
    (range === VALUE_RANGES.NON_NEGATIVE && !(parsedValue >= 0)) ||
    (range === VALUE_RANGES.POSITIVE && !(parsedValue > 0)) ||
    (range === VALUE_RANGES.NON_POSITIVE && !(parsedValue <= 0))
  ) {
    throw new TypeError(`Value is not a ${VALUE_RANGES[range].toLowerCase().replace('_', '-')} number: ${value}`)
  }

  return parsedValue
}
