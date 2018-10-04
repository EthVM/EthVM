import { common } from '@app/helpers'
import { Address, EthValue, Hash, Hex, HexNumber, HexTime, Tx } from '@app/models'
import { AddressLayout } from '@app/models/server'

export class Account {
  public readonly id: string
  private readonly address: AddressLayout
  private cache: any

  constructor(address: AddressLayout) {
    this.cache = {}
    this.address = address
    this.id = this.address.address
  }

  public getBalance() {
    if (!this.cache.balance) {
      this.cache.balance = common.EthValue(this.address.balance)
    }
    return this.cache.balance
  }

  public getHexAddress() {
    if (!this.cache.hexAddress) {
      this.cache.hexAddress = '0x'+this.address
    }
    return this.cache.hexAddress
  }
}
