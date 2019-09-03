/* tslint:disable:no-trailing-whitespace */
import {Injectable} from '@nestjs/common'
import {InjectEntityManager, InjectRepository} from '@nestjs/typeorm'
import {Brackets, EntityManager, Repository} from 'typeorm'
import {ETH_ADDRESS} from '@app/shared/eth.service'
import BigNumber from 'bignumber.js'
import {BalanceEntity} from '@app/orm/entities/balance.entity'
import {LatestBalanceEntity} from '@app/orm/entities/latest-balance.entity';

@Injectable()
export class BalanceService {

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
  }

  async find(
    addresses: string[],
    blockNumber: BigNumber,
    contracts: string[] = [],
    offset: number = 0,
    limit: number = 10,
  ): Promise<[BalanceEntity[], boolean]> {

    const qb = this.entityManager.createQueryBuilder(LatestBalanceEntity, 'lb')
      .where('address IN (:...addresses)', { addresses })
      .andWhere('block_number <= :blockNumber', { blockNumber: blockNumber.toNumber() })

    if (contracts.length) {
      const ethAddressIdx = contracts.indexOf(ETH_ADDRESS)
      if (ethAddressIdx > -1) {
        // Remove "EthAddress" from contracts array and add OR clause with IS NULL
        contracts.splice(ethAddressIdx, 1)
        qb.andWhere(new Brackets(sqb => {
          sqb.where('contract_address IN (:...contracts)', { contracts })
            .orWhere('contract_address IS NULL')
        }))
      } else {
        qb.andWhere('contract_address IN :contracts', { contracts })
      }
    }

    const items = await qb
      .orderBy('block_number', 'DESC')
      .offset(offset)
      .limit(limit + 1)
      .cache(true) // TODO confirm if caching should be enabled here
      .getMany()

    const hasMore = items.length > limit
    if (hasMore) {
      items.pop()
    }

    return [items, hasMore]

  }
}
