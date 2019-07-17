<template>
  <v-layout row wrap justify-space-between mb-4>
    <v-flex xs12 sm6 md3>
      <app-info-card :title="$t('block.last-n')" :value="latestBlockNumber" color-type="primary" back-type="last-block" />
    </v-flex>
    <v-flex xs12 sm6 md3>
      <app-info-card
        v-if="type === 'generic'"
        :title="$t('block.time')"
        :value="secSinceLastBlock"
        color-type="success"
        back-type="time-since"
        :metrics="$t('message.sec')"
      />
      <app-info-card v-else :title="$tc('tx.success', 2)" :value="latestBlockSuccessTxs" color-type="txSuccess" back-type="success-txs" />
    </v-flex>
    <v-flex xs12 sm6 md3>
      <app-info-card
        v-if="type === 'generic'"
        :title="$t('block.hash-rate')"
        :value="latestHashRate"
        color-type="warning"
        back-type="hash-rate"
        :metrics="latestHashUnits"
      />
      <app-info-card v-else :title="$tc('tx.failed', 2)" :value="latestBlockFailedTxs" color-type="error" back-type="failed-txs" />
    </v-flex>
    <v-flex xs12 sm6 md3>
      <app-info-card
        v-if="type === 'generic'"
        :title="$t('diff.name')"
        :value="latestDifficulty"
        color-type="error"
        back-type="difficulty"
        :metrics="latestDifficultyUnits"
      />
      <app-info-card v-else :title="$tc('tx.pending-short', 2)" :value="latestBlockPendingTxs" color-type="success" back-type="time-since" />
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import AppInfoCard from '@app/core/components/ui/AppInfoCard.vue'
import { latestBlockStats, newBlockStats, latestHashRate, newHashRate } from '@app/core/components/ui/stats.graphql'
import { Component, Prop, Vue } from 'vue-property-decorator'
import BigNumber from 'bignumber.js'
import { Subscription } from 'rxjs'
import { BlockSummaryPageExt, BlockSummaryPageExt_items } from '@app/core/api/apollo/extensions/block-summary-page.ext'

const BIG_NUMBER_ONE = new BigNumber(1)

@Component({
  components: {
    AppInfoCard
  },
  apollo: {
    blockSummary: {
      query: latestBlockStats,

      update({ blockSummaries }) {
        if (blockSummaries && blockSummaries.items.length) {
          return new BlockSummaryPageExt_items(blockSummaries.items[0])
        }
        return null
      },

      subscribeToMore: {
        document: newBlockStats,

        updateQuery: (previousResult, { subscriptionData }) => {
          const { newBlock } = subscriptionData.data
          return {
            ...previousResult,
            blockSummaries: {
              ...previousResult.blockSummaries,
              items: [newBlock]
            }
          }
        }
      }
    },

    hashRate: {
      query: latestHashRate,

      update({ hashRate }) {
        return hashRate ? new BigNumber(hashRate) : null
      },

      subscribeToMore: {
        document: newHashRate,

        updateQuery: (previousResult, { subscriptionData }) => {
          const { hashRate } = subscriptionData.data
          return {
            ...previousResult,
            hashRate: hashRate
          }
        }
      }
    }
  }
})
export default class AppInfoCardGroup extends Vue {
  /*
    ===================================================================================
      Props
    ===================================================================================
    */

  @Prop({ type: String, default: 'generic' }) type!: string

  /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */

  blockSummary?: BlockSummaryPageExt_items
  hashRate?: BigNumber

  seconds: number = 0
  secondsInterval?: number

  connectedSubscription?: Subscription

  disconnected: boolean = false

  /*
    ===================================================================================
      Lifecycle
    ===================================================================================
    */

