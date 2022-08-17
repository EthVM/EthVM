<template>
    <doughnut v-if="props.chartData" :chart-data="props.chartData" :chart-options="chartOptions" :height="130" />
</template>

<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, ChartData } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

/* Hide legened */
ChartJS.defaults.plugins.legend = Object.assign(ChartJS.defaults.plugins.legend, {
    display: false
})

interface PropType {
    chartData: ChartData<'doughnut'> | undefined
    loading: boolean
}
const props = defineProps<PropType>()

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    borderWidth: 0,
    cutout: 42
}
</script>
<style lang="scss"></style>
