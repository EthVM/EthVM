/* tslint:disable:no-trailing-whitespace */
import {Injectable} from '@nestjs/common'
import {InjectEntityManager, InjectRepository} from '@nestjs/typeorm'
import {EntityManager, Repository} from 'typeorm'
import {ETH_ADDRESS} from '@app/shared/eth.service'
import BigNumber from 'bignumber.js'
import {BalanceEntity} from '@app/orm/entities/balance.entity'

@Injectable()
export class BalanceService {

  constructor(
    @InjectRepository(BalanceEntity) private readonly balanceRepository: Repository<BalanceEntity>,
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

    let sql = `
      WITH _balances as (
        SELECT 
          *,
          row_number() OVER (PARTITION BY address, contract_address ORDER BY block_number DESC) AS row_number
          FROM balance
          WHERE address IN (
    `
    const args: any[] = []
    let currArg = 1
    addresses.forEach((address) => {
      args.push(address)
      sql += `$${currArg},`
      currArg++
    })
    sql = sql.substring(0, sql.length - 1) // Remove trailing comma
    sql += ') AND '

    if (contracts.length) {
      // Replace "EthAddress" with empty string
      const ethAddressIdx = contracts.indexOf(ETH_ADDRESS)
      if (ethAddressIdx > -1) {
        contracts[ethAddressIdx] = ''
      }
      sql += 'contract_address IN ('
      contracts.forEach((contract) => {
        args.push(contract)
        sql += `$${currArg},`
        currArg++
      })
      sql = sql.substring(0, sql.length - 1) // Remove trailing comma
      sql += ') AND '
    }

    sql += `
        block_number <= $${currArg}
      )
      SELECT * FROM _balances
      WHERE row_number = 1
      OFFSET $${currArg + 1}
      LIMIT $${currArg + 2}
    `
    args.push(blockNumber.toNumber(), offset, limit + 1)

    const items = await this.entityManager.query(sql, args)

    const hasMore = items.length > limit
    if (hasMore) {
      items.pop()
    }

    return [items, hasMore]

  }
}
