<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { Line, mixins as chartMixins } from 'vue-chartjs'
import { ChartData, ChartOptions } from '@app/modules/charts/models'

@Component
export default class LineChart extends Mixins(Line, chartMixins.reactiveProp) {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop({ type: Object, default: null }) chartData!: ChartData
    @Prop({ type: Object }) chartOptions?: ChartOptions

    /*
    ===================================================================================
      Initial Data - For content loading
    ===================================================================================
    */

    dataLoading: ChartData = {
        labels: [1, 2, 3, 4, 5, 6, 7],
        datasets: [
            {
                data: [60, 55, 32, 12, 1, 13, 50],
                label: 'Loading',
                backgroundColor: 'rgba(118, 221, 251, 0.2)',
                borderColor: '#53a8e2',
                borderWidth: 1.2
            },
            {
                data: [25, 46, 14, 49, 40, 55, 75],
                label: 'Loading',
                backgroundColor: 'rgba(118, 221, 251, 0.2)',
                borderColor: '#2c82be',
                borderWidth: 1.2
            }
        ]
    }
    optionsLoading: ChartOptions = {
        responsive: true,
        tooltips: {
            enabled: false,
            label: '#fcba03'
        },
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true
                    }
                }
            ]
        }
    }

    /*
    ===================================================================================
     Lifecycle
    ===================================================================================
    */

    mounted() {
        if (!this.chartData) {
            this.renderChart(this.dataLoading, this.optionsLoading)
        } else {
            this.renderChart(this.chartData, this.chartOptions)
        }
    }
    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    get isLoading(): boolean {
        return this.chartData === null
    }
    /*
    ===================================================================================
      Watch
    ===================================================================================
    */
    @Watch('isLoading')
    onIsLoadingChanged(newVal: boolean, oldVal: boolean): void {
        if (!newVal && newVal !== oldVal) {
            this.renderChart(this.chartData, this.chartOptions)
        }
    }

    @Watch('chartOptions')
    onChartOptionsChanged(newVal: boolean, oldVal: boolean): void {
        this.renderChart(this.chartData, this.chartOptions)
    }
}
</script>
