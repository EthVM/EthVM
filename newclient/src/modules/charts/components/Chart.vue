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
         Footnotes
        =====================================================================================
        -->
        <v-layout v-if="footnotes" align-center justify-end row fill-height pb-3 pt-2> <app-footnotes :footnotes="footnotes" /> </v-layout>
        <app-info-load v-show="isLoading" />
        <!--
        =====================================================================================
          Chart Body
        =====================================================================================
        -->
        <div v-show="!(isLoading || hasError)">
            <!-- <canvas v-if="!showTimeOptions" ref="chart" :class="chartClass" />
            <canvas v-else ref="chart" /> -->
            <line-chart :chart-data="datacollection" :chart-options="chartOptions"></line-chart>
        </div>
        <!--
        =====================================================================================
          Error Message
        =====================================================================================
        -->
        <!-- <app-error :has-error="hasError" :message="error" class="mb-4" /> -->
    </v-card>
</template>

<script lang="ts">
import ChartJs from 'chart.js'
import LineChart from './LineChart.vue'
import AppFootnotes from '@app/core/components/ui/AppFootnotes.vue'
import AppInfoLoad from '@app/core/components/ui/AppInfoLoad.vue'
import { Footnote } from '@app/core/components/props'
// import { ChartConfig, ChartData, ChartOptions } from '@app/modules/charts/models'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { ChartData, ChartOptions } from 'chart.js'
// import { ChartOptions } from '../models'

