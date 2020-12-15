<template>
    <v-container grid-list-lg class="mb-0">
        <app-bread-crumbs :new-items="crumbs" />
        <time-series-chart-data :chart-ref="chartRef" />
    </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import TimeSeriesChartData from '@app/modules/charts/handlers/TimeSeriesChartData.vue'
import { Crumb } from '@app/core/components/props'

@Component({
    components: {
        AppBreadCrumbs,
        TimeSeriesChartData
    }
})
export default class PageUniqueChart extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop({ type: String, required: true }) chartRef!: string

    /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */
    get crumbs(): Crumb[] {
        const translationsId = `charts.${this.chartRef}.title`
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
}
</script>
