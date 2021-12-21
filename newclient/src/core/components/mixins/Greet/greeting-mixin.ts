import { Component, Vue } from 'vue-property-decorator'
import { userNotFirstTime, setNotFirstTime } from './greet.graphql'
const LOCAL_CLIENT = 'LocalStoreClient'
@Component({
    apollo: {
        userNotFirstTime: {
            query: userNotFirstTime,
            fetchPolicy: 'cache-first',
            client: LOCAL_CLIENT,
            deep: true,
            update: data => data.localAppStore.notFirstTimeVisit,
            result() {
                this.initialFirstTimeLoading = false
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
                refetchQueries: userNotFirstTime
            })
            .then(data => {
                if (data) {
                    this.$apollo.queries.userNotFirstTime.refetch()
                }
            })
    }
}
