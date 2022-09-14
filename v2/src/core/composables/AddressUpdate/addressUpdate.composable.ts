import { ref } from 'vue'
import { useAddressEventSubscription } from '@module/address/apollo/AddressEvent/addressEvent.generated'
import { AddressEventType } from '@/apollo/types'

export function useAddressUpdate(addressRef: string) {
    const newErc20Transfer = ref(0)
    const newMinedBlocks = ref(0)
    const newMinedUncles = ref(0)

    const { onResult } = useAddressEventSubscription({
        owner: addressRef
    })

    onResult(data => {
        if (data?.data?.addressEvent.event === AddressEventType.NewErc20Transfer) {
            newErc20Transfer.value += 1
        }
        if (data?.data?.addressEvent.event === AddressEventType.NewMinedBlock) {
            newMinedBlocks.value += 1
        }
        if (data?.data?.addressEvent.event === AddressEventType.NewMinedUncle) {
            newMinedUncles.value += 1
        }
    })

    const resetCount = (newEvent: AddressEventType, reset = false) => {
        switch (true) {
            case newEvent === AddressEventType.NewErc20Transfer:
                reset ? (newErc20Transfer.value = 0) : (newErc20Transfer.value += 1)
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
    return { newErc20Transfer, resetCount, onAddressUpdate: onResult, newMinedBlocks, newMinedUncles }
}
