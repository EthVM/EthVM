import { Address, EthValue, Hash, Hex, HexNumber, HexTime, WeiValue } from '@app/models'

const common = {
  Hash: (_hash: Buffer): Hash => new Hash(_hash),
  EthValue: (_value: Buffer): EthValue => new EthValue(_value),
  HexNumber: (_value: Buffer): HexNumber => new HexNumber(_value),
  Address: (_add: Buffer): Address => new Address(_add),
  AddressFromHex: (_add: string): Address => new Address(Buffer.from(_add.toLowerCase().replace('0x', ''), 'hex')),
  Hex: (_hex: Buffer): Hex => new Hex(_hex),
  HexTime: (_time: Buffer): HexTime => new HexTime(_time),
  HexToBuffer: (_hex: string): Buffer => {
    _hex = _hex.substr(0, 2) === '0x' ? _hex.substr(2) : _hex
    _hex = _hex.length % 2 ? '0' + _hex : _hex
    return Buffer.from(_hex, 'hex')
  },
  WeiValue: (_value: number): WeiValue => new WeiValue(_value)
}

export { common }
