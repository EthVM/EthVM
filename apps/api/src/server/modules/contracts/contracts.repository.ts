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
      .then(resp => resp ? resp : null)
  }

  public getContractsCreatedBy(hash: string, limit: number, page: number): Promise<Contract[]> {
    const start = page * limit
    return this.db
      .collection(MongoEthVM.collections.contracts)
      .find({ creator: hash })
      .skip(start)
      .limit(limit)
      .toArray()
      .then(resp => resp ? resp : [])
  }
}
