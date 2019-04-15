import { EthTokensToCoingecko } from '@app/commands/eth-tokens-list-to-coingecko-ids'
import { Config } from '@app/config'
import program from 'commander'

const config = new Config()

program
  .version('1.0.0')
  .description('An utility for generating mappings between ETH Tokens Lists (https://github.com/MyEtherWallet/ethereum-lists) and CoinGecko IDs to be used by the Exchanges processor')

program
  .command('eth-tokens-to-coingecko-ids')
  .action(async cmd => {
    await EthTokensToCoingecko(config)
  })

program.parse(process.argv)
