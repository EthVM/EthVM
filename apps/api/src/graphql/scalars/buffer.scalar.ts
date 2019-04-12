import { Scalar } from '@nestjs/graphql'

@Scalar('Buffer')
export class BufferScalar {
  description = 'Buffer custom scalar type'

  parseValue(value) {
    return value.Buffer // value from the client
  }

  serialize(value) {
    return Buffer.from(value) // value sent to the client
  }

  parseLiteral(ast) {
    return Buffer.from(ast.value)
  }
}
