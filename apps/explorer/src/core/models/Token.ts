import { Hex } from '@app/core/models'

export class Token {
  public readonly id: string
  private cache: any = {}

  private price?: number
  private holder?: string

  constructor(private readonly token: any) {
    this.id = '' //token.address
  }

  public getContractAddress(): Hex {
    return new Hex('0')
  }

  public getSymbol(): string {
    return this.cache.symbol
  }

  public getCreator(): string {
    return this.cache.creator
  }

  public getDecimals(): number {
    return this.cache.decimals
  }
  public getTotalHolders(): number {
    return this.cache.totalHodlers
  }

  public getTotalSupply(): number {
    return this.cache.totalSupply
  }

  public getTotalTransfers(): number {
    return this.cache.totalTransfers
  }

  public getPrice(): number | undefined {
    return this.token.price
  }

  public setPrice(_price: number) {
    this.token.price = _price
  }

  public getHolder(): string | undefined {
    return this.token.holder
  }

  public setHolder(_holder: string) {
    this.token.holder = _holder
  }
}
