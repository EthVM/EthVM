import { Erc20Balances, EtherBalances, EthTokensToCoingecko } from '@app/commands'
import { Config } from '@app/config'
import program from 'commander'

const config = new Config()

program
  .version('1.0.0')

program
  .command('ether-balances')
  .option('-b, --block [block]', 'Block number to use when requesting ether balances from web3')
  .action(async cmd => EtherBalances(config, cmd.block))

program
  .command('erc20-balances')
  .action(async () => Erc20Balances(config))

program
  .command('eth-tokens-to-coingecko-ids')
  .action(async () => EthTokensToCoingecko(config.tokens))

program.parse(process.argv)
