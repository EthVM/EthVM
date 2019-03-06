import { Scalar } from '@nestjs/graphql'
import { Kind } from 'graphql'

@Scalar('Buffer')
export class BufferScalar {
  description = 'Buffer custom scalar type'

  parseValue(value) {
    return value // value from the client
  }

  serialize(value) {
    return value.Buffer // value sent to the client
  }

  parseLiteral(ast) {
    return Buffer.from(ast.value)
  }
}
