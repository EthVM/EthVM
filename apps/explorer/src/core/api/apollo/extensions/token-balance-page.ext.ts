import BN from 'bignumber.js'
import { TokenUtils } from '@app/core/helper/token.utils'
import { TokenBalancePage, TokenBalancePage_items } from '@app/core/api/apollo/types/TokenBalancePage'
import { TokenBalance } from '@app/core/api/apollo/types/TokenBalance'
import { FormattedNumber, NumberFormatHelper } from '@app/core/helper/number-format-helper'

export class TokenBalancePageExt_items implements TokenBalancePage_items {
  __typename!: 'TokenBalance'
  address: string | null
  balance: any | null
  currentPrice: any | null
  decimals: number | null
  name: string | null
  symbol: string | null
  priceChangePercentage24h: any | null
  image: string | null

  constructor(proto: TokenBalance) {
    this.address = proto.address
    this.balance = proto.balance
    this.currentPrice = proto.currentPrice
    this.decimals = proto.decimals
    this.name = proto.name
    this.symbol = proto.symbol
    this.priceChangePercentage24h = proto.priceChangePercentage24h
    this.image = proto.image
  }

  get currentPriceBN(): BN | null {
    return TokenUtils.currentPriceBN(this)
  }

  get currentPriceFormatted(): FormattedNumber {
    return NumberFormatHelper.formatUsdValue(this.currentPriceBN || new BN(0))
  }

  get balanceFormatted(): FormattedNumber {
    const { decimals, balanceBN } = this
    const raw = decimals ? balanceBN.div(new BN(10).pow(decimals)) : balanceBN
    return NumberFormatHelper.formatFloatingPointValue(raw)
  }

  get balanceBN(): BN {
    return new BN(this.balance || 0)
  }

  get usdValueBN(): BN {
    const { currentPriceBN, balanceBN } = this

    if (!currentPriceBN) {
      return new BN(0.0)
    }

    return balanceBN.multipliedBy(currentPriceBN)
  }

  get usdValueFormatted(): FormattedNumber {
    return NumberFormatHelper.formatUsdValue(this.usdValueBN)
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

  get priceChangeTooltip(): string | undefined {
    return TokenUtils.priceChangeTooltip(this)
  }
}

export class TokenBalancePageExt implements TokenBalancePage {
  __typename!: 'TokenBalancePage'
  items: (TokenBalancePageExt_items)[]
  hasMore: boolean

  constructor(proto: TokenBalancePage) {
    this.items = proto.items.map(s => new TokenBalancePageExt_items(s as TokenBalance))
    this.hasMore = proto.hasMore
  }
}
