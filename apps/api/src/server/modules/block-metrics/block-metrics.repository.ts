import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'
import { BlockStats } from "ethvm-common"
import { toBlockMetrics } from '@app/server/modules/block-metrics'

export interface BlockMetricsRepository {
  getBlockStat(hash: string): Promise<BlockStats | null>
  getBlockStats(limit: number, page: number): Promise<BlockStats[]>
}

export class MongoBlockMetricsRepository extends BaseMongoDbRepository implements BlockMetricsRepository {

  getBlockStat(hash: string): Promise<BlockStats | null> {
    return this.db
      .collection(MongoEthVM.collections.blockMetrics)
      .findOne({ hash })
      .then(resp => {
        if (!resp) {
          return null
        }
        return toBlockMetrics(resp)
      })
  }

  getBlockStats(limit: number, page: number): Promise<BlockStats[]> {
    const start = page * limit
    return this.db
      .collection(MongoEthVM.collections.blockMetrics)
      .find()
      .sort({ '_id': -1 })
      .skip(start)
      .limit(limit)
      .toArray()
      .then(resp => {
        const b: BlockStats[] = []
        if (!resp) {
          return b
        }
        resp.forEach(stat => b.unshift(toBlockMetrics(stat)))
        return b
      })
  }
}
