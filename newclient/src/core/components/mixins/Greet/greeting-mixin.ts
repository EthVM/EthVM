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

    async setNotFirstTimeTrue(): Promise<boolean> {
        const res = await this.$apollo
            .mutate({
                mutation: setNotFirstTime,
                client: LOCAL_CLIENT,
                variables: {
                    _notFirstTimeVisit: true
                },
                refetchQueries: getNotFirstTime
            })
            .then(data => (data !== null ? true : false))
        return res
    }
}
