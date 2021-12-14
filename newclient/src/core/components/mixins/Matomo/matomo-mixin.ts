import { Component, Vue } from 'vue-property-decorator'
import { getConsentToTrack, getNotFirstTime, getDisplayedTrackingPopup } from './matomo.graphql'
@Component({
    apollo: {
        userConsent: {
            query: getConsentToTrack,
            client: 'LocalStoreClient',
            fetchPolicy: 'network-only',
            update: data => data.getConsentToTrack,
            error() {
                // this.hasNewBlockUpdateError = true
            }
        },
        userNotFirstTime: {
            query: getNotFirstTime,
            client: 'LocalStoreClient',
            fetchPolicy: 'network-only',
            update: data => data.getNotFirstTime,
            error() {
                // this.hasNewBlockUpdateError = true
            }
        },
        userDisplayedTrackingPopup: {
            query: getDisplayedTrackingPopup,
            client: 'LocalStoreClient',
            fetchPolicy: 'network-only',
            update: data => data.getNotFirstTime,
            error() {
                // this.hasNewBlockUpdateError = true
            }
        }
    }
})
export class MatomoMixin extends Vue {
    /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */
    userConsent!: any
    userNotFirstTime!: any
    userDisplayedTrackingPopup
    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    // get newBlockNumber(): number | undefined {
    //     return this.newBlock ? this.newBlock.number : undefined
    // }
    // get newTxs(): number | undefined {
    //     return this.newBlock ? this.newBlock.txCount : undefined
    // }
}
