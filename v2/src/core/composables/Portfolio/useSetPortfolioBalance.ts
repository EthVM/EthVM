import { Ref, unref, watch } from 'vue'
import { useStore } from '@/store'
import { useAddressEthBalance } from '../AddressEthBalance/addressEthBalance.composable'
import { useAddressToken } from '../AddressTokens/addressTokens.composable'

export function useSetPortfolio(addressHash: Ref<string> | string) {
    const store = useStore()
    const { balanceWei, balanceFormatted, balanceFiatBN, balanceFiatFormatted, loadingBalance } = useAddressEthBalance(addressHash)
    const { refetchTokens, loadingTokens, tokenTotalBalanceBN, erc20Tokens } = useAddressToken(addressHash)

    watch(loadingTokens, newVal => {
        if (newVal === false && erc20Tokens.value) {
            store.addErc20Balance(unref(addressHash), unref(tokenTotalBalanceBN), unref(erc20Tokens.value))
        }
    })

    watch(loadingBalance, newVal => {
        if (newVal === false) {
            store.addEthBalance(unref(addressHash), unref(balanceWei), unref(balanceFormatted), unref(balanceFiatBN), unref(balanceFiatFormatted))
        }
    })

    const refetchBalance = () => {
        console.log('Refetch')
    }
    return { refetchBalance, refetchTokens }
}
