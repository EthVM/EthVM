import { DecimalScalar } from '@app/graphql/scalars/decimal.scalar'
import { Kind } from 'graphql'

const testScalar = new DecimalScalar()

describe('DecimalScalar', () => {
  it('should serialize', () => {
    const now = new Date()
    expect(testScalar.serialize(222.22)).toEqual(222.22)
  })

  it('shoud parseValue', () => {
    const now = new Date()
    expect(testScalar.parseValue(222.22)).toEqual(222.22)
  })

  it('shoud parseLiteral', () => {
    const now = new Date()
    expect(
      testScalar.parseLiteral({
        value: 111.1,
        kind: Kind.FLOAT
      })
    ).toEqual(111.1)
  })
})
