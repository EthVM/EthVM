import { Scalar } from '@nestjs/graphql'
import { Kind } from 'graphql'
import { GraphQLError } from 'graphql/error'

@Scalar('StatisticValue')
export class StatisticValueScalar {
  description = 'Statistic Value custom scalar type'

  parseValue(value) {
    return value // value from the client
  }

  serialize(value) {
    return value // value sent to the client
  }

  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10) // ast value is always in string format
    }
    else if (ast.kind === Kind.STRING) {
      return ast.value
    }
    else if (ast.kind === Kind.FLOAT) {
      return parseFloat(ast.value)
    }
    return new GraphQLError('Should be INT or STRING or FLOAT')
  }
}
