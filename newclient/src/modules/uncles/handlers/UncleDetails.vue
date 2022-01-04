<template>
    <!--
    =====================================================================================
      UNCLE DETAILS LIST
    =====================================================================================
    -->
    <v-layout row wrap justify-start class="mb-4">
        <v-flex xs12>
            <app-details-list :title="title" :details="uncleDetails" :is-loading="loading" />
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import AppDetailsList from '@app/core/components/ui/AppDetailsList.vue'
import { Detail } from '@app/core/components/props'
import { Mixins, Component, Prop } from 'vue-property-decorator'
import { getUncleByHash } from './uncleDetails.graphql'
import { UncleDetails as UncleDetailsType } from './apolloTypes/UncleDetails'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import { ErrorMessageUncle } from '@app/modules/uncles/models/ErrorMessagesForUncle'
import { excpUncleNotFound } from '@app/apollo/exceptions/errorExceptions'

@Component({
    components: {
        AppDetailsList
    },
    apollo: {
        uncle: {
            query: getUncleByHash,
            variables() {
                return { hash: this.uncleRef }
            },
            update: data => data.getUncleByHash,
            result({ data }) {
                if (data && data.getUncleByHash) {
                    this.emitErrorState(false)
                }
            },
            error(error) {
                const newError = JSON.stringify(error.message)
                if (newError.toLowerCase().includes(excpUncleNotFound)) {
                    this.emitErrorState(true, true)
                } else {
                    this.emitErrorState(true)
                }
            }
        }
    }
})
export default class UncleDetails extends Mixins(NumberFormatMixin) {
    /*
  ===================================================================================
    Props
  ===================================================================================
  */

    @Prop({ type: String }) uncleRef!: string

    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

    uncle!: UncleDetailsType
    hasError = false
    /*
  ===================================================================================
    Computed
  ===================================================================================
  */

    /**
     * Return the title for the details list.
     *
     * @return {String}
     */
    get title(): string {
        return this.$i18n.t('uncle.detail').toString()
    }

    /**
     * Return properly formatted Details[] array for the details table.
     * If the data hasn't been loaded yet, then only include the titles in the details.
     *
     * @return {Detail[]}
     */
    get uncleDetails(): Detail[] {
        let details: Detail[]
        if (this.loading) {
            details = [
                {
                    title: this.$i18n.t('uncle.height')
                },
                {
                    title: this.$i18n.t('uncle.position')
                },
                {
                    title: this.$i18n.t('uncle.included')
                },
                {
                    title: this.$i18n.t('common.hash')
                },
                {
                    title: this.$i18n.t('block.p-hash')
                },
                {
                    title: this.$i18n.tc('miner.name', 2)
                },
                {
                    title: this.$i18n.t('common.timestmp')
                },
                {
                    title: this.$i18n.t('common.sha')
                },
                {
                    title: this.$i18n.t('gas.limit')
                },
                {
                    title: this.$i18n.t('gas.used')
                }
            ]
        } else {
            details = [
                {
                    title: this.$i18n.t('uncle.height'),
                    detail: this.formatNumber(this.uncle.block.summary.number)
                },
                {
                    title: this.$i18n.t('uncle.position'),
                    detail: this.uncle.unclePosition
                },
                {
                    title: this.$i18n.t('common.hash'),
                    detail: this.uncle.block.hash,
                    copy: true,
                    mono: true
                },
                {
                    title: this.$i18n.t('uncle.included'),
                    detail: this.uncle.parentBlockNumber,
                    link: `/block/number/${this.uncle.parentBlockNumber}`
                },
                {
                    title: this.$i18n.tc('miner.name', 1),
                    detail: this.uncle.block.summary.miner,
                    link: `/address/${this.uncle.block.summary.miner}`,
                    copy: true,
                    mono: true,
                    toChecksum: true
                },
                {
                    title: this.$i18n.t('common.timestmp'),
                    detail: new Date(this.uncle.block.summary.timestamp * 1e3).toString()
                },
                {
                    title: this.$i18n.t('common.sha'),
                    detail: this.uncle.block.sha3Uncles,
                    mono: true
                },
                {
                    title: this.$i18n.t('gas.limit'),
                    detail: this.formatNumber(this.uncle.block.gasLimit)
                    // tooltip: this.uncle.gasLimit.tooltipText ? `${this.uncle.gasLimitFormatted.tooltipText}` : undefined
                },
                {
                    title: this.$i18n.t('gas.used'),
                    detail: this.formatNumber(this.uncle.block.gasUsed)
                    // tooltip: this.uncle.gasUsedFormatted.tooltipText ? `${this.uncle.gasUsedFormatted.tooltipText}` : undefined
                }
            ]
        }
        return details
    }

    /**
     * Determines whether or not the uncle object has been loaded/populated.
     *
     * @return {Boolean}
     */
    get loading(): boolean | undefined {
        return this.$apollo.queries.uncle.loading || this.hasError
    }

    /*
  ===================================================================================
    Methods:
  ===================================================================================
  */
    /**
     * Emit error to Sentry
     * @param val {Boolean}
     * @param hashNotFound {Boolean}
     */
    emitErrorState(val: boolean, hashNotFound = false): void {
        this.hasError = val
        const mess = hashNotFound ? ErrorMessageUncle.notFound : ErrorMessageUncle.details
        this.$emit('errorDetails', this.hasError, mess)
    }
}
</script>
