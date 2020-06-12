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
import { Detail } from '@app/core/components/props'
import { Mixins, Component, Prop } from 'vue-property-decorator'
import { getTransactionByHash } from './txDetails.graphql'
import { TxDetails as TxDetailsType } from './TxDetails.type'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import { FormattedNumber } from '@app/core/helper/number-format-helper'
import BN from 'bignumber.js'

@Component({
    components: {
        AppDetailsList
    },
    apollo: {
        transaction: {
            query() {
                return getTransactionByHash
            },
            variables() {
                return { hash: this.txRef }
            },
            fetchPolicy: 'cache-and-network',
            update: data => data.getTransactionByHash
        }
    }
})
export default class TxDetails extends Mixins(NumberFormatMixin) {
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
    transaction?: TxDetailsType

    /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

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
    toDetail(transaction: TxDetailsType): Detail {
        // TODO need tx receipt
        // const { receipt } = transaction

        // if (receipt && receipt.contractAddress) {
        //     return {
        //         title: `${this.$i18n.t('tx.to')} ${this.$i18n.tc('contract.name', 1).toString()}`,
        //         detail: receipt.contractAddress,
        //         copy: true,
        //         link: `/address/${receipt.contractAddress}`,
        //         mono: true
        //     }
        // }

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
            // const receipt = transaction.receipt!
            console.log('adf', this.txFee)
            details = [
                {
                    title: this.$i18n.t('block.number'),
                    detail: this.formatNumber(this.transaction.blockNumber),
                    link: `/block/number/${this.transaction.blockNumber}`
                },
                {
                    title: this.$i18n.t('common.hash'),
                    detail: this.transaction.hash,
                    copy: true,
                    mono: true
                },
                {
                    title: this.$i18n.t('common.timestmp'),
                    detail: this.$i18n.d(this.transaction.timestamp, 'long', this.$i18n.locale.replace('_', '-'))
                },
                {
                    title: this.$i18n.t('tx.from'),
                    detail: this.transaction.from,
                    copy: true,
                    link: `/address/${this.transaction.from}`,
                    mono: true
                },
                {
                    title: this.$i18n.t('common.amount'),
                    detail: `${this.txAmount.value} ${this.txAmount.unit}`,
                    tooltip: this.txAmount.tooltipText ? `${this.txAmount.tooltipText} ${this.$i18n.t('common.eth')}` : undefined
                },
                this.toDetail(this.transaction),
                {
                    title: this.$i18n.t('tx.status'),
                    detail: `${this.$i18n.tc('tx.' + this.txStatus, 1)}`
                },
                // TODO need tx fee or do we calculate it ourselves ? 
                {
                    title: this.$i18n.tc('tx.fee', 2),
                    detail: `${this.txFee.value} ${this.$i18n.t('common.eth')}`,
                    tooltip: this.txFee.tooltipText ? `${this.txFee.tooltipText} ${this.$i18n.t('common.eth')}` : undefined
                },
                {
                    title: this.$i18n.t('gas.limit'),
                    detail: this.formatNumber(this.transaction.gas)
                    // tooltip: this.transaction.gasFormatted.tooltipText ? `${this.transaction.gasFormatted.tooltipText}` : undefined
                },
                {
                    title: this.$i18n.t('gas.used'),
                    detail: this.formatNumber(this.transaction.gasUsed) // TODO genesis block txs can have no receipt
                    // tooltip: receipt && receipt.gasUsedFormatted.tooltipText ? `${receipt.gasUsedFormatted.tooltipText}` : undefined
                },
                {
                    title: this.$i18n.t('gas.price'),
                    detail: `${this.gasPrice.value} ${this.gasPrice.unit}`,
                    tooltip: this.gasPrice.tooltipText ? `${this.gasPrice.tooltipText} ${this.$i18n.t('common.eth')}` : undefined
                },
                {
                    title: this.$i18n.t('common.nonce'),
                    detail: this.transaction.nonce
                    // tooltip: this.transaction.nonce.tooltipText ? `${this.transaction.nonce.tooltipText}` : undefined
                },
                {
                    title: this.$i18n.t('tx.input'),
                    detail: this.transaction.input
                    // txInput: this.inputFormatted
                }
            ]
        }

        return details
    }

    /**
     * Determines whether or not the tx object has been loaded/populated.
     *
     * @return {Boolean}
     */
    get isLoading(): boolean | undefined {
        return this.$apollo.queries.transaction.loading
    }
    /**
     * Formats the transaction value to ETH.
     *
     * @return {FormattedNumber}
     */
    get txAmount(): FormattedNumber {
        return this.formatVariableUnitEthValue(new BN(this.transaction.value))
    }
    /**
     * Formats the gas price value to gwei.
     *
     * @return {FormattedNumber}
     */
    get gasPrice(): FormattedNumber {
        return this.formatVariableUnitEthValue(new BN(this.transaction.gasPrice))
    }
    /**
     * Gets the tx status.
     *
     * @return {String}
     */
    get txStatus(): string {
        const statuses = ['0x0', '0x1']
        if (this.transaction.status === statuses[1]) {
            return 'success'
        }

        if (this.transaction.status === statuses[0]) {
            return 'failed'
        }

        return 'pending'
    }
    /**
     * Calculate the transaction fee.
     *
     * @return {String}
     */
    get txFee(): string | null {
        if (this.transaction && this.transaction.gasUsed) {
            const price = new BN(this.transaction.gasPrice)
            const used = new BN(this.transaction.gasUsed)
            const fee = price.times(used)
            return this.formatVariableUnitEthValue(fee)
        }
        return '0'
    }

    // TODO Figure out if we stil need this
    // get inputFormatted(): string[] {
    //     if (!this.transaction) {
    //         return ['0x']
    //     }

    //     const methodId = this.transaction.input
    //     if (!methodId) {
    //         return ['0x']
    //     }

    //     const methodFormatted = `${this.$i18n.t('tx.method')}: ${methodId}`

    //     const inputFunction = this.transaction.inputFunction

    //     if (inputFunction) {
    //         return [`${this.$i18n.t('tx.func')}: ${inputFunction}`, methodFormatted]
    //     }

    //     return [methodFormatted]
    // }
}
</script>
