import { isValidHash } from '@app/server/core/utils'
import { BalancesRepository } from '@app/server/modules/balances'
import { BlocksRepository } from '@app/server/modules/blocks'
import { Search, SearchType } from '@app/server/modules/search'
import { TxsRepository } from '@app/server/modules/txs'
import { isValidAddress } from 'ethereumjs-util'

export interface SearchService {
  search(hash: string): Promise<Search>
}

export class SearchServiceImpl implements SearchService {
  constructor(
    private readonly txsRepository: TxsRepository,
    private readonly balancesRepository: BalancesRepository,
    private readonly blockRepository: BlocksRepository
  ) {}

  public search(hash: string): Promise<Search> {
    return new Promise(async (resolve, reject) => {
      const s: Search = { type: SearchType.None }
      let hashWth0x = ''
      hash.slice(0, 2) === '0x' ? (hashWth0x = hash.replace('0x', '')) : (hashWth0x = '0x' + hash)

      if (isValidAddress(hashWth0x)) {
        const address = await this.balancesRepository.getAddressBalance(hash)
        if (address != null) {
          s.address = address
          s.type = SearchType.Address
          return resolve(s)
        }
      }

      if (isValidHash(hash)) {
        const block = await this.blockRepository.getBlock(hash)
        if (block != null) {
          s.block = block
          s.type = SearchType.Block
          return resolve(s)
        }

        const tx = await this.txsRepository.getTx(hash)
        if (tx != null) {
          s.tx = tx
          s.type = SearchType.Transaction
          return resolve(s)
        }
      }

      return resolve(s)
    })
  }
}
