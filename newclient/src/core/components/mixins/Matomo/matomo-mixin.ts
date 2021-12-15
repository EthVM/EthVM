import { Component, Vue } from 'vue-property-decorator'
import { getConsentToTrack, getDisplayedTrackingPopup, setConsentToTrack, setDisplayedTrackingPopup } from './matomo.graphql'
const LOCAL_CLIENT = 'LocalStoreClient'

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
        userDisplayedTrackingPopup: {
            query: getDisplayedTrackingPopup,
            client: 'LocalStoreClient',
            fetchPolicy: 'network-only',
            update: data => data.getDisplayedTrackingPopup,
            result() {
                this.loadingDisplayedTrackingPopup = false
            },
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
    userDisplayedTrackingPopup!: any
    loadingDisplayedTrackingPopup!: true

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */

    setConsentToTrack(consent: boolean): void {
        this.$apollo
            .mutate({
                mutation: setConsentToTrack,
                client: LOCAL_CLIENT,
                variables: {
                    _consent: consent
                }
            })
            .then(data => {
                if (data) {
                    this.$apollo.queries.userConsent.refetch()
                }
            })
    }

    setDisplayedTrackingPopupTrue(): void {
        this.$apollo
            .mutate({
                mutation: setDisplayedTrackingPopup,
                client: LOCAL_CLIENT,
                variables: {
                    _showed: true
                }
            })
            .then(data => {
                if (data) {
                    this.$apollo.queries.userDisplayedTrackingPopup.refetch()
                }
            })
    }
}