// import AppError from '@app/core/components/ui/AppError.vue'

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
    radius: 2
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

    /* Chart Data Type: live / static; static by default */
    // @Prop({ type: Boolean, default: false }) showTimeOptions!: boolean

    /* Max number of Data points to display, 10 by default  */

    /* Chart title, description, footnotes */
    // @Prop({ type: String }) chartTitle!: string
    // @Prop({ type: String }) chartDescription!: string
    @Prop({ type: Array }) footnotes?: Footnote[]

    /* Chart options and data */
    // @Prop({ type: Boolean, default: true }) isLoading!: boolean
    // @Prop({ type: Array, required: true }) chartData!: ChartData[]

    /* Old */
    // @Prop({ type: Boolean }) redraw!: boolean
    // @Prop({ type: String }) error!: string
    // @Prop({ type: String, default: 'leftToRight' }) direction!: 'leftToRight' | 'rightToLeft'
    // @Prop({ type: String, required: true }) type!: string
    // @Prop({ type: Object, required: true }) config!: ChartConfig
    // @Prop({ type: Object }) options!: object

    /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */

    /* Show Data fro the last 24 hours */
    toggleData = 0
    chart: ChartJs | null = null

    /* Temp Data */
    chartTitle = 'I am a title'
    chartDescription = ' I am a description'
    error = ''
    datacollection: ChartData | null = null
    chartOptions: ChartOptions | null = null
    isLoading = true
    showTimeOptions = false
    /* Not needed */
    type = ChartType.line
    /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */
    mounted() {
        // this.fillData()
        this.isLoading = false
    }
    /* Old *
    // created() {
    //     if (!this.showTimeOptions) {
    //         this.$emit('timeFrame', this.toggleData)
    //     }
    // }

    // mounted() {
    //     if (this.config && this.chartData && this.chartData.length) {
    //         this.createChart()
    //     }
    // }

    // beforeDestroy() {
    //     if (this.chart) {
    //         this.chart.destroy()
    //     }
    // }
    /*
  ===================================================================================
    Computed
  ===================================================================================
  */
    get labels(): string {
        return 'hello'
    }
    get chartClass(): string {
        const brkPoint = this.$vuetify.breakpoint.name
        switch (brkPoint) {
            case 'xs':
                return 'xs-chart'
            default:
                return ''
        }
    }

    get hasError(): boolean {
        return this.error !== ''
    }
    /*
  ===================================================================================
    Watch Events
  ===================================================================================
  */

    // @Watch('chartData')
    // onchartDataChanged(): void {
    //     if (this.redraw) {
    //         if (this.chart) {
    //             this.chart.destroy()
    //         }
    //         this.createChart()
    //     } else if (!this.chart && this.config && this.chartData && this.chartData.length) {
    //         this.createChart() // Create chart if not created in mounted hook
    //     }
    // }

    // @Watch('toggleData')
    // onTogleDataChanged(newVal: number, oldVal: number): void {
    //     this.$emit('timeFrame', newVal)
    // }

    /*
  ===================================================================================
    Methods
  ===================================================================================
  */
    // fillData() {
    //     this.datacollection = {
    //         // labels: ['hello', 'good day'],
    //         // datasets: [
    //         //     {
    //         //         label: 'Data One',
    //         //         data: [this.getRandomInt(), this.getRandomInt()],
    //         //         borderColor: [
    //         //             'rgba(255, 99, 132, 1)',
    //         //             'rgba(54, 162, 235, 1)',
    //         //             'rgba(255, 206, 86, 1)',
    //         //             'rgba(75, 192, 192, 1)',
    //         //             'rgba(153, 102, 255, 1)',
    //         //             'rgba(255, 159, 64, 1)'
    //         //         ]
    //         //     }
    //         //     // {
    //         //     //     label: 'Data One',
    //         //     //     backgroundColor: '‎#008000',
    //         //     //     data: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt()]
    //         //     // }
    //         // ]
    //         labels: [`${this.$t('message.load')}`],
    //         datasets: [
    //             {
    //                 label: '# of Votes',
    //                 data: [12, 19, 3, 5, 2, 3],
    //                 backgroundColor: [
    //                     'rgba(255, 99, 132, 0.2)',
    //                     'rgba(54, 162, 235, 0.2)',
    //                     'rgba(255, 206, 86, 0.2)',
    //                     'rgba(75, 192, 192, 0.2)',
    //                     'rgba(153, 102, 255, 0.2)',
    //                     'rgba(255, 159, 64, 0.2)'
    //                 ],
    //                 borderColor: 'primary',
    //                 borderWidth: 1
    //             }
    //         ]
    //     }
    // }
    getRandomInt() {
        return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    }

    // createChart() {
    //     const { config, chartData } = this

    //     // clear previous state
    //     config.labels = []
    //     config.datasets.forEach(dataset => {
    //         dataset.data = []
    //     })

    //     // Add new data
    //     chartData.forEach(item => {
    //         config.labels.push(item.label)
    //         config.datasets.forEach((dataset, index) => {
    //             dataset.data.push(item.data[index])
    //         })
    //     })

    //     this.chart = new ChartJs(this.$refs.chart, {
    //         type: this.type,
    //         data: config,
    //         options: this.options
    //     })
    // }

    // redrawChart() {
    //     if (this.chart) {
    //         this.chart.destroy()
    //     }
    //     this.createChart()
    // }

    // updateChartData(newVal: ChartData) {
    //     // Check for fork by comparing labels to see if this chart point already exists in the chart
    //     const prevIdx = this.chart.data.labels.indexOf(newVal.label)
    //     if (prevIdx > -1) {
    //         // Swap this item for the previous one
    //         this.chart.data.labels[prevIdx] = newVal.label
    //         this.chart.data.datasets.forEach((dataset, index) => {
    //             dataset.data[prevIdx] = newVal.data[index]
    //         })
    //         return
    //     }

    // // Remove last item
    // if (this.chart.data.datasets[0].data.length >= MAX_ITEMS) {
    //     reverse ? this.chart.data.labels.pop() : this.chart.data.labels.shift()
    //     this.chart.data.datasets.forEach(dataset => {
    //         reverse ? dataset.data.pop() : dataset.data.shift()
    //     })
    // }

    // // Add new item
    // reverse ? this.chart.data.labels.unshift(newVal.label) : this.chart.data.labels.push(newVal.label)
    // this.chart.data.datasets.forEach((dataset, index) => {
    //     reverse ? dataset.data.unshift(newVal.data[index]) : dataset.data.push(newVal.data[index])
    // })

    //     this.chart.update()
    // }

    // updatechartData(newVal) {
    //     // Check for fork and update data in place if necessary
    //     const prevIdx = this.chartData.findIndex(initial => initial.label === newVal.label)
    //     if (prevIdx > -1) {
    //         this.chartData[prevIdx] = newVal
    //         return
    //     }

    //     if (this.chartData && this.chartData.length >= MAX_ITEMS) {
    //         this.chartData.pop()
    //     }
    //     this.chartData.unshift(newVal)
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
