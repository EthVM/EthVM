<template>
    <!--
    =====================================================================================
      DETAILS LIST
    =====================================================================================
    -->
    <v-layout row wrap justify-start class="mb-4">
        <v-flex xs12>
            <app-details-list :details="blockDetails" :is-loading="loading" :max-items="9" :is-block="true" class="mb-4">
                <template #title>
                    <block-details-title
                        :curr-block="currBlockNumber"
                        :has-eth-block="isEthBlock"
                        :eth-block-img="ethBlockImg"
                        :eth-block-desc="ethBlockDesc"
                        :next-block="nextBlock"
                        :prev-block="previousBlock"
                        :uncles="uncleHashes"
                        :loading="loading"
                        :is-subscribed="subscribed"
                    />
                    <v-divider class="lineGrey" />
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
import { getEthBlock } from './ethBlockDetails.graphql'
import { BlockDetails as BlockDetailsType } from './apolloTypes/BlockDetails'
import { getLastBlockNumber_getLatestBlockInfo as lastBlockType } from './apolloTypes/getLastBlockNumber'
import { getEthBlock_getEthBlock as ethBlockType } from './apolloTypes/getEthBlock'
import { FormattedNumber } from '@app/core/helper/number-format-helper'
import { NewBlockSubscription } from '@app/modules/blocks/NewBlockSubscription/newBlockSubscription.mixin'
import BN from 'bignumber.js'
import { ErrorMessageBlock } from '@app/modules/blocks/models/ErrorMessagesForBlock'
import newBlockFeed from '../../NewBlockSubscription/newBlockFeed.graphql'
import { excpBlockNotMined } from '@app/apollo/exceptions/errorExceptions'

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
            fetchPolicy: 'network-only',
            variables() {
                return { blockRef: this.isHash ? this.blockRef : parseInt(this.blockRef) }
            },
            skip() {
                return this.subscribed
            },
            update: data => data.getBlockByHash || data.getBlockByNumber,
            result({ data }) {
                if (this.block) {
                    if (this.isHash) {
                        this.emitBlockNumber()
                    }
                    this.$emit('isMined', true)
                    this.emitErrorState(false)
                }
            },
            error(error) {
                const newError = JSON.stringify(error.message)
                if (newError.toLowerCase().includes(excpBlockNotMined) && !this.isHash && !this.subscribed) {
                    this.startSubscription()
                } else {
                    this.emitErrorState(true)
                }
            }
        },
        getLatestBlockInfo: {
            query: getLastBlockNumber,
            fetchPolicy: 'cache-and-network'
        },
        ethBlock: {
            query: getEthBlock,
            client: 'EthBlocksClient',
            variables() {
                return { blockNumber: this.currBlockNumber, chainId: 1 }
            },
            skip() {
                return !this.isEthBlock
            },
            update: data => data.getEthBlock
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

    hasError = false
    syncing: undefined
    block!: BlockDetailsType
    getLatestBlockInfo!: lastBlockType
    skipDetailsFetch = false
    subscribed = false
    ethBlock!: ethBlockType

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */

    get loading(): boolean | undefined {
        return this.hasError ? this.hasError : this.$apollo.queries.block.loading || this.subscribed
    }

    get uncleHashes(): (string | null)[] {
        return this.block && this.block.summary.uncles ? this.block.summary.uncles! : []
    }

    get blockDetails(): Detail[] {
        let details: Detail[]
        if (this.loading) {
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
                    title: this.$i18n.t('miner.total-rewards')
                },
                {
                    title: this.$i18n.t('uncle.reward')
                },
                {
                    title: this.$i18n.tc('tx.name', 2)
                },
                {
                    title: this.$i18n.t('diff.name')
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
                    link: `/block/hash/${this.block.parentHash}`,
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
                    mono: true,
                    toChecksum: true
                },
                {
                    title: this.$i18n.t('miner.total-rewards'),
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
            const latestBlockNum = this.getLatestBlockInfo ? this.getLatestBlockInfo.number : undefined
            return this.newBlockNumber ? this.newBlockNumber : latestBlockNum
        }
        return undefined
    }
    get nextBlock(): String | null {
        const next = this.block ? this.block.summary.number + 1 : -1
        if (this.lastBlock && this.lastBlock >= next) {
            return `/block/number/${next}`
        }
        return ''
    }

    get previousBlock(): string {
        const prev = this.block ? this.block.summary.number - 1 : -1
        if (prev >= 0) {
            return `/block/number/${prev}`
        }
        return ''
    }
    get currBlockNumber(): number | null {
        return this.block && this.block.summary ? this.block.summary.number : null
    }
    get isEthBlock(): boolean {
        if (this.lastBlock && (this.currBlockNumber || this.currBlockNumber === 0)) {
            const curr = new BN(this.currBlockNumber)
            if (curr.isEqualTo(0)) {
                return true
            }
            if (curr.isLessThanOrEqualTo(10)) {
                return false
            }
            const recentEthBlock = new BN(this.lastBlock).minus(50)
            return curr.lte(recentEthBlock)
        }
        return false
    }
    get loadingEthBlock(): boolean {
        return this.$apollo.queries.ethBlock.loading
    }
    get ethBlockImg(): string {
        return this.loadingEthBlock || !this.ethBlock ? '' : this.ethBlock.img
    }
    get ethBlockDesc(): string {
        return this.loadingEthBlock || !this.ethBlock ? '' : this.ethBlock.description
    }
    /*
    ===================================================================================
     Methods
    ===================================================================================
    */
    /**
     * Method to start subscription
     */
    startSubscription(): void {
        this.subscribed = true
        const observer = this.$apollo.subscribe({
            query: newBlockFeed
        })
        const a = observer.subscribe({
            next: data => {
                if (new BN(data.data.newBlockFeed.number).isGreaterThanOrEqualTo(new BN(this.blockRef))) {
                    a.unsubscribe()
                    this.subscribed = false
                }
            },
            error: error => {
                this.emitErrorState(true)
            }
        })
    }

    /**
     * Emits error to Sentry
     * @param val {Boolean}
     */
    emitErrorState(val: boolean): void {
        this.hasError = val
        this.$emit('errorDetails', this.hasError, ErrorMessageBlock.details)
    }
    /**
     * Emits setBlockNumber to parent
     */
    emitBlockNumber(): void {
        this.$emit('setBlockNumber', this.block.summary.number.toString())
    }
}
</script>
