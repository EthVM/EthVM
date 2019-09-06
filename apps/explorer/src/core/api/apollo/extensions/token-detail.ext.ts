import { TokenDetail, TokenDetail_social } from '@app/core/api/apollo/types/TokenDetail'
import BigNumber from 'bignumber.js'
import { FormattedNumber, NumberFormatHelper } from '@app/core/helper/number-format-helper'

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

  get totalSupplyBN(): BigNumber {
    return new BigNumber(this.totalSupply || 0)
  }

  get totalSupplyFormatted(): string {
    return NumberFormatHelper.formatIntegerValue(this.totalSupplyBN).value
  }

  get circulatingSupplyBN(): BigNumber {
    return new BigNumber(this.circulatingSupply || 0)
  }

  get circulatingSupplyFormatted(): string {
    return NumberFormatHelper.formatIntegerValue(this.circulatingSupplyBN).value
  }

  get currentPriceBN(): BigNumber {
    return new BigNumber(this.currentPrice || 0)
  }

  get currentPriceFormatted(): FormattedNumber {
    return NumberFormatHelper.formatUsdValue(this.currentPriceBN, true)
  }

  get marketCapBN(): BigNumber {
    return new BigNumber(this.marketCap || 0)
  }

  get marketCapFormatted(): FormattedNumber {
    return NumberFormatHelper.formatUsdValue(this.marketCapBN, false)
  }

  get totalVolumeBN(): BigNumber {
    return new BigNumber(this.totalVolume || 0)
  }

  get totalVolumeFormatted(): FormattedNumber{
    return NumberFormatHelper.formatUsdValue(this.totalVolumeBN, false)
  }

  get priceChangePercentage24hBN(): BigNumber {
    return new BigNumber(this.priceChangePercentage24h || 0)
  }

  get priceChangePercentage24hFormatted(): string {
    return NumberFormatHelper.formatPercentageValue(this.priceChangePercentage24hBN).value
  }
}
