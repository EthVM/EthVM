import { Address, EthValue, Hash, Hex, HexNumber, HexTime } from '@app/models'

const common = {
  Hash: (hash: Buffer): Hash => new Hash(hash),

  EthValue: (value: Buffer): EthValue => new EthValue(value),

  HexNumber: (value: Buffer): HexNumber => new HexNumber(value),

  Address: (address: Buffer): Address => new Address(address),

  AddressFromHex: (_add: string): Address => new Address(new Buffer(_add.toLowerCase().replace('0x', ''), 'hex')),

  Hex: (hex: Buffer): Hex => new Hex(hex),

  HexTime: (time: Buffer): HexTime => new HexTime(time),

  HexToBuffer: (hex: string): Buffer => {
    hex = hex.substr(0, 2) === '0x' ? hex.substr(2) : hex
    hex = hex.length % 2 ? '0' + hex : hex
    return new Buffer(hex, 'hex')
  }
}

export { common }
