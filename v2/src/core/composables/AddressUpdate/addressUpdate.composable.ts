import { ref, Ref, unref, computed } from 'vue'
import { useAddressEventSubscription } from '@module/address/apollo/AddressEvent/addressEvent.generated'
import { AddressEventType } from '@/apollo/types'
import { eth } from '@/core/helper'

export function useAddressUpdate(addressRef: string | Ref<string>, pause: Ref<boolean> | boolean = false) {
    const newErc20Transfer = ref(0)
    const newErc721Transfer = ref(0)
    const newMinedBlocks = ref(0)
    const newMinedUncles = ref(0)
    const newETHTransfer = ref(0)

    const enableSubscribe = computed<boolean>(() => {
        return eth.isValidAddress(unref(addressRef)) && !unref(pause)
    })

    const { onResult } = useAddressEventSubscription(
        () => ({
            owner: unref(addressRef).toLowerCase()
        }),
        () => ({
            enabled: enableSubscribe.value
        })
    )

    onResult(data => {
        if (data?.data?.addressEvent.event === AddressEventType.NewErc20Transfer) {
            newErc20Transfer.value += 1
        }
        if (data?.data?.addressEvent.event === AddressEventType.NewErc721Transfer) {
            newErc721Transfer.value += 1
        }
        if (data?.data?.addressEvent.event === AddressEventType.NewMinedBlock) {
            newMinedBlocks.value += 1
        }
        if (data?.data?.addressEvent.event === AddressEventType.NewMinedUncle) {
            newMinedUncles.value += 1
        }
        if (data?.data?.addressEvent.event === AddressEventType.NewEthTransfer) {
            newETHTransfer.value += 1
        }
    })

    const resetCount = (newEvent: AddressEventType, reset = false) => {
        switch (true) {
            case newEvent === AddressEventType.NewEthTransfer:
                reset ? (newETHTransfer.value = 0) : (newETHTransfer.value += 1)
                return
            case newEvent === AddressEventType.NewErc20Transfer:
                reset ? (newErc20Transfer.value = 0) : (newErc20Transfer.value += 1)
                return
            case newEvent === AddressEventType.NewErc721Transfer:
                reset ? (newErc721Transfer.value = 0) : (newErc721Transfer.value += 1)
                return
            case newEvent === AddressEventType.NewMinedBlock:
                reset ? (newMinedBlocks.value = 0) : (newMinedBlocks.value += 1)
                return
            case newEvent === AddressEventType.NewMinedUncle:
                reset ? (newMinedUncles.value = 0) : (newMinedUncles.value += 1)
                return
            default:
                return
        }
    }
    return { newErc20Transfer, newErc721Transfer, newETHTransfer, resetCount, onAddressUpdate: onResult, newMinedBlocks, newMinedUncles }
}
