import { Config } from '@app/config'
import { ConnectionFactory } from '@app/db'
import { EtherBalanceView } from '@app/db/entities/ether-balance.view'
import { Connection } from 'typeorm'
import Web3 from 'web3'
import { WebsocketProvider } from 'web3-providers'

export async function EtherBalances(config: Config) {
  const web3 = new Web3(new WebsocketProvider(config.web3.wsUrl))
  const connection = await ConnectionFactory(config)

  let offset = 0
  const limit = 200
  let [balances, count] = [[], 0]

  let success = 0
  let failed = 0

  do {
    ;[balances, count] = await fetchBalances(connection, offset, limit)

    const comparisons = balances.map(async actual => {
      const { address, amount } = actual
      const expected = await web3.eth.getBalance(actual.address)

      if (expected === amount) {
        success += 1
      } else {
        failed += 1
        console.error('Balance mismatch', address, expected, amount)
      }

      return expected
    })

    await Promise.all(comparisons)

    offset += limit

    console.log(`Success = ${success}, failed = ${failed}`)
  } while (offset < count)

  process.exit(0)
}

async function fetchBalances(connection: Connection, offset: number = 0, limit: number = 20): Promise<[EtherBalanceView[], number]> {
  return connection
    .getRepository(EtherBalanceView)
    .createQueryBuilder('balance')
    .orderBy('amount', 'DESC')
    .skip(offset)
    .take(limit)
    .getManyAndCount()
}
