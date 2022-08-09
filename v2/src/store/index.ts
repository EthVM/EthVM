import { defineStore } from 'pinia'
import { GetLatestPricesQuery } from '@core/composables/CoinData/getLatestPrices.generated'
import { TokenOwnersFragment } from '@module/address/apollo/tokens.generated'
import BN from 'bignumber.js'
import { formatFloatingPointValue, FormattedNumber } from '@core/helper/number-format-helper'

interface StoreState {
    coinData: GetLatestPricesQuery | undefined
    loadingCoinData: boolean
    appDrawer: boolean
    addressTokenBalance: FormattedNumber | number
}

export const useStore = defineStore('main', {
    state: (): StoreState => {
        return {
            coinData: <GetLatestPricesQuery>{},
            loadingCoinData: false,
            appDrawer: false,
            addressTokenBalance: 0
        }
    },
    actions: {
        computeTokenBalances(tokens: TokenOwnersFragment[]) {
            const sum = tokens.reduce((acc, el) => {
                let balance = new BN(el.balance)
                if (el.tokenInfo.decimals) {
                    balance = balance.div(new BN(10).pow(el.tokenInfo.decimals))
                }
                return balance.toNumber() + acc
            }, 0)
            this.addressTokenBalance = formatFloatingPointValue(new BN(sum))
        }
    }
})
