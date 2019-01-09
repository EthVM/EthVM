import { Account as RawAccount } from 'ethvm-common'

export class Account {
  public readonly id: string
  private cache: any

  constructor(private readonly address: RawAccount) {
    this.cache = {}
    this.id = address.address
  }

  public getBalance() {
    if (!this.cache.balance) {
      this.cache.balance = this.address.balance
    }
    return this.cache.balance
  }

  public getHexAddress() {
    if (!this.cache.hexAddress) {
      this.cache.hexAddress = '0x' + this.address
    }
    return this.cache.hexAddress
  }
}
