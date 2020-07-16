<template>
    <!--
    =====================================================================================
      DETAILS LIST
    =====================================================================================
    -->
    <v-layout row wrap justify-start class="mb-4">
        <v-flex xs12>
            <app-details-list :details="blockDetails" :is-loading="loading" :error="error" :max-items="9" class="mb-4">
                <template v-slot:title>
                    <block-details-title :next-block="nextBlock" :prev-block="previousBlock" :uncles="uncleHashes" />
                </template>
            </app-details-list>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import AppDetailsList from '@app/core/components/ui/AppDetailsList.vue'
import BlockDetailsTitle from '@app/modules/blocks/components/BlockDetailsTitle.vue'
import { Detail, Crumb } from '@app/core/components/props'
import { eth } from '@app/core/helper'
import { Mixins, Component, Prop } from 'vue-property-decorator'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import { getBlockByNumber, getBlockByHash, getLastBlockNumber } from './blockDetails.graphql'
import { BlockDetails as BlockDetailsType } from './apolloTypes/BlockDetails'
import { getLastBlockNumber_getLatestBlockInfo as lastBlockType } from './apolloTypes/getLastBlockNumber'
import { FormattedNumber } from '@app/core/helper/number-format-helper'
import { NewBlockSubscription } from '@app/modules/blocks/NewBlockSubscription/newBlockSubscription.mixin'
import BN from 'bignumber.js'

@Component({
    components: {
        AppDetailsList,
        BlockDetailsTitle
    },
    apollo: {
        block: {
            query() {
                return this.isHash ? getBlockByHash : getBlockByNumber
            },
            variables() {
                return { blockRef: this.isHash ? this.blockRef : parseInt(this.blockRef) }
            },
            update: data => data.getBlockByHash || data.getBlockByNumber
        },
        getLatestBlockInfo: {
            query: getLastBlockNumber,
            fetchPolicy: 'cache-and-network'
        }
    }
})
export default class BlockDetails extends Mixins(NumberFormatMixin, NewBlockSubscription) {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop({ type: String }) blockRef!: string
    @Prop({ type: Boolean, default: false }) isHash!: boolean

    /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */

    error = ''
    syncing: undefined
    block!: BlockDetailsType
    getLatestBlockInfo!: lastBlockType

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */

    get loading(): boolean | undefined {
        return this.$apollo.queries.block.loading
    }

    get uncleHashes(): (string | null)[] {
        return this.block && this.block.summary.uncles ? this.block.summary.uncles! : []
    }

