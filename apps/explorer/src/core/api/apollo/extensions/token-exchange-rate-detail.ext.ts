import {
  TokenExchangeRateDetail,
  TokenExchangeRateDetail_contract,
  TokenExchangeRateDetail_contract_metadata
} from '@app/core/api/apollo/types/TokenExchangeRateDetail'
import BigNumber from 'bignumber.js'

export class TokenExchangeRateDetailExt_contract implements TokenExchangeRateDetail_contract {
  __typename!: 'Contract'
  creator: string | null
  metadata: TokenExchangeRateDetail_contract_metadata | null

  constructor(proto: TokenExchangeRateDetail_contract) {
    this.creator = proto.creator
    this.metadata = proto.metadata
  }
}

export class TokenExchangeRateDetailExt implements TokenExchangeRateDetail {
  __typename!: 'TokenExchangeRate'
  address: string | null
  circulatingSupply: any | null
  contract: TokenExchangeRateDetail_contract | null
  currentPrice: any | null
  holdersCount: number | null
  image: string | null
  marketCap: any | null
  name: string | null
  priceChangePercentage24h: any | null
  symbol: string | null
  totalSupply: any | null
  totalVolume: any | null

  constructor(proto: TokenExchangeRateDetail) {
    this.address = proto.address
    this.circulatingSupply = proto.circulatingSupply
    this.currentPrice = proto.currentPrice
    this.holdersCount = proto.holdersCount
    this.image = proto.image
    this.marketCap = proto.marketCap
    this.name = proto.name
    this.priceChangePercentage24h = proto.priceChangePercentage24h
    this.symbol = proto.symbol
    this.totalSupply = proto.totalSupply
    this.totalVolume = proto.totalVolume

    this.contract = proto.contract ? new TokenExchangeRateDetailExt_contract(proto.contract) : null
  }

  get totalSupplyBN(): BigNumber {
    return new BigNumber(this.totalSupply || 0)
  }

  get decimals(): number | null {
    const { contract } = this
    if (!(contract && contract.metadata)) {
      return null
    }
    return contract.metadata.decimals
  }

}
