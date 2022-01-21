import { Component, Vue } from 'vue-property-decorator'
import { getConsentToTrack, getDisplayedTrackingPopup, setConsentToTrack, setDisplayedTrackingPopup } from './matomo.graphql'
import { Category, Action } from './matomoEnums'
const LOCAL_CLIENT = 'LocalStoreClient'

@Component({
    apollo: {
        userConsent: {
            query: getConsentToTrack,
            client: LOCAL_CLIENT,
            fetchPolicy: 'cache-first',
            update: data => data.localAppStore.consentToTrack,
            result() {
                this.loadingUserConsent = false
            }
        },
        userDisplayedTrackingPopup: {
            query: getDisplayedTrackingPopup,
            client: LOCAL_CLIENT,
            fetchPolicy: 'cache-first',
            deep: true,
            update: data => data.localAppStore.displayedTrackingPopup,
            result() {
                this.loadingDisplayedTrackingPopup = false
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
    loadingUserConsent = true
    userDisplayedTrackingPopup!: any
    loadingDisplayedTrackingPopup = true

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    /**
     * Sets consent based on user input, changes local store and sets Matomo coockies
     * Defaults to FALSE
     * @param {boolean} consent - user unput
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

        this.matomoExists().then(() => {
            if (consent) {
                this.$matomo.setConsentGiven()
            } else {
                this.$matomo.forgetConsentGiven()
            }
        })
    }
    /**
     * Sets displayed tracking popup to true after it has been shown
     */
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

    /**
     * Sends matomo event if consent it true
     * @param {Category} category - component description
     * @param {Action} action - action desciption
     */
    setMatomoEvent(category: Category, action: Action): void {
        if (this.userConsent && !this.loadingUserConsent) {
            this.matomoExists().then(() => {
                this.$matomo.trackEvent(category, action)
            })
        }
    }

    /**
     * Method checks if Matomo plugin is initialized,
     * @returns true
     */
    matomoExists(): Promise<boolean> {
        return new Promise(resolve => {
            const checkInterval = 50
            const timeout = 5000
            const waitStart = Date.now()
            const interval = setInterval(() => {
                if (this.$matomo) {
                    clearInterval(interval)
                    return resolve(true)
                }
                if (Date.now() >= waitStart + timeout) {
                    clearInterval(interval)
                }
            }, checkInterval)
        })
    }
}
