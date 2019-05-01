<template>
  <v-layout row wrap justify-space-between mb-4>
    <v-flex xs12 sm6 md3> <app-info-card :title="$t('block.last-n')" :value="latestBlockNumber" color-type="primary" back-type="last-block" /> </v-flex>
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
        metrics="Th/s"
      />
      <app-info-card v-else :title="$tc('tx.failed', 2)" :value="latestBlockFailedTxs" color-type="error" back-type="failed-txs" />
    </v-flex>
    <v-flex xs12 sm6 md3>
      <app-info-card v-if="type === 'generic'" :title="$t('diff.name')" :value="latestDifficulty" color-type="error" back-type="difficulty" metrics="Th" />
      <app-info-card v-else :title="$tc('tx.pending-short', 2)" :value="latestBlockPendingTxs" color-type="success" back-type="time-since" />
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import AppInfoCard from '@app/core/components/ui/AppInfoCard.vue'
import { latestBlockStats, newBlockStats, latestHashRate, newHashRate } from '@app/core/components/ui/stats.graphql'
import { Component, Prop, Vue } from 'vue-property-decorator'
import BigNumber from 'bignumber.js';
import {BlockSummaryExt} from "@app/core/api/apollo/extensions/block-summary.ext";

@Component({
  components: {
    AppInfoCard
  },
  apollo: {

    blockSummary: {

      query: latestBlockStats,

      update({ blockSummaries }) {
        const { number, timestamp, difficulty, numSuccessfulTxs, numFailedTxs } = blockSummaries.items[0]
        return new BlockSummaryExt({ number, timestamp, difficulty, numSuccessfulTxs, numFailedTxs })
      },

      subscribeToMore: {

        document: newBlockStats,

        updateQuery: (previousResult, {subscriptionData}) => {
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
        return new BigNumber(hashRate)
      },

      subscribeToMore: {

        document: newHashRate,

        updateQuery: (previousResult, {subscriptionData}) => {
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

  blockSummary: BlockSummaryExt | null = null
  hashRate: BigNumber | null = null

  seconds: number = 0
  secondsInterval: number | null = null

  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  created() {
    this.startCount()
  }

  beforeDestroy() {
    if (this.secondsInterval) {
      clearInterval(this.secondsInterval)
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
        const lastTimestamp = this.blockSummary.timestampDate!
        this.seconds = Math.ceil((new Date().getTime() - lastTimestamp.getTime()) / 1000)
      }
    }, 1000)
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get loading(): boolean {
    return this.$apollo.loading
  }

  get currentType(): string {
    return this.type
  }

  get loadingMessage(): string {
    return this.$i18n.t('message.load').toString()
  }

  get latestBlockNumber(): string {
    const { loading, loadingMessage, blockSummary } = this
    return !loading && blockSummary ? blockSummary.numberBN!.toString() : loadingMessage
  }

  get latestHashRate(): string {
    const { loading, loadingMessage, hashRate } = this
    return !loading && hashRate ? hashRate.div('1e12').decimalPlaces(4).toString() : loadingMessage
  }

  get latestDifficulty(): string {
    const { loading, loadingMessage, blockSummary } = this
    return !loading && blockSummary ? blockSummary.difficultyBN!.div('1e12').decimalPlaces(4).toString() : loadingMessage
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
    return this.loadingMessage
  }

  get secSinceLastBlock(): string {
    return !this.loading ? this.seconds.toString() : this.loadingMessage
  }
}
</script>
