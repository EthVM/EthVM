<template>
    <v-layout row wrap justify-space-between mb-4>
        <v-flex xs12 sm6 md3>
            <app-info-card :title="$t('block.last-n')" :value="latestBlockNumber" color-type="primary" back-type="last-block" />
        </v-flex>
        <v-flex xs12 sm6 md3> </v-flex>
        <v-flex xs12 sm6 md3>
            <app-info-card :title="$t('block.hash-rate')" :value="latestHashRate.value" :metrics="''" color-type="warning" back-type="hash-rate" />
        </v-flex>
        <v-flex xs12 sm6 md3>
            <app-info-card :title="$t('diff.name')" :value="latestDifficulty" :metrics="''" color-type="error" back-type="difficulty" />
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import AppInfoCard from '@app/core/components/ui/AppInfoCard.vue'
import getLatestBlockInfo from './stats.graphql'
import BN from 'bignumber.js'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import { getLatestBlockInfo_getLatestBlockInfo as BlockInfoType } from './getLatestBlockInfo.type'
interface BlockStatistics {
    number?: number
    avgBlockTime?: number
    hashRate?: string
    difficulty?: string
    timestamp?: number
}
enum HashUnitLabel {
    th = 'Th/s',
    gh = 'Gh/s',
    mh = 'Mh/s'
}

@Component({
    components: {
        AppInfoCard
    },
    apollo: {
        getLatestBlockInfo: {
            query: getLatestBlockInfo,
            result({ data }) {
                if (data) {
                    ;(this as any).initialLoad = false
                    ;(this as any).timeStamp = new Date()
                }
            }
            //     error (error) {
            //   this.error = JSON.stringify(error.message)
            // }
        }
    }
})
export default class BlockStats extends Mixins(NumberFormatMixin) {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    // @Prop({ type: Number }) newBlock?: number
    /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */
    initialLoad: boolean = true
    timestamp?: Date
    getLatestBlockInfo?: BlockInfoType

    /*
    ===================================================================================
      Computed Values
    ===================================================================================
    */

    get loading(): boolean {
        return this.initialLoad
    }

    get latestBlockNumber(): string {
        return this.getLatestBlockInfo && this.getLatestBlockInfo.number ? this.getLatestBlockInfo.number : ''
    }

    get latestHashRate(): string {
        return this.getLatestBlockInfo && this.getLatestBlockInfo.hashRate
            ? this.formatIntegerValue(new BN(this.getLatestBlockInfo.hashRate).div('1e12').decimalPlaces(2))
            : ''
    }

    get latestDifficulty(): string {
        return this.getLatestBlockInfo && this.getLatestBlockInfo.difficulty
            ? new BN(this.getLatestBlockInfo.difficulty).div('1e12').decimalPlaces(2).toString()
            : ''
    }

    /*
    ===================================================================================
      Watch
    ===================================================================================
  //   */
    // @Watch('newBlock')
    // onNewBlockChange (newVal: number, oldVal: number): void {
    //   if (newVal && newVal != oldVal) {
    //     this.$apollo.queries.tokensPage.refetch()
    //   }
    // }
}
</script>
