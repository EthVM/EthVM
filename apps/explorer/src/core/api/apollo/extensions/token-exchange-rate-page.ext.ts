import { TokenExchangeRate } from '@app/core/api/apollo/types/TokenExchangeRate'
import { TokenExchangeRatePage, TokenExchangeRatePage_items } from '@app/core/api/apollo/types/TokenExchangeRatePage'
import { TokenUtils } from '@app/core/helper/token.utils'
import BN from 'bignumber.js'
import { FormattedNumber, NumberFormatHelper } from '@app/core/helper/number-format-helper'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'

export class TokenExchangeRatePageExt_items implements TokenExchangeRatePage_items {
  __typename!: 'TokenExchangeRate'
  address: string | null
  currentPrice: any | null
  image: string | null
  marketCap: any | null
  name: string | null
  priceChangePercentage24h: any | null
  symbol: string | null
  totalVolume: any | null

  constructor(proto: TokenExchangeRate) {
    this.address = proto.address
    this.currentPrice = proto.currentPrice
    this.image = proto.image
    this.marketCap = proto.marketCap
    this.name = proto.name
    this.priceChangePercentage24h = proto.priceChangePercentage24h
    this.symbol = proto.symbol
    this.totalVolume = proto.totalVolume
  }

  get currentPriceBN(): BN | null {
    return TokenUtils.currentPriceBN(this)
  }

  get currentPriceFormatted(): FormattedNumber {
    return NumberFormatHelper.formatUsdValue(this.currentPriceBN || new BN(0))
  }

  get priceChangePercentage24hBN(): BN | null {
    return TokenUtils.priceChangePercentage24hBN(this)
  }

  get priceChangeFormatted(): string {
    return TokenUtils.priceChangeFormatted(this)
  }

  get priceChangeSymbol(): string {
    return TokenUtils.priceChangeSymbol(this)
  }

  get priceChangeClass(): string {
    return TokenUtils.priceChangeClass(this)
  }

  get totalVolumeBN(): BN {
    return new BN(this.totalVolume || 0)
  }

  get totalVolumeFormatted(): FormattedNumber {
    return NumberFormatHelper.formatUsdValue(this.totalVolumeBN)
  }

  get marketCapBN(): BN {
    return new BN(this.marketCap || 0)
  }

  get marketCapFormatted(): FormattedNumber {
    return NumberFormatHelper.formatUsdValue(this.marketCapBN)
  }
}

export class TokenExchangeRatePageExt implements TokenExchangeRatePage {
  __typename!: 'TokenExchangeRatesPage'
  items: TokenExchangeRatePage_items[]
  hasMore: boolean

  constructor(proto: TokenExchangeRatePage) {
    this.items = proto.items.map(i => new TokenExchangeRatePageExt_items(i))
    this.hasMore = proto.hasMore
  }
}
