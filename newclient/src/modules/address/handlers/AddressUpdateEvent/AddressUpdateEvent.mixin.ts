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
                        _owner: this.owner,
                        _event: this.event
                    }
                },
                skip() {
                    return this.skipEventSubscription
                },
                result({ data }) {
                    console.log('new addr event', data)
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
    event: AddressEventType | null = null
    owner: string | null = null

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    get skipEventSubscription(): boolean {
        console.log(this.event === null || this.owner === null)
        return this.event === null || this.owner === null
    }

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    setEventVariables(_owner: string, _event: AddressEventType) {
        this.owner = _owner.toLowerCase()
        this.event = _event
        console.log(this.owner, this.event)
    }

    /*
    ===================================================================================
      Watch
    ===================================================================================
    */
    @Watch('addressEvent')
    onAddressEventChanged(): void {
        console.log('new event', this.addressEvent)
    }
}
