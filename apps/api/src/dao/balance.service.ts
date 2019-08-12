import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DbConnection } from '@app/orm/config'
import { Repository } from 'typeorm'
import { BalanceEntity } from '@app/orm/entities/balance.entity'
import { ETH_ADDRESS } from '@app/shared/eth.service'

@Injectable()
export class BalanceService {

  constructor(@InjectRepository(BalanceEntity, DbConnection.Principal) private readonly balanceRepository: Repository<BalanceEntity>) {
  }

  async find(addresses: string[], contracts: string[] = [], offset: number = 0, limit: number = 10): Promise<[BalanceEntity[], boolean]> {

    const qb = this.balanceRepository.createQueryBuilder('b')
      .where('b.address IN (:...addresses)', { addresses })

    if (contracts.length) {
      // Replace "EthAddress" with empty string
      const ethAddressIdx = contracts.indexOf(ETH_ADDRESS)
      if (ethAddressIdx > -1) {
        contracts[ethAddressIdx] = ''
      }
      qb.andWhere('b.contract IN (:...contracts)', { contracts })
    }

    const items = await qb
      .orderBy('b.timestamp', 'DESC') // Add ordering to guarantee paging reliability
      .offset(offset)
      .limit(limit + 1)
      .getMany()

    const hasMore = items.length > limit
    if (hasMore) {
      items.pop()
    }

    return [items, hasMore]

  }
}
