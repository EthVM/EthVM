import { Component, Vue } from 'vue-property-decorator'
import { getNotFirstTime, setNotFirstTime } from './greet.graphql'
const LOCAL_CLIENT = 'LocalStoreClient'
@Component({
    apollo: {
        userNotFirstTime: {
            query: getNotFirstTime,
            client: LOCAL_CLIENT,
            fetchPolicy: 'network-only',
            update: data => data.getNotFirstTime,
            result() {
                this.initialFirstTimeLoading = false
            },
            error() {
                // this.hasNewBlockUpdateError = true
            }
        }
    }
})
export class GreetMixin extends Vue {
    /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */
    userNotFirstTime!: any
    initialFirstTimeLoading = true

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    get userNotFirstTimeLoading(): boolean {
        return this.initialFirstTimeLoading
    }

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */

    setNotFirstTimeTrue(): void {
        this.$apollo
            .mutate({
                mutation: setNotFirstTime,
                client: LOCAL_CLIENT,
                variables: {
                    _notFirstTimeVisit: true
                },
                refetchQueries: getNotFirstTime
            })
            .then(data => {
                if (data) {
                    this.$apollo.queries.userNotFirstTime.refetch()
                }
            })
    }
}
