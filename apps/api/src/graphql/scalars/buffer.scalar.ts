import { Scalar } from '@nestjs/graphql'

@Scalar('Buffer')
export class BufferScalar {
  description = 'Buffer custom scalar type'

  parseValue(value: string) {
    return Buffer.from(value, 'hex') // value sent to the client
  }

  serialize(value: Buffer) {
    if (value && value instanceof Buffer && Array.from(value.entries()).length) {
      return value.toString('hex')
    }
    return ''
  }

  parseLiteral(ast) {
    return Buffer.from(ast.value, 'hex')
  }
}
