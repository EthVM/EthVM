import { BlockMetrics } from '@app/core/models'

export const processBlockMetrics = (blockMetric: BlockMetrics, pastBlockMetrics: BlockMetrics[]): BlockMetrics[] => {
  pastBlockMetrics.unshift(blockMetric)
  return pastBlockMetrics
}
