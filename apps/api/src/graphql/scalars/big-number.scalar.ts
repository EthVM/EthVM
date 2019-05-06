import { Scalar } from '@nestjs/graphql';
import { BigNumber } from 'bignumber.js';
import { Kind, ValueNode } from 'graphql';

@Scalar('BigNumber')
export class BigNumberScalar {

  description = 'bignumber.js scalar type'

  parseValue(value: string): BigNumber {
    return new BigNumber(value.substr(2), 10)
  }

  serialize(value: BigNumber): string {
    return value.toString(10)
  }

  parseLiteral(ast: ValueNode) {
    if (ast.kind === Kind.STRING) {
      return new BigNumber(ast.value.substr(2), 10)
    }
    return null
  }
}
