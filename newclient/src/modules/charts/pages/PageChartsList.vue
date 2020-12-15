<template>
    <v-container grid-list-lg class="mb-0">
        <app-bread-crumbs :new-items="crumbs"></app-bread-crumbs>
        <app-tabs :tabs="pageTabs">
            <!--
            =====================================================================================
             TXS TAB
            =====================================================================================
            -->
            <v-tab-item slot="tabs-item" value="tab-0">
                <v-layout :class="contentClass" row wrap justify-start>
                    <v-flex xs12 md6>
                        <chart-link :chart-id="ChartType.average_txs.link" />
                    </v-flex>
                    <v-flex xs12 md6>
                        <chart-link :chart-id="ChartType.total_txs.link" />
                    </v-flex>
                    <v-flex xs12 md6>
                        <chart-link :chart-id="ChartType.min_txs.link" />
                    </v-flex>
                    <v-flex xs12 md6>
                        <chart-link :chart-id="ChartType.max_txs.link" />
                    </v-flex>
                </v-layout>
            </v-tab-item>
            <!--
            =====================================================================================
             PENDING TXS TAB
            =====================================================================================
            -->
            <v-tab-item slot="tabs-item" value="tab-1">
                <v-layout :class="contentClass" row wrap justify-start>
                    <v-flex xs12 md6>
                        <chart-link :chart-id="ChartType.average_new_pending_txs.link" />
                    </v-flex>
                    <v-flex xs12 md6>
                        <chart-link :chart-id="ChartType.total_new_pending_txs.link" />
                    </v-flex>
                </v-layout>
            </v-tab-item>
            <!--
            =====================================================================================
            GAS PRICE TAB
            =====================================================================================
            -->
            <v-tab-item slot="tabs-item" value="tab-2">
                <v-layout :class="contentClass" row wrap justify-start>
                    <v-flex xs12 md6>
                        <chart-link :chart-id="ChartType.average_gas_price.link" />
                    </v-flex>
                    <v-flex xs12 md6>
                        <chart-link :chart-id="ChartType.min_gas_price.link" />
                    </v-flex>
                    <v-flex xs12 md6>
                        <chart-link :chart-id="ChartType.max_gas_price.link" />
                    </v-flex>
                </v-layout>
            </v-tab-item>
        </app-tabs>
    </v-container>
</template>

<script lang="ts">
import AppTabs from '@app/core/components/ui/AppTabs.vue'
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import ChartLink from '@app/modules/charts/components/ChartLink.vue'
import { Tab, Crumb } from '@app/core/components/props'
import { Vue, Component } from 'vue-property-decorator'
import { ChartRouteKey } from '@app/modules/charts/models'

@Component({
    components: {
        AppBreadCrumbs,
        AppTabs,
        ChartLink
    }
})
export default class PageChartsList extends Vue {
    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */
    ChartType = ChartRouteKey

    /*
  ===================================================================================
    Computed
  ===================================================================================
  */

    get crumbs(): Crumb[] {
        return [
            {
                text: this.$t('charts.name')
            }
        ]
    }

    get pageTabs(): Tab[] {
        return [
            {
                id: 0,
                title: this.$i18n.tc('tx.name', 2),
                isActive: true
            },
            {
                id: 1,
                title: this.$i18n.tc('tx.pending', 2),
                isActive: false
            },
            {
                id: 2,
                title: this.$i18n.t('gas.price'),
                isActive: false
            }
        ]
    }

    get contentClass(): String {
        return this.$vuetify.breakpoint.name === 'xs' ? 'ma-0' : 'ma-2'
    }
}
</script>
