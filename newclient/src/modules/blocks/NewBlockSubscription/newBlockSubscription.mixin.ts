import { Component, Vue, Watch } from 'vue-property-decorator'
import newBlockFeed from './newBlockFeed.graphql'
import { newBlockFeed_newBlockFeed as newBlockFeedType } from './newBlockFeed.type'

@Component
export class NewBlockSubscription extends Vue {
    /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */
    newBlock: newBlockFeedType | null = null

    /*
    ===================================================================================
      Lifecycle
    ===================================================================================
    */
    mounted() {
        const blockFeed = this.$apollo.subscribe({
            query: newBlockFeed
        })

        blockFeed.subscribe({
            next: data => {
                this.newBlock = data.data.newBlockFeed
            },
            error(error) {
                console.error(error)
            }
        })
    }
    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    get newBlockNumber(): number | undefined {
        return this.newBlock ? this.newBlock.number : undefined
    }
}
