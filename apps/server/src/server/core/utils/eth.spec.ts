import { expect } from 'chai'
import { hexToBuffer, isBuffer, isValidHash } from './eth'

describe('helpers.eth', () => {
  describe('isBuffer()', () => {
    it('should validate correct buffer objects', () => {
      const inputs = [
        {
          buffer: Buffer.alloc(0),
          length: 0
        },
        {
          buffer: Buffer.from(''),
          length: 0
        },
        {
          buffer: Buffer.from('b903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238', 'hex'),
          length: 32
        },
        {
          buffer: Buffer.from('b60e8dd61c5d32be8058bb8eb970870f07233155', 'hex'),
          length: 20
        }
      ]
      inputs.forEach(input => {
        const isValid = isBuffer(input.buffer, input.length)
        expect(isValid).to.be.true
      })
    })

    it('should not validate incorrect buffer objects', () => {
      const inputs = [
        {
          buffer: Buffer.alloc(0),
          length: 1
        },
        {
          buffer: Buffer.from('cheese'),
          length: 0
        },
        {
          buffer: Buffer.from('b903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce', 'hex'),
          length: 32
        },
        {
          buffer: Buffer.from('b60e8dd61c5d32be8058bb8eb970870f075', 'hex'),
          length: 20
        },
        {
          buffer: 'another thing',
          length: 20
        },
        {
          buffer: Buffer.alloc(0),
          length: -12
        }
      ]
      inputs.forEach(input => {
        const isValid = isBuffer(input.buffer, input.length)
        expect(isValid).to.be.false
      })
    })
  })

  describe('isValidHash()', () => {
    it('should validate correctly tx hashes', () => {
      const inputs = [
        '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238',
        '0xB903239F8543D04B5DC1BA6579132B143087C68DB1B2168786408FCBCE568238'
      ]
      inputs.forEach(input => {
        const isValid = isValidHash(input)
        expect(isValid).to.be.true
      })
    })

    it('should not validate incorrect tx hashes', () => {
      const inputs = [
        '0XB903239F8543D04B5DC1BA6579132B143087C68DB1B2168786408FCBCE568238',
        '0xb903239f8543d04b5dc1ba6579132b143087c68db1b21',
        '0XB903239F8543D04B5DC1BA6579132B143087C68DB1B21687864CBCE568238',
        'B903239F8543D04B5DC1BA6579132B143087C68DB1786408FCBCE568238'
      ]
      inputs.forEach(input => {
        const isValid = isValidHash(input)
        expect(isValid).to.be.false
      })
    })
  })

  describe('hexToBuffer()', () => {
    it('should properly convert a hexadecimal string to a buffer', () => {
      const inputs = [
        {
          hex: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238',
          length: 32
        },
        {
          hex: '0xB903239F8543D04B5DC1BA6579132B143087C68DB1B2168786408FCBCE568238',
          length: 32
        },
        {
          hex: 'B903239F8543D04B5DC1BA6579132B143087C68DB1B2168786408FCBCE568238',
          length: 32
        },
        {
          hex: '',
          length: 0
        }
      ]
      inputs.forEach(input => {
        const b = hexToBuffer(input.hex)
        expect(b).to.be.instanceof(Buffer)
        expect(b.length).to.equal(input.length)
      })
    })
  })
})
