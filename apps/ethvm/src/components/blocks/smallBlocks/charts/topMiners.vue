<template>
    <div id="top-miners-chart" class="line-chart">
        <vue-chart type="doughnut" :data="chartData" :options="chartOptions" :redraw="redraw" :chartTitle="newTitle" :chartDescription="newDescription" unfilled="true"></vue-chart>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BN from 'bignumber.js'
import ethUnits from 'ethereumjs-units'

/* Time Variables: */
const STATES = {
  BEGIN: 'beginning',
  YEAR: 'year',
  MONTH: 'month',
  DAY: 'day'
}
const DES = {
  BEGIN: 'Top 5 Miners in Ethereum blockchain since the ',
  OTHER: 'Top 5 Miners in Ethereum blockchain in last '
}
const currentState = STATES.DAY
const stateChanged = false

/* Chart Details: */
const title = 'Top Miners'
let description = DES.OTHER + currentState
const newData = {
  datasets: [
    {
      label: 'Top Miners',
      data: [5, 4, 3, 2, 1],
      backgroundColor: ['#20c0c7', '#f9967b', '#7c76fc', '#2779ff', 'yellow']
    }
  ],
  labels: ['Miner1', 'Miner2', 'Miner3', 'Miner4', 'Miner5']
}

const pieOptions = {
  title: {
    text: 'Top Miners',
    lineHeight: 1
  },
  responsive: true,
  legend: {
    display: true,
    position: 'left'
  },
  cutoutPercentage: 40
}

export default Vue.extend({
  name: 'Chart',
  data: () => ({
    chartData: newData,
    chartOptions: pieOptions,
    redraw: false,
    newTitle: title,
    newDescription: description
  }),

  computed: {
    /*Method to change description string: */
    changeDescription() {
      if (stateChanged && currentState == STATES.BEGIN) {
        description = DES.BEGIN + currentState
      } else if (stateChanged && currentState != STATES.BEGIN) {
        description = DES.OTHER + currentState
      }
    }
  },
  mounted: function() {}
})
</script>
