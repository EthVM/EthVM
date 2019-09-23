/* tslint:disable:no-trailing-whitespace */
import {Injectable} from '@nestjs/common'
import {InjectEntityManager, InjectRepository} from '@nestjs/typeorm'
import {EntityManager, Repository} from 'typeorm'
import {ETH_ADDRESS} from '@app/shared/eth.service'
import BigNumber from 'bignumber.js'
import {BalanceEntity} from '@app/orm/entities/balance.entity'
import {RawBalanceEntity} from '@app/graphql/balances/dto/balance.dto';

@Injectable()
export class BalanceService {

  constructor(
    @InjectRepository(BalanceEntity) private readonly balanceRepository: Repository<BalanceEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
  }

  /**
   * Find a page of balances.
   * @param {string[]} addresses - Array of address hashes to filter balances by.
   * @param {BigNumber} blockNumber - Block number as of which to find balances (balance changes after this block number will be ignored).
   * @param {string[]} [contracts=[]] - Array of contract address hashes to filter balances by.
   * @param {number} [offset=0] - The number of items to skip.
   * @param {number} [limit=10] - The page size.
   * @returns {Promise<[RawBalanceEntity[], boolean]>} An array of raw balance entities and a boolean representing whether there are more items after these.
   */
  async find(
    addresses: string[],
    blockNumber: BigNumber,
    contracts: string[] = [],
    offset: number = 0,
    limit: number = 10,
  ): Promise<[RawBalanceEntity[], boolean]> {

    // TODO update to use query builder when TypeORM releases "with" functionality
    // see https://github.com/typeorm/typeorm/issues/1116

    // Use "with" clause to get only the latest balance entry for each address and contract address combination
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

    // Add addresses to args array and SQL statement.

    addresses.forEach((address) => {
      args.push(address)
      sql += `$${currArg},`
      currArg++
    })

    sql = sql.substring(0, sql.length - 1) // Remove trailing comma.
    sql += ') AND '

    // Add contract addresses to args array and SQL statement if applicable.

    if (contracts.length) {
      const ethAddressIdx = contracts.indexOf(ETH_ADDRESS)
      if (ethAddressIdx > -1) {
        // Remove "EthAddress" from contracts array and add OR clause with IS NULL.
        contracts.splice(ethAddressIdx, 1)

        if (contracts.length) {
          sql += '(contract_address IN ('
          contracts.forEach((contract) => {
            args.push(contract)
            sql += `$${currArg},`
            currArg++
          })
          sql = sql.substring(0, sql.length - 1) // Remove trailing comma.
          sql += ') OR contract_address IS NULL) AND '

        } else {
          // We're only querying the ether balance.
          sql += 'contract_address IS NULL AND '
        }

      } else {
        sql += 'contract_address IN ('
        contracts.forEach((contract) => {
          args.push(contract)
          sql += `$${currArg},`
          currArg++
        })
        sql = sql.substring(0, sql.length - 1) // Remove trailing comma.
        sql += ') AND '
      }
    }

    // Complete SQL statement and add all args to args array.

    sql += `
        block_number <= $${currArg}
      )
      SELECT * FROM _balances
      WHERE row_number = 1
      OFFSET $${currArg + 1}
      LIMIT $${currArg + 2}
    `
    args.push(blockNumber.toNumber(), offset, limit + 1) // Add one to the limit to determine if there are more items available.

    // Perform query
    const items = await this.entityManager.query(sql, args)

    // Determine whether more items were retrieved than the limit and if so remove the last item from the array and set hasMore to "true".
    const hasMore = items.length > limit
    if (hasMore) {
      items.pop()
    }

    return [items, hasMore]

  }
}
