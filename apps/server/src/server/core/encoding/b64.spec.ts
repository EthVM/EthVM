import { expect } from 'chai'
import { b64Replacer, b64Reviver } from './b64'

describe('b64', () => {
  describe('replacer', () => {
    it('should serialize plain buffers to base64 strings', () => {
      const inputs = [
        {
          data: Buffer.alloc(0),
          expected: '{"type":"Buffer","data":""}'
        },
        {
          data: Buffer.from('test'),
          expected: '{"type":"Buffer","data":"base64:dGVzdA=="}'
        },
        {
          data: { a: 1, b: Buffer.from('test') },
          expected: '{"a":1,"b":{"type":"Buffer","data":"base64:dGVzdA=="}}'
        }
      ]
      inputs.forEach(input => {
        const result = JSON.stringify(input.data, b64Replacer)
        expect(result).to.equal(input.expected)
      })
    })
  })

  describe('reviver', () => {
    it('should deserialize string JSON to correct objects', () => {
      const inputs = [
        {
          data: '{"type":"Buffer","data":""}',
          expected: Buffer.alloc(0),
          content: '',
          length: 0
        },
        {
          data: '{"type":"Buffer","data":"base64:dGVzdA=="}',
          expected: Buffer.from('test'),
          content: 'test',
          length: 4
        },
        {
          data: '{"a":1,"b":{"type":"Buffer","data":"base64:dGVzdA=="}}',
          expected: { a: 1, b: Buffer.from('test') }
        }
      ]
      inputs.forEach(input => {
        const result = JSON.parse(input.data, b64Reviver)

        if (input.length) {
          expect(result).to.be.instanceof(Buffer)
          expect(result.length).to.equal(input.length)
          expect(result.toString('utf8')).to.equal(input.content)
        } else {
          expect(result).to.deep.equals(input.expected)
        }
      })
    })
  })
})
