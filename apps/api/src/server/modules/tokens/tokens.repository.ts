import { toTokenTransfer } from '@app/server/modules/tokens'
import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'
import { TokenTransfer } from 'ethvm-common'

export interface TokensRepository {
  getAddressTokenTransfers(address: string, limit: number, page: number): Promise<TokenTransfer[]>
  getAddressTokenTransfersByHolder(address: string, holder: string, filter: string, limit: number, page: number): Promise<TokenTransfer[]>
}

export class MongoTokensRepository extends BaseMongoDbRepository implements TokensRepository {

  public getAddressTokenTransfers(address: string, limit: number, page: number): Promise<TokenTransfer[]> {
    const start = page * limit
    return this.db
      .collection(MongoEthVM.collections.tokenTransfers)
      .find({ contract: address, transferType: { $not: { $eq: 'ETHER' } } })
      .sort({ timestamp: -1 })
      .skip(start)
      .limit(limit)
      .toArray()
      .then(resp => {
        const t: TokenTransfer[] = []
        if (!resp) {
          return t
        }
        resp.forEach(tx => t.unshift(toTokenTransfer(tx)))
        return t
      })
  }

  public getAddressTokenTransfersByHolder(address: string, holder: string, filter: string, limit: number, page: number): Promise<any[]> {
    const start = page * limit
    let find
    switch (filter) {
      case 'in':
        find = { contract: address, transferType: { $not: { $eq: 'ETHER' } }, from: holder }
        break
      case 'out':
        find = { contract: address, transferType: { $not: { $eq: 'ETHER' } }, to: holder }
        break
      default:
        find = { contract: address, transferType: { $not: { $eq: 'ETHER' } }, $or: [{ from: holder }, { to: holder }] }
        break
    }

    return this.db
      .collection(MongoEthVM.collections.tokenTransfers)
      .find(find)
      .sort({ timestamp: -1 })
      .skip(start)
      .limit(limit)
      .toArray()
      .then(resp => {
        const t: TokenTransfer[] = []
        if (!resp) {
          return t
        }
        resp.forEach(tx => t.unshift(toTokenTransfer(tx)))
        return t
      })
  }
}
