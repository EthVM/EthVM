import { BlockMetrics } from 'ethvm-common'

const dedup = (blockMetric: BlockMetrics, pastBlockMetrics: BlockMetrics[]): BlockMetrics[] => {
  for (let i = 0; i < pastBlockMetrics.length; i++) {
    if (blockMetric.number === pastBlockMetrics[i].number) {
      pastBlockMetrics.splice(i, 1)
    }
  }
  return pastBlockMetrics
}

export const processBlockMetrics = (blockMetric: BlockMetrics, pastBlockMetrics: BlockMetrics[]): BlockMetrics[] => {
  const blocksMetrics = dedup(blockMetric, pastBlockMetrics)
  blocksMetrics.unshift(blockMetric)
  return blocksMetrics
}
