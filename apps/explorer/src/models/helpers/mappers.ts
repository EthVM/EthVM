import { Address } from '@app/models'

const mappers = {
  AddressFromHex: (address: string): Address => new Address(Buffer.from(address.toLowerCase().replace('0x', ''), 'hex')),
  HexToBuffer: (hex: string): Buffer => {
    hex = hex.substr(0, 2) === '0x' ? hex.substr(2) : hex
    hex = hex.length % 2 ? '0' + hex : hex
    return Buffer.from(hex, 'hex')
  }
}

export { mappers }
