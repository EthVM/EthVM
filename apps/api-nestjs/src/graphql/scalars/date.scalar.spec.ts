import { DateScalar } from '@app/graphql/scalars/date.scalar'
import { Kind } from 'graphql'

const testScalar = new DateScalar()

describe('DateScalar', () => {
  it('should serialize', () => {
    const now = new Date()
    expect(testScalar.serialize(now)).toEqual(now.getTime())
  })

  it('shoud parseValue', () => {
    const now = new Date()
    expect(testScalar.parseValue(now)).toEqual(now)
  })

  it('shoud parseLiteral', () => {
    const now = new Date()
    expect(
      testScalar.parseLiteral({
        value: now.getTime() + '',
        kind: Kind.INT
      })
    ).toEqual(parseInt(now.getTime() + '', 10))
  })
})
