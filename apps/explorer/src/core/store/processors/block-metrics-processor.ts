import { BlockMetrics } from 'ethvm-common'

export const processBlockMetrics = (blockMetric: BlockMetrics, pastBlockMetrics: BlockMetrics[]): BlockMetrics[] => {
  pastBlockMetrics.unshift(blockMetric)
  return pastBlockMetrics
}
