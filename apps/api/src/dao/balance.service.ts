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

  async findAndCount(addresses: string[], contracts: string[] = [], offset: number = 0, limit: number = 10): Promise<[BalanceEntity[], number]> {

    const qb = this.balanceRepository.createQueryBuilder('b')
      .where('b.address IN (:...addresses)', { addresses })

    if (contracts.length) {
      // Replace "EthAddress" with 42 spaces TODO change to empty string when DB updated
      const ethAddressIdx = contracts.indexOf(ETH_ADDRESS)
      if (ethAddressIdx > -1) {
        contracts[ethAddressIdx] = ''
      }
      qb.andWhere('b.contract IN (:...contracts)', { contracts })
    }

    const count = await qb.getCount()

    const items = await qb
      .orderBy('b.timestamp', 'DESC') // Add ordering to guarantee paging reliability
      .offset(offset)
      .limit(limit)
      .getMany()

    return [items, count]

  }
}
