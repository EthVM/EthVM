import { Config } from '@app/config'
import { ConnectionFactory } from '@app/db'
import { EtherBalanceView } from '@app/db/entities/ether-balance.view'
import ora from 'ora'
import { Connection } from 'typeorm'
import Web3 from 'web3'
import { WebsocketProvider } from 'web3-providers'

export async function EtherBalances(config: Config, blockNumber?: number) {

  const spinner = ora('Checking ether balances').start();

  const web3 = new Web3(new WebsocketProvider(config.web3.wsUrl))
  const connection = await ConnectionFactory(config)

  let offset = 0
  const limit = 200
  let progress = 0

  let [balances, count] = [[], 0]

  let matched = 0
  const failures = []

  do {
    [balances, count] = await fetchBalances(connection, offset, limit)

    const comparisons = balances.map(async actual => {
      const { address, amount } = actual
      const expected = await web3.eth.getBalance(actual.address, blockNumber ? blockNumber : undefined)

      if (expected === amount) {
        matched += 1
      } else {
        failures.push(`${address}: \texpected = ${expected} \tactual = ${amount}`)
      }

      return expected
    })

    await Promise.all(comparisons)

    offset += limit
    progress += comparisons.length

    spinner.text = `Checking ether balances: matched = ${matched}, failed = ${failures.length}`

  } while (offset < count)

  if(failures.length > 0) {
    spinner.fail(`${failures.length} discrepancies found`)
    failures.forEach(failure => spinner.fail(failure))
    spinner.succeed(`${matched} matches`)
    process.exit(1)
  } else {
    spinner.succeed('No discrepancies found')
    process.exit(0)
  }

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
