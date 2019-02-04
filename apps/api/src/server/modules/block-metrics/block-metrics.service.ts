import { BlockMetricsRepository } from '@app/server/modules/block-metrics'
import { BlockMetrics } from 'ethvm-common'

export interface BlockMetricsService {
  getBlockMetric(hash: string): Promise<BlockMetrics | null>
  getBlockMetrics(limit: number, page: number): Promise<BlockMetrics[]>
}

export class BlockMetricsServiceImpl implements BlockMetricsService {

  constructor(private readonly blockMetricsRepository: BlockMetricsRepository) {}

  public getBlockMetric(hash: string): Promise<BlockMetrics | null> {
    return this.blockMetricsRepository.getBlockMetric(hash)
  }

  public getBlockMetrics(limit: number, page: number): Promise<BlockMetrics[]> {
    return this.blockMetricsRepository.getBlockMetrics(limit, page)
  }
}
