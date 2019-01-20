import { Hex } from '@app/core/models'
// import { Token as RawToken } from 'ethvm-common'

export class Token {
  public readonly id: string
  private cache: any = {}

  private price: number
  private holder?: string

  constructor(private readonly token: Token) {
    this.id = '' //token.address
  }

  public getContractAddress(): Hex {
    return new Hex('0')
  }

  public getSymbol(): string {
    // if (!this.cache.symbol) {
    //   this.cache.symbol = this.token.symbol
    // }
    return this.cache.symbol
  }

  public getCreator(): string {
    // if (!this.cache.creator) {
    //   this.cache.symbol = '0x' + this.token.creator
    // }
    return this.cache.creator
  }

  public getDecimals(): number {
    // if (!this.cache.decimals) {
    //   this.cache.decimals = this.token.decimals
    // }
    return this.cache.decimals
  }
  public getTotalHolders(): number {
    // if(!this.cache.totalHolders) {
    //   this.cache.totalHolders = this.token.totalHolders
    // }
    return this.cache.totalHodlers
  }

  public getTotalSupply(): number {
    // if(!this.cache.totalSupply) {
    //   this.cache.totalSupply = this.token.totalSupply
    // }
    return this.cache.totalSupply
  }

  public getTotalTransfers(): number {
    // if(!this.cache.totalTrasfers) {
    //   this.cache.totalTransfers = this.token.totalTransfers
    // }
    return this.cache.totalTransfers
  }

  public getPrice(): number {
    return this.token.price
  }

  public setPrice(_price: number) {
    this.token.price = _price
  }

  public getHolder(): string {
    return this.token.holder
  }

  public setHolder(_holder: string) {
    this.token.holder = _holder
  }
}