  created() {
    this.connectedSubscription = this.$subscriptionState.subscribe(async state => {
      switch (state) {
        case 'disconnected':
          this.disconnected = true
          if (this.secondsInterval) {
            clearInterval(this.secondsInterval)
          }
          break

        case 'connected':
          this.startCount()
          this.disconnected = false
          break

        case 'reconnected':
          this.startCount()
          this.disconnected = false
          this.$apollo.queries.blockSummary.refetch()
          this.$apollo.queries.hashRate.refetch()
          break
      }
    })
  }

  destroyed() {
    if (this.secondsInterval) {
      clearInterval(this.secondsInterval)
    }
    if (this.connectedSubscription) {
      this.connectedSubscription.unsubscribe()
    }
  }

  /*
    ===================================================================================
      Methods
    ===================================================================================
    */

  startCount(): void {
    this.secondsInterval = window.setInterval(() => {
      if (this.blockSummary) {
        const lastTimestamp = this.blockSummary.timestampDate
        this.seconds = Math.ceil((new Date().getTime() - lastTimestamp.getTime()) / 1000)
      }
    }, 1000)
  }

  calculateUnits(value: BigNumber): string {

    const { calculateValue } = this

    // Determine the lowest unit that will show value as 1 or greater

    if (calculateValue(value, 'Th/s') >= BIG_NUMBER_ONE) {
      return 'Th/s'
    }

    if (calculateValue(value, 'Gh/s') >= BIG_NUMBER_ONE) {
      return 'Gh/s'
    }

    return 'Mh/s' // Default to megahash
  }

  calculateValue(value: BigNumber, units: string): BigNumber {

    switch (units) {
      case 'Th/s':
        return value.div(1e12)
      case 'Gh/s':
        return value.div(1e8)
      case 'Mh/s':
        return value.div(1e4)
      default:
        throw new Error(`Invalid unit: ${units}`)
    }

  }

  /*
    ===================================================================================
      Computed Values
    ===================================================================================
    */

  get loading(): boolean {
    return this.disconnected || this.$apollo.loading
  }

  get currentType(): string {
    return this.type
  }

  get loadingMessage(): string {
    return this.$i18n.t('message.load').toString()
  }

  get latestBlockNumber(): string {
    const { loading, loadingMessage, blockSummary } = this
    return !loading && !!blockSummary ? blockSummary.numberBN.toString() : loadingMessage
  }

  get latestHashRate(): string {
    const { loading, loadingMessage, hashRate, calculateValue, calculateUnits } = this
    return !loading && hashRate
      ? calculateValue(hashRate, calculateUnits(hashRate))
          .decimalPlaces(4)
          .toString()
      : loadingMessage
  }

  get latestHashUnits(): string {
    const { loading, hashRate, calculateUnits } = this
    return !loading && hashRate
      ? calculateUnits(hashRate)
      : 'Th/s'
  }

  get latestDifficulty(): string {
    const { loading, loadingMessage, blockSummary, calculateValue, calculateUnits } = this
    return !loading && blockSummary
      ? calculateValue(blockSummary.difficultyBN, calculateUnits(blockSummary.difficultyBN))
          .decimalPlaces(4)
          .toString()
      : loadingMessage
  }

  get latestDifficultyUnits(): string {
    const { loading, blockSummary, calculateUnits } = this
    return !loading && blockSummary
      ? calculateUnits(blockSummary.difficultyBN)
      : 'Th/s'
  }

  get latestBlockSuccessTxs(): string {
    const { loading, loadingMessage, blockSummary } = this
    return !loading && blockSummary ? blockSummary.numSuccessfulTxsBN!.toString() : loadingMessage
  }

  get latestBlockFailedTxs(): string {
    const { loading, loadingMessage, blockSummary } = this
    return !loading && blockSummary ? blockSummary.numFailedTxsBN!.toString() : loadingMessage
  }

  get latestBlockPendingTxs(): string {
    // TODO
    return this.$i18n.t('message.coming-soon').toString()
  }

  get secSinceLastBlock(): string {
    return !this.loading ? this.seconds.toString() : this.loadingMessage
  }
}
</script>
