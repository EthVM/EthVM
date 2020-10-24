<template>
    <v-layout row wrap justify-space-between mb-4>
        <v-flex xs12 sm6 md3>
            <app-info-card :is-loading="loading" :title="$t('block.last-n')" :value="latestBlockNumber" color-type="primary" back-type="last-block" />
        </v-flex>
        <v-flex xs12 sm6 md3>
            <app-info-card
                :title="$t('block.time')"
                :value="timestamp"
                :is-date="!loading"
                :is-loading="loading"
                :metrics="$t('message.sec')"
                color-type="success"
                back-type="time-since"
            />
        </v-flex>
        <v-flex xs12 sm6 md3>
            <app-info-card
                :title="$t('block.hash-rate')"
                :value="latestHashRate"
                :metrics="hashUnitLabel.th"
                :is-loading="loading"
                color-type="warning"
                back-type="hash-rate"
            />
        </v-flex>
        <v-flex xs12 sm6 md3>
            <app-info-card :title="$t('diff.name')" :value="latestDifficulty" :metrics="''" :is-loading="loading" color-type="error" back-type="difficulty" />
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import AppInfoCard from '@app/core/components/ui/AppInfoCard.vue'
import { getLatestBlockInfo } from './stats.graphql'
import BN from 'bignumber.js'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import { getLatestBlockInfo_getLatestBlockInfo as BlockInfoType } from './apolloTypes/getLatestBlockInfo'
import { ErrorMessageBlock } from '@app/modules/blocks/models/ErrorMessagesForBlock'

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
                        this.initialLoadedBlock = this.getLatestBlockInfo ? this.getLatestBlockInfo.number : null
                        this.initialLoad = false
                    }
                    this.initialLoadedBlock = this.getLatestBlockInfo.number
                    this.timestamp = new Date().toString()
                    this.emitErrorState(false)
                }
            },
            error(error) {
                this.emitErrorState(true)
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
    initialLoadedBlock: number = 0
    hasError = false

    /*
    ===================================================================================
      Computed Values
    ===================================================================================
    */

    get latestBlockNumber(): string {
        if (this.loading) {
            return ''
        }
        return this.formatNumber(this.initialLoadedBlock)
    }

    get latestHashRate(): string {
        return this.getLatestBlockInfo ? this.formatFloatingPointValue(new BN(this.getLatestBlockInfo.hashRate).div('1e12').decimalPlaces(2)).value : ''
    }

    get latestDifficulty(): string {
        return this.getLatestBlockInfo ? `${this.formatFloatingPointValue(new BN(this.getLatestBlockInfo.difficulty).div('1e12').decimalPlaces(2)).value}` : ''
    }
    get loading(): boolean {
        return this.initialLoad || this.hasError
    }
    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    /**
     * Emits error to Sentry
     * @param val {Boolean}
     */
    emitErrorState(val: boolean): void {
        this.hasError = val
        this.$emit('errorBlockStats', this.hasError, ErrorMessageBlock.stats)
    }

    /*
    ===================================================================================
      Watch
    ===================================================================================
    */
    @Watch('newBlock')
    onNewBlockChanged(newVal: number, oldVal: number): void {
        if (newVal && newVal != oldVal && newVal > this.initialLoadedBlock) {
            this.$apollo.queries.getLatestBlockInfo.refetch()
        }
    }
}
</script>
