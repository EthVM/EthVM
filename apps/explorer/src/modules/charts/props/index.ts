export interface ChartData {
  labels: []
  datasets: [
    {
      label: string
      borderColor: string
      backgroundColor: string
      data: []
      yAxisID: string
      fill: boolean
    }
  ]
}
