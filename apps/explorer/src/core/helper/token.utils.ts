import { TokenPageExt_items } from '@app/core/api/apollo/extensions/token-page.ext'
import { TokenExchangeRatePageExt_items } from '@app/core/api/apollo/extensions/token-exchange-rate-page.ext'
import BN from 'bignumber.js'

export class TokenUtils {

  static currentPriceBN(token: TokenPageExt_items | TokenExchangeRatePageExt_items): BN | null {
    return token.currentPrice ? new BN(token.currentPrice) : null
  }

  static priceChangePercentage24hBN(token: TokenPageExt_items | TokenExchangeRatePageExt_items): BN | null {
    return token.priceChangePercentage24h ? new BN(token.priceChangePercentage24h).dp(2) : null
  }

  static priceChangeFormatted(token: TokenPageExt_items | TokenExchangeRatePageExt_items): string {

    const { priceChangePercentage24hBN } = token

    if (!priceChangePercentage24hBN || priceChangePercentage24hBN.isZero()) {
      return '0'
    }

    if (priceChangePercentage24hBN.isNegative()) {
      return priceChangePercentage24hBN.toString()
    }
    // Add "+" symbol
    return `${token.priceChangeSymbol}${priceChangePercentage24hBN.toString()}`
  }

  static priceChangeSymbol(token: TokenPageExt_items | TokenExchangeRatePageExt_items): string {
    const { priceChangePercentage24hBN } = token
    if (!priceChangePercentage24hBN || priceChangePercentage24hBN.isZero()) {
      return 'null'
    }
    return priceChangePercentage24hBN.toNumber() > 0 ? '+' : '-'
  }

  static priceChangeClass(token: TokenPageExt_items | TokenExchangeRatePageExt_items): string {
    switch (token.priceChangeSymbol) {
      case '+': {
        return 'txSuccess--text'
      }
      case '-': {
        return 'txFail--text'
      }
      default: {
        return 'black--text'
      }
    }
  }

}
