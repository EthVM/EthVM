import { EtherBalances } from '@app/commands/ether-balances'
import { Config } from '@app/config'
import program from 'commander'

const config = new Config()

program.version('0.0.1').description('A utility for verifying the consistency and correctness of data within EthVM')

program.command('ether-balances').action(async () => {
  await EtherBalances(config)
})

program.parse(process.argv)
