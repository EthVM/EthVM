import { Address, EthValue, Hash, Hex, HexNumber, HexTime, WeiValue } from '@app/models'

const common = {
  Hash: (hash: Buffer): Hash => new Hash(hash),
  EthValue: (value: Buffer): EthValue => new EthValue(value),
  HexNumber: (value: Buffer): HexNumber => new HexNumber(value),
  Address: (address: Buffer): Address => new Address(address),
  AddressFromHex: (address: string): Address => new Address(Buffer.from(address.toLowerCase().replace('0x', ''), 'hex')),
  Hex: (hex: Buffer): Hex => new Hex(hex),
  HexTime: (time: Buffer): HexTime => new HexTime(time),
  HexToBuffer: (hex: string): Buffer => {
    hex = hex.substr(0, 2) === '0x' ? hex.substr(2) : hex
    hex = hex.length % 2 ? '0' + hex : hex
    return Buffer.from(hex, 'hex')
  },
  WeiValue: (value: number): WeiValue => new WeiValue(value)
}

export { common }
