import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'
import { Contract } from 'ethvm-common'

export interface ContractsRepository {
  getContract(hash: string): Promise<Contract | null>
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

}
