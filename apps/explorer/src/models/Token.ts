//import { Token } from 'ethvm-common'

// export class Token {
//   public readonly id: string
//   private cache: any
//   private price: number
//   private holder?: string

//   constructor(private readonly token: Token) {
//     this.cache = {}
//     this.id = token.address
//   }

//   public getSymbol() {
//     if (!this.cache.symbol) {
//       this.cache.symbol = this.token.symbol
//     }
//     return this.cache.symbol
//   }

//   public getHexAddress() {
//     if (!this.cache.hexAddress) {
//       this.cache.hexAddress = '0x' + this.address
//     }
//     return this.cache.hexAddress
//   }

//   public getCreator() {
//     if (!this.cache.creator) {
//       this.cache.symbol = '0x'+this.token.creator
//     }
//     return this.cache.creator
//   }

//   public getDecimals() {
//     if (!this.cache.decimals) {
//       this.cache.decimals = this.token.decimals
//     }
//     return this.cache.decimals
//   }
//   public getTotalHolders() {
//     if(!this.cache.totalHolders) {
//       this.cache.totalHolders = this.token.totalHolders
//     }
//     return this.cache.totalHodlers
//   }

//   public getTotalSupply() {
//     if(!this.cache.totalSupply) {
//       this.cache.totalSupply = this.token.totalSupply
//     }
//     return this.cache.totalSupply
//   }

//   public getTotalTransfers() {
//     if(!this.cache.totalTrasfers) {
//       this.cache.totalTransfers = this.token.totalTransfers
//     }
//     return this.cache.totalTransfers
//   }

//   /* Price : */
//   public getPrice() {
//     return this.token.price
//   }

//   public setPrice(_price: number) {
//     this.token.price = _price
//   }

//   public getHolder() {
//     return this.token.holder
//   }

//   public setHolder(_holder: string) {
//     this.token.holder = _holder
//   }
// }


