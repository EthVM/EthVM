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
                    this.setNewEvent(data.addressEvent.event)
                },
                error(error) {
                    console.error(error)
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
    setEventVariables(_owner: string) {
        this.owner = _owner.toLowerCase()
    }
    setNewEvent(newEvent: AddressEventType | string, reset: boolean = false): void {
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
}
