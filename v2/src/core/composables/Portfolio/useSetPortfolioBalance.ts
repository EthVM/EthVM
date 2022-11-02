import { Ref, unref, watch } from 'vue'
import { useStore } from '@/store'
import { useAddressEthBalance } from '../AddressEthBalance/addressEthBalance.composable'
import { useAddressToken } from '../AddressTokens/addressTokens.composable'
import { useAddressUpdate } from '../AddressUpdate/addressUpdate.composable'
import { AddressEventType } from '@/apollo/types'

export function useSetPortfolio(addressHash: Ref<string> | string) {
    const store = useStore()
    const {
        balanceWei,
        balanceFormatted,
        balanceFiatBN,
        balanceFiatFormatted,
        loadingBalance,
        refetchBalance: refetchEthBalance
    } = useAddressEthBalance(addressHash)
    const { refetchTokens, loadingTokens, tokenTotalBalanceBN, erc20Tokens } = useAddressToken(addressHash)
    const { newErc20Transfer, newETHTransfer, resetCount } = useAddressUpdate(addressHash)

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
    watch(newErc20Transfer, newVal => {
        if (newVal > 0) {
            resetCount(AddressEventType.NewErc20Transfer, true)
            refetchTokens()
        }
    })
    watch(newETHTransfer, newVal => {
        if (newVal > 0) {
            resetCount(AddressEventType.NewEthTransfer, true)
            refetchEthBalance()
        }
    })

    const refetchBalance = () => {
        resetCount(AddressEventType.NewEthTransfer, true)
        refetchEthBalance()
        resetCount(AddressEventType.NewErc20Transfer, true)
        refetchTokens()
    }
    return { refetchBalance }
}