    get blockDetails(): Detail[] {
        let details: Detail[]
        if (this.loading || this.error) {
            details = [
                {
                    title: this.$i18n.t('common.height')
                },
                {
                    title: this.$i18n.t('common.hash')
                },
                {
                    title: this.$i18n.t('block.p-hash')
                },
                {
                    title: this.$i18n.t('miner.name')
                },
                {
                    title: this.$i18n.t('common.timestmp')
                },
                {
                    title: this.$i18n.t('miner.reward')
                },
                {
                    title: this.$i18n.t('uncle.reward')
                },
                {
                    title: this.$i18n.tc('tx.name', 2)
                },
                {
                    title: this.$i18n.t('diff.name')
                },
                {
                    title: this.$i18n.t('diff.total')
                },
                {
                    title: this.$i18n.t('common.size')
                },
                {
                    title: this.$i18n.t('common.nonce')
                },
                {
                    title: this.$i18n.t('block.state-root')
                },
                {
                    title: this.$i18n.t('block.data')
                },
                {
                    title: this.$i18n.tc('tx.fee', 2)
                },
                {
                    title: this.$i18n.t('gas.limit')
                },
                {
                    title: this.$i18n.t('gas.used')
                },
                {
                    title: this.$i18n.t('block.logs')
                },
                {
                    title: this.$i18n.t('tx.root')
                },
                {
                    title: this.$i18n.t('block.rcpt-root')
                },
                {
                    title: `${this.$i18n.tc('uncle.name', 2)} ${this.$i18n.t('common.sha')}`
                }
            ]
        } else {
            details = [
                {
                    title: this.$i18n.t('common.height'),
                    detail: this.formatNumber(this.block.summary.number)
                },
                {
                    title: this.$i18n.t('common.hash'),
                    detail: this.block.hash,
                    copy: true,
                    mono: true
                },
                {
                    title: this.$i18n.t('block.p-hash'),
                    detail: this.block.parentHash!,
                    link: `/block/number/${this.block.summary.number - 1}`,
                    copy: true,
                    mono: true
                },
                {
                    title: this.$i18n.t('common.timestmp'),
                    detail: new Date(this.block.summary.timestamp * 1e3).toString()
                },
                {
                    title: this.$i18n.t('miner.name'),
                    detail: this.block.summary.miner!,
                    link: `/address/${this.block.summary.miner}`,
                    copy: true,
                    mono: true
                },
                {
                    title: this.$i18n.t('miner.reward.block'),
                    detail: `${this.rewards.value} ${this.rewards.unit}`,
                    tooltip: `${this.rewards.tooltipText} ${this.$i18n.t('common.eth')}` || undefined
                },
                {
                    title: this.$i18n.tc('tx.fee', 2),
                    detail: `${this.transactionFees.value} ${this.transactionFees.unit}`,
                    tooltip: this.transactionFees.tooltipText ? `${this.transactionFees.tooltipText} ${this.$i18n.t('common.eth')}` : undefined
                },

                {
                    title: this.$i18n.t('uncle.reward'),
                    detail: `${this.uncleRewards.value} ${this.uncleRewards.unit}`,
                    tooltip: this.uncleRewards.tooltipText ? `${this.uncleRewards.tooltipText} ${this.$i18n.t('common.eth')}` : undefined
                },
                {
                    title: this.$i18n.tc('tx.name', 2),
                    detail: this.transactionsCount
                },
                {
                    title: this.$i18n.t('diff.name'),
                    detail: this.formatNumber(new BN(this.block.difficulty).toNumber())
                },
                {
                    title: this.$i18n.t('diff.total'),
                    detail: this.formatNumber(new BN(this.block.totalDifficulty).toNumber())
                },
                {
                    title: this.$i18n.t('common.size'),
                    detail: `${this.formatNumber(this.block.size)} ${this.$i18n.t('block.bytes')}`
                },
                {
                    title: this.$i18n.t('common.nonce'),
                    detail: this.formatNumber(new BN(this.block.nonce).toNumber())
                },
                {
                    title: this.$i18n.t('block.state-root'),
                    detail: this.block.stateRoot,
                    mono: true
                },
                {
                    title: this.$i18n.t('block.data'),
                    detail: this.block.extraData,
                    mono: true
                },

                {
                    title: this.$i18n.t('gas.limit'),
                    detail: this.formatNumber(this.block.gasLimit)
                },
                {
                    title: this.$i18n.t('gas.used'),
                    detail: this.formatNumber(this.block.gasUsed)
                },
                {
                    title: this.$i18n.t('block.logs'),
                    detail: this.block.logsBloom,
                    mono: true
                },
                {
                    title: this.$i18n.t('tx.root'),
                    detail: this.block.transactionsRoot,
                    mono: true
                },
                {
                    title: this.$i18n.t('block.rcpt-root'),
                    detail: this.block.receiptsRoot,
                    mono: true
                },
                {
                    title: `${this.$i18n.tc('uncle.name', 2)} ${this.$i18n.t('common.sha')}`,
                    detail: this.block.sha3Uncles,
                    mono: true
                }
            ]
        }
        return details
    }
    get rewards(): FormattedNumber {
        return this.formatVariableUnitEthValue(new BN(this.block.summary.rewards.total))
    }
    get uncleRewards(): FormattedNumber {
        return this.formatVariableUnitEthValue(new BN(this.block.summary.rewards.uncles))
    }
    get transactionFees(): FormattedNumber {
        return this.formatVariableUnitEthValue(new BN(this.block.summary.rewards.txFees))
    }
    get transactionsCount(): string {
        const failed = this.block.summary.txFail ? 1 : 2
        const failedString = this.block.summary.txFail > 0 ? `, ${this.formatNumber(this.block.summary.txFail)} ${this.$tc('tx.failed', failed)}` : ''
        return `${this.formatNumber(this.block.summary.txCount)} ${failedString}`
    }
    get lastBlock(): number | undefined {
        if (!this.$apollo.queries.getLatestBlockInfo.loading) {
            return this.newBlockNumber ? this.newBlockNumber : this.getLatestBlockInfo.number
        }
        return undefined
    }
    get nextBlock(): String | null {
        const next = this.block.summary.number + 1
        if (this.lastBlock && this.lastBlock >= next) {
            return `/block/number/${next}`
        }
        return ''
    }

    get previousBlock(): string {
        const prev = this.block.summary.number - 1
        if (prev >= 0) {
            return `/block/number/${prev}`
        }
        return ''
    }

    /**
     * Determines whether or not component has an error.
     * If error property is empty string, there is no error.
     *
     * @return {Boolean} - Whether or not error exists
     */
    get hasError(): boolean {
        return this.error !== ''
    }
}
</script>
