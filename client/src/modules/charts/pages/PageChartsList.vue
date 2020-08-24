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
                        <chart-link :chart-id="ChartType.TX_COUNT_AVG" />
                    </v-flex>
                    <v-flex xs12 md6>
                        <chart-link :chart-id="ChartType.TX_COUNT_TOTAL" />
                    </v-flex>
                    <v-flex xs12 md6>
                        <chart-link :chart-id="ChartType.TX_COUNT_MIN" />
                    </v-flex>
                    <v-flex xs12 md6>
                        <chart-link :chart-id="ChartType.TX_COUNT_MAX" />
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
                        <chart-link :chart-id="ChartType.PENDING_TX_COUNT_AVG" />
                    </v-flex>
                    <v-flex xs12 md6>
                        <chart-link :chart-id="ChartType.PENDING_TX_COUNT_TOTAL" />
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
                        <chart-link :chart-id="ChartType.GAS_PRICE_AVG" />
                    </v-flex>
                    <v-flex xs12 md6>
                        <chart-link :chart-id="ChartType.GAS_PRICE_MIN" />
                    </v-flex>
                    <v-flex xs12 md6>
                        <chart-link :chart-id="ChartType.GAS_PRICE_MAX" />
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
import { TimeseriesKey } from '@app/modules/charts/models'

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
    ChartType = TimeseriesKey

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
                isActive: false
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
