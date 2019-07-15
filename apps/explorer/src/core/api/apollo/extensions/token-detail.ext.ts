import { TokenDetail, TokenDetail_social } from '@app/core/api/apollo/types/TokenDetail'
import BigNumber from 'bignumber.js'

export class TokenDetailExt implements TokenDetail {
  __typename!: 'TokenDetail'
  address!: string
  circulatingSupply: any | null
  contractType: string | null
  owner: string | null
  currentPrice: any | null
  decimals: number | null
  email: string | null
  holdersCount: number | null
  logo: string | null
  marketCap: any | null
  name: string | null
  priceChangePercentage24h: any | null
  social: TokenDetail_social | null
  symbol: string | null
  totalSupply: any | null
  totalVolume: any | null
  website: string | null

  constructor(proto: TokenDetail) {
    this.address = proto.address
    this.circulatingSupply = proto.circulatingSupply
    this.contractType = proto.contractType
    this.owner = proto.owner
    this.currentPrice = proto.currentPrice
    this.decimals = proto.decimals
    this.email = proto.email
    this.holdersCount = proto.holdersCount
    this.logo = proto.logo
    this.marketCap = proto.marketCap
    this.name = proto.name
    this.priceChangePercentage24h = proto.priceChangePercentage24h
    this.social = proto.social
    this.symbol = proto.symbol
    this.totalSupply = proto.totalSupply
    this.totalVolume = proto.totalVolume
    this.website = proto.website
  }

  get totalSupplyBN(): BigNumber | undefined {
    return this.totalSupply ? new BigNumber(this.totalSupply) : undefined
  }

  get circulatingSupplyBN(): BigNumber | undefined {
    return this.circulatingSupply ? new BigNumber(this.circulatingSupply) : undefined
  }

  get currentPriceBN(): BigNumber | undefined {
    return this.currentPrice ? new BigNumber(this.currentPrice) : undefined
  }

  get marketCapBN(): BigNumber | undefined {
    return this.marketCap ? new BigNumber(this.marketCap) : undefined
  }

  get totalVolumeBN(): BigNumber | undefined {
    return this.totalVolume ? new BigNumber(this.totalVolume) : undefined
  }
}
