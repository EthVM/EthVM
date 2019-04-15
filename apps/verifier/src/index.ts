import { EtherBalances } from '@app/commands/ether-balances'
import { Config } from '@app/config'
import program from 'commander'
import { Erc20Balances } from '@app/commands/erc20-balances'

const config = new Config()

program.version('0.0.1').description('A utility for verifying the consistency and correctness of data within EthVM')

program
  .command('ether-balances')
  .option('-b, --block [block]', 'Block number to use when requesting ether balances from web3')
  .action(async (cmd) => {
    await EtherBalances(config, cmd.block)
  })

program
  .command('erc20-balances')
  .action(async () => {
    await Erc20Balances(config)
  })

program.parse(process.argv)
