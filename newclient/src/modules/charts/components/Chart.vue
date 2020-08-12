<template>
    <v-card color="white" flat class="mb-3 pa-1">
        <!--
        =====================================================================================
          Chart header
        =====================================================================================
        -->
        <v-layout align-center row wrap mb-0>
            <!--
            =====================================================================================
             Title and short description
            =====================================================================================
            -->
            <v-flex grow pa-1>
                <v-card-title class="title font-weight-bold ml-1 pb-0">{{ chartTitle }}</v-card-title>
                <v-card-text class="info--text caption ml-1 pt-2 pb-1">{{ chartDescription }}</v-card-text>
            </v-flex>
            <!--
            =====================================================================================
             Time frame buttons
            =====================================================================================
            -->
            <v-flex v-if="showTimeOptions" grow>
                <v-layout row wrap align-center justify-end pa-3>
                    <button :class="[toggleData === 0 ? 'active-button' : 'button']" flat small @click="toggleData = 0">
                        {{ $tc('charts.states.day', 2) }}
                    </button>
                    <button :class="[toggleData === 1 ? 'active-button' : 'button']" flat small @click="toggleData = 1">
                        {{ $tc('charts.states.week', 2) }}
                    </button>
                    <button :class="[toggleData === 2 ? 'active-button' : 'button']" flat small @click="toggleData = 2">
                        {{ $tc('charts.states.week-two', 2) }}
                    </button>
                    <button :class="[toggleData === 3 ? 'active-button' : 'button']" flat small @click="toggleData = 3">
                        {{ $tc('charts.states.month', 2) }}
                    </button>
                    <button :class="[toggleData === 4 ? 'active-button' : 'button']" flat small @click="toggleData = 4">
                        {{ $tc('charts.states.month-three', 2) }}
                    </button>
                    <button :class="[toggleData === 5 ? 'active-button' : 'button']" flat small @click="toggleData = 5">
                        {{ $tc('charts.states.month-six', 2) }}
                    </button>
                    <button :class="[toggleData === 6 ? 'active-button' : 'button']" flat small @click="toggleData = 6">
                        {{ $tc('charts.states.year', 2) }}
                    </button>
                    <button :class="[toggleData === 7 ? 'active-button' : 'button']" flat small @click="toggleData = 7">
                        {{ $tc('charts.states.all', 2) }}
                    </button>
                </v-layout>
            </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <!--
        =====================================================================================
          Chart Body
        =====================================================================================
        -->
        <line-chart :chart-data="datacollection" :chart-options="chartOptions"></line-chart>
        <!--
        =====================================================================================
         Footnotes
        =====================================================================================
        -->
        <v-layout v-if="footnotes" align-center justify-end row fill-height pr-2> <app-footnotes :footnotes="footnotes" /> </v-layout>
    </v-card>
</template>

<script lang="ts">
import ChartJs from 'chart.js'
import LineChart from './LineChart.vue'
import AppFootnotes from '@app/core/components/ui/AppFootnotes.vue'
import AppInfoLoad from '@app/core/components/ui/AppInfoLoad.vue'
import { Footnote } from '@app/core/components/props'
import { ChartData, ChartOptions } from '@app/modules/charts/models'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

/*
===================================================================================
  Global Chart JS settings
===================================================================================
*/

/* Font */
ChartJs.defaults.global = Object.assign(ChartJs.defaults.global, {
    defaultFontFamily: "'Open Sans', 'sans-serif'",
    defaultFontStyle: '200'
})

/* Hide initial chart title */
ChartJs.defaults.global.title = Object.assign(ChartJs.defaults.global.title, {
    display: false
})

/* Tooltip box style */
ChartJs.defaults.global.tooltips = Object.assign(ChartJs.defaults.global.tooltips, {
    titleFontStyle: '400',
    backgroundColor: '#686868',
    mode: 'index',
    intersect: false
})

/* Hide legened */
ChartJs.defaults.global.legend = Object.assign(ChartJs.defaults.global.legend, {
    display: false
})

/* Chart layout paddings */
ChartJs.defaults.global.layout = Object.assign(ChartJs.defaults.global.layout, {
    padding: {
        top: 20,
        bottom: 10
    }
})

/* Data point style */
ChartJs.defaults.global.elements.point = Object.assign(ChartJs.defaults.global.elements.point, {
    hoverRadius: 6,
    borderWidth: 1,
    radius: 1
})

/* Show doughnut chart animation */
ChartJs.defaults.doughnut.animation = Object.assign(ChartJs.defaults.doughnut.animation, {
    animateRotate: true
})

/*
===================================================================================
  CONSTANTS
===================================================================================
*/

enum ChartType {
    line = 'line'
}
const MAX_ITEMS = 10

@Component({
    components: {
        AppFootnotes,
        AppInfoLoad,
        LineChart
        // AppError
    }
})
export default class Chart extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop({ type: String }) chartTitle!: string
    @Prop({ type: String }) chartDescription!: string
    @Prop({ type: Array }) footnotes?: Footnote[]
    @Prop({ type: Object, default: null }) datacollection!: ChartData
    @Prop({ type: Object }) chartOptions!: ChartOptions
    @Prop({ type: Boolean, default: true }) showTimeOptions!: boolean

    /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */

    /* Show Data fro the last 24 hours */
    toggleData = 0
    chart: ChartJs | null = null

    /* Temp Data */

    error = ''
    isLoading = true

    /*
  ===================================================================================
    Computed
  ===================================================================================
  */
    get chartClass(): string {
        const brkPoint = this.$vuetify.breakpoint.name
        switch (brkPoint) {
            case 'xs':
                return 'xs-chart'
            default:
                return ''
        }
    }
    /*
  ===================================================================================
    Watch Events
  ===================================================================================
  */

    // @Watch('toggleData')
    // onTogleDataChanged(newVal: number, oldVal: number): void {
    //     this.$emit('timeFrame', newVal)
    // }
}
</script>

<style scoped lang="css">
.active-button {
    background-color: #3965e8;
    color: white;
    width: 32px;
    margin: 10px;
    border-radius: 2px;
    padding: 5px;
}
.button {
    color: #8391a8;
    width: 32px;
    margin: 10px;
    padding: 2px;
}

.xs-chart {
    min-height: 280px;
}

.chart-caption {
    min-height: 3em;
}
</style>
