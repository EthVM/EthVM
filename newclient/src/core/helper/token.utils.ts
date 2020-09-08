// import { TokenBalancePageExt_items } from '@app/core/api/apollo/extensions/token-balance-page.ext'
// import { TokenExchangeRatePageExt_items } from '@app/core/api/apollo/extensions/token-exchange-rate-page.ext'
// import BN from 'bignumber.js'
// import { FormattedNumber, NumberFormatHelper } from '@app/core/helper/number-format-helper'

// export class TokenUtils {
//   static currentPriceBN(token: TokenBalancePageExt_items | TokenExchangeRatePageExt_items): BN | null {
//     return token.currentPrice ? new BN(token.currentPrice) : null
//   }

//   static priceChangePercentage24hBN(token: TokenBalancePageExt_items | TokenExchangeRatePageExt_items): BN | null {
//     return token.priceChangePercentage24h ? new BN(token.priceChangePercentage24h).dp(2) : null
//   }

//   private static priceChangeFormattedNumber(token: TokenBalancePageExt_items | TokenExchangeRatePageExt_items): FormattedNumber {
//     const bn = token.priceChangePercentage24hBN || new BN(0)
//     return NumberFormatHelper.formatPercentageValue(bn)
//   }

//   static priceChangeFormatted(token: TokenBalancePageExt_items | TokenExchangeRatePageExt_items): string {
//     const { priceChangePercentage24hBN } = token

//     if (!priceChangePercentage24hBN || priceChangePercentage24hBN.isZero()) {
//       return '0'
//     }

//     return this.priceChangeFormattedNumber(token).value
//   }

//   static priceChangeTooltip(token: TokenBalancePageExt_items | TokenExchangeRatePageExt_items): string | undefined {
//     let result = this.priceChangeFormattedNumber(token).tooltipText
//     if (result && token.priceChangeSymbol === '-') {
//       result = `-${result}`
//     }
//     return result
//   }

//   static priceChangeSymbol(token: TokenBalancePageExt_items | TokenExchangeRatePageExt_items): string {
//     const { priceChangePercentage24hBN } = token
//     if (!priceChangePercentage24hBN || priceChangePercentage24hBN.isZero()) {
//       return 'null'
//     }
//     return priceChangePercentage24hBN.toNumber() > 0 ? '+' : '-'
//   }

//   static priceChangeClass(token: TokenBalancePageExt_items | TokenExchangeRatePageExt_items): string {
//     switch (token.priceChangeSymbol) {
//       case '+': {
//         return 'txSuccess--text'
//       }
//       case '-': {
//         return 'txFail--text'
//       }
//       default: {
//         return 'black--text'
//       }
//     }
//   }
// }
