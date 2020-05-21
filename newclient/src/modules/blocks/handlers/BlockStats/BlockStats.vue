<template>
    <v-layout row wrap justify-space-between mb-4>
        <v-flex xs12 sm6 md3>
            <app-info-card :title="$t('block.last-n')" :value="latestBlockNumber" color-type="primary" back-type="last-block" />
        </v-flex>
        <v-flex xs12 sm6 md3>
            <app-info-card
                :title="$t('block.time')"
                :value="timestamp"
                :is-date="!initialLoad"
                :metrics="$t('message.sec')"
                color-type="success"
                back-type="time-since"
            />
        </v-flex>
        <v-flex xs12 sm6 md3>
            <app-info-card :title="$t('block.hash-rate')" :value="latestHashRate" :metrics="hashUnitLabel.th" color-type="warning" back-type="hash-rate" />
        </v-flex>
        <v-flex xs12 sm6 md3>
            <app-info-card :title="$t('diff.name')" :value="latestDifficulty" :metrics="''" color-type="error" back-type="difficulty" />
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import AppInfoCard from '@app/core/components/ui/AppInfoCard.vue'
import { getLatestBlockInfo } from './stats.graphql'
import BN from 'bignumber.js'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import { getLatestBlockInfo_getLatestBlockInfo as BlockInfoType } from './getLatestBlockInfo.type'

@Component({
    components: {
        AppInfoCard
    },
    apollo: {
        getLatestBlockInfo: {
            query: getLatestBlockInfo,
            result({ data }) {
                if (data) {
                    if (this.initialLoad) {
                        this.initialLoad = false
                    }
                    this.timestamp = new Date().toString()
                }
            },
            error(error) {
                this.error = JSON.stringify(error.message)
            }
        }
    }
})
export default class BlockStats extends Mixins(NumberFormatMixin) {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop(Number) newBlock?: number
    /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */
    initialLoad: boolean = true
    timestamp?: string = ''
    getLatestBlockInfo?: BlockInfoType
    hashUnitLabel = {
        th: 'Th/s',
        gh: 'Gh/s',
        mh: 'Mh/s'
    }

    /*
    ===================================================================================
      Computed Values
    ===================================================================================
    */

    get loading(): boolean {
        return this.initialLoad
    }

    get latestBlockNumber(): string {
        return this.getLatestBlockInfo ? this.formatNumber(this.getLatestBlockInfo.number) : ''
    }

    get latestHashRate(): string {
        return this.getLatestBlockInfo ? this.formatFloatingPointValue(new BN(this.getLatestBlockInfo.hashRate).div('1e12').decimalPlaces(2)).value : ''
    }

    get latestDifficulty(): string {
        return this.getLatestBlockInfo ? `${this.formatFloatingPointValue(new BN(this.getLatestBlockInfo.difficulty).div('1e12').decimalPlaces(2)).value}` : ''
    }
    /*
    ===================================================================================
      Watch
    ===================================================================================
    */
    @Watch('newBlock')
    onNewBlockChanged(newVal: number, oldVal: number): void {
        if (newVal && newVal != oldVal) {
            this.$apollo.queries.getLatestBlockInfo.refetch()
        }
    }
}
</script>
