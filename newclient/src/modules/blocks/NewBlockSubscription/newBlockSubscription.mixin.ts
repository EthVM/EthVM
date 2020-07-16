import { Component, Vue, Watch } from 'vue-property-decorator'
import newBlockFeed from './newBlockFeed.graphql'
import { newBlockFeed_newBlockFeed as newBlockFeedType } from './apolloTypes/newBlockFeed'

@Component({
    apollo: {
        $subscribe: {
            addressEvent: {
                query: newBlockFeed,
                result({ data }) {
                    this.newBlock = data.newBlockFeed
                },
                error(error) {
                    console.error(error)
                }
            }
        }
    }
})
export class NewBlockSubscription extends Vue {
    /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */
    newBlock: newBlockFeedType | null = null

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    get newBlockNumber(): number | undefined {
        return this.newBlock ? this.newBlock.number : undefined
    }
    get newTxs(): number | undefined {
        return this.newBlock ? this.newBlock.txCount : undefined
    }
}
