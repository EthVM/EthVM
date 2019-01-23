import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'
import { Contract } from 'ethvm-common'

export interface ContractsRepository {
  getContract(hash: string): Promise<Contract | null>
  getContractsCreatedBy(hash: string, limit: number, page: number): Promise<Contract[]>
}

export class MongoContractsRepository extends BaseMongoDbRepository implements ContractsRepository {
  public getContract(hash: string): Promise<Contract | null> {
    return this.db
      .collection(MongoEthVM.collections.contracts)
      .findOne({ '_id': hash })
      .then(resp => {
        if (!resp) {
          return null
        }
        return resp
      })
  }

  public getContractsCreatedBy(hash: string, limit: number, page: number): Promise<Contract[]> {
    return this.db
      .collection(MongoEthVM.collections.contracts)
      .find({ creator: hash })
      .skip(page)
      .limit(limit)
      .toArray()
      .then(resp => {
        if (!resp) {
          return []
        }
        return resp
      })
  }
}
