<template>
    <!--
    =====================================================================================
      TX DETAILS LIST
    =====================================================================================
    -->
    <v-layout row wrap justify-start class="mb-4">
        <v-flex xs12>
            <app-details-list :title="title" :details="txDetails" :is-loading="isLoading" :error="error" :max-items="7" />
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import AppDetailsList from '@app/core/components/ui/AppDetailsList.vue'
import { eth } from '@app/core/helper'
import { Detail, Crumb } from '@app/core/components/props'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { getTransactionByHash } from './txDetails.graphql'
import { TxDetails as TxDetailsType } from './TxDetails.type'

@Component({
    components: {
        AppDetailsList
    },
    data() {
        return {
            syncing: undefined
        }
    },
    apollo: {
        transaction: {
            query() {
                return getTransactionByHash
            },
            variables() {
                return { hash: this.txHash }
            },
            fetchPolicy: 'cache-and-network',
            update: data => data.getTransactionByHash
        }
    }
})
export default class PageDetailsTxs extends Vue {
    /*
  ===================================================================================
    Props
  ===================================================================================
  */

    @Prop({ type: String }) txRef!: string

    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

    error = ''
    syncing?: boolean
    transactionDetail?: TransactionDetailExt

    // TODO remove these?
    listType = 'tx'

    /*
  ===================================================================================
    Methods
  ===================================================================================
  */

    created() {
        // Check that current tx ref is valid one

        if (!this.txHash) {
            this.error = this.$i18n.t('message.invalid.tx').toString()
            return
        }

        window.scrollTo(0, 0)
    }

    /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

    get txHash(): string | null {
        const { txRef } = this
        return eth.isValidHash(txRef) ? txRef : null
    }

    /**
     * Create properly-formatted title from tokenDetails
     *
     * @return {String} - Title for details list
     */
    get title(): string {
        return this.$i18n.t('tx.detail').toString()
    }

    /*
 ===================================================================================
   Methods
 ===================================================================================
 */

    /**
     * Return properly-formatted Detail for "to" row in list component.
     *
     * @return {Detail}
     */
    toDetail(transaction: TransactionDetailExt): Detail {
        const { receipt } = transaction

        if (receipt && receipt.contractAddress) {
            return {
                title: `${this.$i18n.t('tx.to')} ${this.$i18n.tc('contract.name', 1).toString()}`,
                detail: receipt.contractAddress,
                copy: true,
                link: `/address/${receipt.contractAddress}`,
                mono: true
            }
        }

        return {
            title: this.$i18n.t('tx.to').toString(),
            detail: transaction.to!,
            copy: true,
            link: `/address/${transaction.to!}`,
            mono: true
        }
    }

    /**
     * Properly format the Details[] array for the details table.
     * If the data hasn't been loaded yet, then only include the titles in the details.
     */
    get txDetails(): Detail[] {
        let details: Detail[]
        if (this.isLoading || this.error) {
            details = [
                {
                    title: this.$i18n.t('block.number')
                },
                {
                    title: this.$i18n.t('common.hash')
                },
                {
                    title: this.$i18n.t('common.timestmp')
                },
                {
                    title: this.$i18n.t('tx.from')
                },
                {
                    title: this.$i18n.t('common.amount')
                },
                {
                    title: this.$i18n.t('tx.to').toString()
                },
                {
                    title: this.$i18n.t('gas.limit')
                },
                {
                    title: this.$i18n.t('gas.used')
                },
                {
                    title: this.$i18n.t('gas.price')
                },
                {
                    title: this.$i18n.tc('tx.fee', 1)
                }
            ]
        } else {
            const transaction = this.transactionDetail!
            const receipt = transaction.receipt!

            details = [
                {
                    title: this.$i18n.t('block.number'),
                    detail: transaction.blockNumberFormatted,
                    link: `/block/number/${transaction.blockNumber}`
                },
                {
                    title: this.$i18n.t('common.hash'),
                    detail: transaction.hash,
                    copy: true,
                    mono: true
                },
                {
                    title: this.$i18n.t('common.timestmp'),
                    detail: this.$i18n.d(transaction.timestampMs, 'long', this.$i18n.locale.replace('_', '-'))
                },
                {
                    title: this.$i18n.t('tx.from'),
                    detail: transaction.from,
                    copy: true,
                    link: `/address/${transaction.from}`,
                    mono: true
                },
                {
                    title: this.$i18n.t('common.amount'),
                    detail: `${transaction.valueFormatted.value} ${this.$i18n.t(`common.${transaction.valueFormatted.unit}`)}`,
                    tooltip: transaction.valueFormatted.tooltipText ? `${transaction.valueFormatted.tooltipText} ${this.$i18n.t('common.eth')}` : undefined
                },
                this.toDetail(transaction),
                {
                    title: this.$i18n.tc('tx.fee', 2),
                    detail: `${transaction.feeFormatted.value} ${this.$i18n.t('common.eth')}`,
                    tooltip: transaction.feeFormatted.tooltipText ? `${transaction.feeFormatted.tooltipText} ${this.$i18n.t('common.eth')}` : undefined
                },
                {
                    title: this.$i18n.t('gas.limit'),
                    detail: transaction.gasFormatted.value,
                    tooltip: transaction.gasFormatted.tooltipText ? `${transaction.gasFormatted.tooltipText}` : undefined
                },
                {
                    title: this.$i18n.t('gas.used'),
                    detail: receipt ? receipt.gasUsedFormatted.value : '0', // genesis block txs can have no receipt
                    tooltip: receipt && receipt.gasUsedFormatted.tooltipText ? `${receipt.gasUsedFormatted.tooltipText}` : undefined
                },
                {
                    title: this.$i18n.t('gas.price'),
                    detail: `${transaction.gasPriceFormatted.value} ${this.$i18n.t(`common.${transaction.gasPriceFormatted.unit}`)}`,
                    tooltip: transaction.gasPriceFormatted.tooltipText ? `${transaction.gasPriceFormatted.tooltipText}` : undefined
                },
                {
                    title: this.$i18n.t('common.nonce'),
                    detail: transaction.nonceFormatted.value,
                    tooltip: transaction.nonceFormatted.tooltipText ? `${transaction.nonceFormatted.tooltipText}` : undefined
                },
                {
                    title: this.$i18n.t('tx.input'),
                    detail: '',
                    txInput: this.inputFormatted
                }
            ]
        }

        return details
    }

    /**
     * Returns breadcrumbs entry for this particular view.
     * Required for AppBreadCrumbs
     *
     * @return {Array} - Breadcrumb entry. See description.
     */
    get crumbs(): Crumb[] {
        return [
            {
                text: this.$t('tx.mined'),
                link: '/txs'
            },
            {
                text: this.$tc('tx.hash', 1),
                hash: this.txRef
            }
        ]
    }

    /**
     * Determines whether or not the tx object has been loaded/populated.
     *
     * @return {Boolean}
     */
    get isLoading(): boolean | undefined {
        return this.$apollo.loading || this.syncing
    }

    get inputFormatted(): string[] {
        if (!this.transactionDetail) {
            return ['0x']
        }

        const methodId = this.transactionDetail.inputMethodId
        if (!methodId) {
            return ['0x']
        }

        const methodFormatted = `${this.$i18n.t('tx.method')}: ${methodId}`

        const inputFunction = this.transactionDetail.inputFunction

        if (inputFunction) {
            return [`${this.$i18n.t('tx.func')}: ${inputFunction}`, methodFormatted]
        }

        return [methodFormatted]
    }
}
</script>
