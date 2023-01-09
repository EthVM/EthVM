<template>
    <doughnut v-if="props.chartData" :chart-data="props.chartData" :chart-options="chartOptions" style="position: relative" />
</template>

<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, ChartData, ChartOptions } from 'chart.js'
import { computed } from 'vue'
import { useTheme } from 'vuetify'
const theme = useTheme()

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

/* Hide legened */
ChartJS.defaults.plugins.legend = Object.assign(ChartJS.defaults.plugins.legend, {
    display: false
})
/* Tooltip */
// ChartJS.defaults.plugins.tooltip = Object.assign(ChartJS.defaults.plugins.legend, {

//     bodyColor: '#32a852'
// })

interface PropType {
    chartData: ChartData<'doughnut'> | undefined
    cutout: number
}
const props = defineProps<PropType>()

const chartOptions = computed<ChartOptions>(() => {
    return {
        responsive: true,
        maintainAspectRatio: false,
        borderWidth: 0,
        cutout: props.cutout,
        plugins: {
            tooltip: {
                bodyFont: {
                    size: 11
                },
                cornerRadius: 8,
                padding: 6,
                backgroundColor: theme.global.current.value.colors.darkSurface,
                bodyColor: theme.global.current.value.colors.surface
            }
        },
        layout: {
            padding: 12
        }
    }
})
</script>
<style lang="scss"></style>
