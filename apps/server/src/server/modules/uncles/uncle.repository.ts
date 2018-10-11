import { Uncle } from '@app/server/modules/uncles'
import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'

export interface UnclesRepository {
  getUncles(limit: number, page: number): Promise<Uncle[]>
  getUncle(hash: string): Promise<Uncle | null>
}

export class MongoUncleRepository extends BaseMongoDbRepository implements UnclesRepository {
  public getUncles(limit: number, page: number): Promise<Uncle[]> {
    return this.db
      .collection(MongoEthVM.collections.uncles)
      .find()
      .sort({ _id: -1 })
      .skip(page)
      .limit(limit)
      .toArray()
  }

  public getUncle(hash: string): Promise<Uncle | null> {
    return this.db
      .collection(MongoEthVM.collections.uncles)
      .findOne({ hash })
      .then(resp => {
        if (!resp) {
          return {}
        }
        return resp
      })
  }
}
