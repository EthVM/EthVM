import { BlockMetricsRepository } from '@app/server/modules/block-metrics'
import { BlockStats } from 'ethvm-common'

export interface BlockMetricsService {
  getBlockStat(hash: string): Promise<BlockStats | null>
  getBlockStats(limit: number, page: number): Promise<BlockStats[]>
}

export class BlockMetricsRepositoryImpl implements BlockMetricsService {

  constructor(private readonly blockStatsRepository: BlockMetricsRepository) {}

  public getBlockStat(hash: string): Promise<BlockStats | null> {
    return this.blockStatsRepository.getBlockStat(hash)
  }

  public getBlockStats(limit: number, page: number): Promise<BlockStats[]> {
    return this.blockStatsRepository.getBlockStats(limit, page)
  }
}
