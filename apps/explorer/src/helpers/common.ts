import { Address, EthValue, Hash, Hex, HexNumber, HexTime, WeiValue } from '@app/models'

const common = {
  Hash: (_hash: Buffer): Hash => {
    return new Hash(_hash)
  },
  EthValue: (_value: Buffer): EthValue => {
    return new EthValue(_value)
  },
  HexNumber: (_value: Buffer): HexNumber => {
    return new HexNumber(_value)
  },
  Address: (_add: Buffer): Address => {
    return new Address(_add)
  },
  AddressFromHex: (_add: string): Address => {
    return new Address(new Buffer(_add.toLowerCase().replace('0x', ''), 'hex'))
  },
  Hex: (_hex: Buffer): Hex => {
    return new Hex(_hex)
  },
  HexTime: (_time: Buffer): HexTime => {
    return new HexTime(_time)
  },
  HexToBuffer: (_hex: string): Buffer => {
    _hex = _hex.substr(0, 2) === '0x' ? _hex.substr(2) : _hex
    _hex = _hex.length % 2 ? '0' + _hex : _hex
    return new Buffer(_hex, 'hex')
  },
  WeiValue: (_value: number): WeiValue => {
    return new WeiValue(_value)
  },
}

export { common }
