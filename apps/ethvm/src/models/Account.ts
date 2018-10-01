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
    return this.address.balance
  }
}
