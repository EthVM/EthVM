import { Scalar } from '@nestjs/graphql'
import { Kind } from 'graphql'
import { GraphQLError } from 'graphql/error'

@Scalar('Date')
export class DateScalar {
  description = 'Date custom scalar type'

  parseValue(value) {
    return new Date(value) // value from the client
  }

  serialize(value) {
    return value.getTime() // value sent to the client
  }

  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10) // ast value is always in string format
    }
    return GraphQLError('Should be INT')
  }
}
