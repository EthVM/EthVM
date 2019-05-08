import { Scalar } from '@nestjs/graphql'

@Scalar('Buffer')
export class BufferScalar {
  description = 'Buffer custom scalar type'

  parseValue(value: string) {
    return Buffer.from(value, 'hex') // value sent to the client
  }

  serialize(value: Buffer) {
    return value.toString('hex')
  }

  parseLiteral(ast) {
    return Buffer.from(ast.value, 'hex')
  }
}
