import { Scalar } from '@nestjs/graphql';
import { BigNumber } from 'bignumber.js';
import { GraphQLError, Kind, ValueNode } from 'graphql'

@Scalar('BigNumber')
export class BigNumberScalar {

  description = 'bignumber.js scalar type'

  parseValue(value: string): BigNumber {
    return new BigNumber(value, 10)
  }

  serialize(value: BigNumber | string | number) {

    if (value instanceof BigNumber) {
      return value.toString(10)
    } else if (typeof value === 'string' || typeof value === 'number') {
      return value // Value may be string if from cache
    }
    throw new GraphQLError(`Value should be BigNumber, number or string. Type = ${typeof value}, value = ${value}`)
  }

  parseLiteral(ast: ValueNode) {
    if (ast.kind === Kind.STRING) {
      return new BigNumber(ast.value, 10)
    }
    return null
  }
}
