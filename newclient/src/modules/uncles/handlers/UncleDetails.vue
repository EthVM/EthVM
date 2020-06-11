<template>
    <!--
    =====================================================================================
      UNCLE DETAILS LIST
    =====================================================================================
    -->
    <v-layout row wrap justify-start class="mb-4">
        <v-flex xs12>
            <app-details-list :title="title" :details="uncleDetails" :is-loading="loading" :error="error" />
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import AppDetailsList from '@app/core/components/ui/AppDetailsList.vue'
import { Detail } from '@app/core/components/props'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { getUncleByHash } from './uncleDetails.graphql'
import { UncleDetails as UncleDetailsType } from './UncleDetails.type'

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
            error({ graphQLErrors, networkError }) {
                // TODO refine
                if (networkError) {
                    this.error = this.$i18n.t('message.invalid.uncle')
                }
            }
        }
    }
})
export default class UncleDetails extends Vue {
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

    uncle?: UncleDetailsType
    error = ''

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
        if (this.loading || this.error) {
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
            // not too sure if we still need this check
            if (!this.uncle) {
                this.error = this.$i18n.t('message.invalid.uncle').toString()
                return []
            }
            details = [
                {
                    title: this.$i18n.t('uncle.height'),
                    detail: this.uncle.block.summary.number
                },
                {
                    title: this.$i18n.t('uncle.position'),
                    detail: this.uncle.unclePosition
                },
                // {
                //     title: this.$i18n.t('uncle.included'),
                //     detail: this.uncle.nephewNumberFormatted,
                //     link: `/block/number/${this.uncle.nephewNumberBN.toString()}`
                // },
                {
                    title: this.$i18n.t('common.hash'),
                    detail: this.uncle.block.hash,
                    copy: true,
                    mono: true
                },
                {
                    title: this.$i18n.t('block.p-hash'),
                    detail: this.uncle.parentHash,
                    mono: true
                },
                {
                    title: this.$i18n.tc('miner.name', 1),
                    detail: this.uncle.block.summary.miner,
                    link: `/address/${this.uncle.block.summary.miner}`,
                    copy: true,
                    mono: true
                },
                {
                    title: this.$i18n.t('common.timestmp'),
                    detail: this.$i18n.d(this.uncle.block.summary.timestamp, 'long', this.$i18n.locale.replace('_', '-'))
                },
                {
                    title: this.$i18n.t('common.sha'),
                    detail: this.uncle.block.sha3Uncles,
                    mono: true
                },
                {
                    title: this.$i18n.t('gas.limit'),
                    detail: this.uncle.block.gasLimit
                    // tooltip: this.uncle.gasLimit.tooltipText ? `${this.uncle.gasLimitFormatted.tooltipText}` : undefined
                },
                {
                    title: this.$i18n.t('gas.used'),
                    detail: this.uncle.block.gasUsed
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
        return this.$apollo.queries.uncle.loading
    }
}
</script>
