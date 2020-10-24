import { Component, Vue, Watch } from 'vue-property-decorator'
import { addressEvent } from './addressEvent.graphql'
import { AddressEventType } from '@app/apollo/global/globalTypes'
import { addressEvent_addressEvent as EventSubscriptionType } from './apolloTypes/addressEvent'
@Component({
    apollo: {
        $subscribe: {
            addressEvent: {
                query: addressEvent,
                variables() {
                    return {
                        owner: this.owner
                    }
                },
                skip() {
                    return this.skipEventSubscription
                },
                result({ data }) {
                    this.addrBalanceChanged = true
                    try {
                        this.setNewEvent(data.addressEvent.event)
                        this.hasUpdateError = false
                    } catch (error) {
                        this.hasUpdateError = true
                        throw error
                    }
                },
                error(error) {
                    this.hasUpdateError = true
                }
            }
        }
    }
})
export class AddressUpdateEvent extends Vue {
    /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */
    addressEvent!: EventSubscriptionType
    owner: string | null = null
    newETHTransfers = 0
    newERC20Transfers = 0
    newERC721Transfers = 0
    newMinedBlocks = 0
    newMinedUncles = 0

    addrBalanceChanged = false
    /* Refetch Tokens Tables */
    refetchERC20Balance = false
    refetchERC20Transfers = false
    refetchERC721Balance = false
    refetchERC721Transfers = false
    hasUpdateError = false

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    get skipEventSubscription(): boolean {
        return this.owner === null
    }

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    /**
     * Sets owner
     * @param owner String
     */
    setEventVariables(_owner: string): void {
        this.owner = _owner.toLowerCase()
    }
    /**
     * Sets events or resets
     * @params newEvent {AddressEventType} or {String}, reset {Boolean}
     */
    setNewEvent(newEvent: AddressEventType | string, reset: boolean = false): void {
        if (reset) {
            this.addrBalanceChanged = false
            if (newEvent === AddressEventType.NEW_ERC20_TRANSFER) {
                this.refetchERC20Balance = true
                this.refetchERC20Transfers = true
            }
            if (newEvent === AddressEventType.NEW_ERC721_TRANSFER) {
                this.refetchERC721Balance = true
                this.refetchERC721Transfers = true
            }
        }
        switch (true) {
            case newEvent === AddressEventType.NEW_ETH_TRANSFER:
                reset ? (this.newETHTransfers = 0) : this.newETHTransfers++
                return
            case newEvent === AddressEventType.NEW_ERC20_TRANSFER:
                reset ? (this.newERC20Transfers = 0) : this.newERC20Transfers++
                return
            case newEvent === AddressEventType.NEW_ERC721_TRANSFER:
                reset ? (this.newERC721Transfers = 0) : this.newERC721Transfers++
                return
            case newEvent === AddressEventType.NEW_MINED_BLOCK:
                reset ? (this.newMinedBlocks = 0) : this.newMinedBlocks++
                return
            case newEvent === AddressEventType.NEW_MINED_UNCLE:
                reset ? (this.newMinedUncles = 0) : this.newMinedUncles++
                return
            default:
                return
        }
    }
    /**
     * Resets balance
     */
    resetBalance(): void {
        this.addrBalanceChanged = false
    }
    /**
     * Resets refetching for ERC20 or ERC721
     * @param isERC20 {Boolean}
     */
    resetBalanceRefetch(isERC20: boolean): void {
        isERC20 ? (this.refetchERC20Balance = false) : (this.refetchERC721Balance = false)
    }
    /**
     * Resets transfers refetch for ERC20 or ERC721
     * @param isERC20 {Boolean}
     */
    resetTransfersRefetch(isERC20: boolean): void {
        isERC20 ? (this.refetchERC20Transfers = false) : (this.refetchERC721Transfers = false)
    }
}
