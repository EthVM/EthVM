export interface ChartConfig {
  labels: any[]
  datasets: ChartDatasetConfig[]
}

export interface ChartDatasetConfig {
  label: string
  data: any[]
  yAxisID: string
  borderColor?: string
  backgroundColor?: string
  fill?: boolean
  type?: string
}

export interface ChartPoints {
  state: string
  points: any[]
  labels: any[]
}

export interface ChartData {
  label: string
  data: any[] // One array item for each dataset
}
