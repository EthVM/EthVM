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
import { Vue, Component, Prop } from 'vue-property-decorator'
import { getTransactionByHash } from './txDetails.graphql'
import { TxDetails as TxDetailsType } from './TxDetails.type'

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
export default class TxDetails extends Vue {
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
            console.error('tx', this.transaction)
            // const receipt = transaction.receipt!
            details = [
                {
                    title: this.$i18n.t('block.number'),
                    detail: this.transaction.blockNumber,
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
                    detail: this.transaction.value
                    // tooltip: this.transaction.valueFormatted.tooltipText ? `${this.transaction.valueFormatted.tooltipText} ${this.$i18n.t('common.eth')}` : undefined
                },
                this.toDetail(this.transaction),
                // TODO need tx fee or do we calculate it ourselves ? 
                // {
                //     title: this.$i18n.tc('tx.fee', 2),
                //     detail: `${this.transaction.feeFormatted.value} ${this.$i18n.t('common.eth')}`,
                //     // tooltip: this.transaction.feeFormatted.tooltipText ? `${this.transaction.feeFormatted.tooltipText} ${this.$i18n.t('common.eth')}` : undefined
                // },
                {
                    title: this.$i18n.t('gas.limit'),
                    detail: this.transaction.gas
                    // tooltip: this.transaction.gasFormatted.tooltipText ? `${this.transaction.gasFormatted.tooltipText}` : undefined
                },
                {
                    title: this.$i18n.t('gas.used'),
                    detail: this.transaction.gasUsed // TODO genesis block txs can have no receipt
                    // tooltip: receipt && receipt.gasUsedFormatted.tooltipText ? `${receipt.gasUsedFormatted.tooltipText}` : undefined
                },
                {
                    title: this.$i18n.t('gas.price'),
                    detail: this.transaction.gasPrice
                    // tooltip: this.transaction.gasPriceFormatted.tooltipText ? `${this.transaction.gasPriceFormatted.tooltipText}` : undefined
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
