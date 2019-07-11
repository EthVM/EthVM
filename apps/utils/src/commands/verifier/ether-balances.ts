import { Config } from '@app/config'
import { EtherBalanceView } from '@app/db/entities/ether-balance.view'
import Web3 from 'web3'
import { WebsocketProvider } from 'web3-providers'

import { Pool } from 'pg'
import Cursor from 'pg-cursor'

export async function EtherBalances(config: Config, blockNumber?: number) {

  // const spinner = ora('Checking ether balances').start();

  const web3 = new Web3(new WebsocketProvider(config.web3.wsUrl))

  const { host, port, username: user, password, database } = config.postgres

  const pool = new Pool({
    host,
    port,
    user,
    password,
    database,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  })

  const client = await pool.connect()

  let offset = 0
  const limit = 1024
  let progress = 0

  let balances = []
  let matched = 0
  let failed = 0
  const hasSpaces = []
  const failures = []

  const cursor = client.query(new Cursor('SELECT address, amount FROM canonical_ether_balance', []))

  do {

    balances = await fetchBalances(cursor, limit)

    const comparisons = balances.map(async ethvmBalance => {

      const { address, amount: ethvmAmount } = ethvmBalance

      const trimmedAddress = ethvmBalance.address.trim()

      if(trimmedAddress.length !== ethvmBalance.address.length) {
        console.error(`Address '${ethvmBalance.address}' has spaces`)
      } else {

        const parityAmount = await web3.eth.getBalance(ethvmBalance.address, blockNumber ? blockNumber : undefined)

        if (parityAmount === ethvmAmount) {
          matched += 1
        } else {
          console.error(`Failure => ${address}, \tparity = ${parityAmount} \tethvm = ${ethvmAmount}`)
          failed += 1
        }

        return parityAmount
      }

    })

    await Promise.all(comparisons)

    offset += limit
    progress += comparisons.length

    console.log(`Checking ether balances: matched = ${matched}, failed = ${failed}, has spaces = ${hasSpaces.length}`)

  } while (balances.length)

  if(failures.length > 0) {
    console.error(`${matched} matches, ${failed} discrepancies found, ${hasSpaces.length} addresses had spaces`)
    process.exit(1)
  } else {
    console.log(`No discrepancies found, ${matched} matches in total`)
    process.exit(0)
  }

}

async function fetchBalances(cursor: Cursor, size: number): Promise<EtherBalanceView[]> {

  return new Promise((resolve, error) => {

    cursor.read(size, (err, rows) => {

      if(err) return error(err)

      const entities = rows.map(r => {
        const result = new EtherBalanceView()
        result.address = r.address
        result.amount = r.amount
        return result
      })

      return resolve(entities)

    })

  })

}
