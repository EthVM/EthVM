<template>
    <v-container grid-list-lg class="mb-0">
        <app-bread-crumbs :new-items="crumbs" />
        <time-series-chart-data :chart-key="chartId" />
    </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import TimeSeriesChartData from '@app/modules/charts/handlers/TimeSeriesChartData.vue'
import { Crumb } from '@app/core/components/props'
import { TimeseriesKey } from '@app/modules/charts/models'

@Component({
    components: {
        AppBreadCrumbs,
        TimeSeriesChartData
    }
})
export default class PageUniqueChart extends Vue {
    /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */
    get crumbs(): Crumb[] {
        const translationsId = `charts.${this.chartId.replace(/_/g, '-').toLowerCase()}.title`
        return [
            {
                text: this.$t('charts.name'),
                link: '/charts'
            },
            {
                text: this.$t(translationsId)
            }
        ]
    }

    get chartId(): TimeseriesKey {
        return TimeseriesKey[this.$route.params.chartRef]
    }
}
</script>
