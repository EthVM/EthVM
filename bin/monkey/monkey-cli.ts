#!/usr/bin/env node

import commander from 'commander'
import accounts from './accounts.json'
import {
  contractExecCommand,
  deployContractCommand,
  getBalanceCommand,
  getContractAddressCommand,
  randomTxsCommand,
  waitForConfirmationCommand
} from './commands'
import { ora } from './shared'

const version = '1.0.0'

commander.description('Ethereum utility that helps to create random txs to aid in development').version(version, '-v, --version')

commander
  .command('random')
  .alias('r')
  .description('Generates a fixed amount of random txs (regular ones, not internal ones produced by smart contracts)')
  .option('-n, --number <count>', 'Amount of random txs')
  .action(async options => {
    await invoke(() => randomTxsCommand(options.count || 10))
  })

commander
  .command('deploy')
  .alias('d')
  .description('Deploys a new contract (possible values are specified in contracts.json file)')
  .option('-a, --address [address]', 'Specifies which address will deploy the contract', accounts.main.address)
  .option('-c, --contract [contract]', 'Contract type to deploy', /^(erc20|traceropcodes)$/i, 'erc20')
  .action(async options => {
    const address = options.address
    const type = options.contract
    ora.succeed(`Deploying contract: '${type}' with address: '${address}'`)
    await invoke(() => deployContractCommand(address, type))
  })

commander
  .command('contract-address <txhash>')
  .alias('ca')
  .description('Obtains the contract address for the specified <txhash> (if any)')
  .action(async txhash => {
    await invoke(() => getContractAddressCommand(txhash))
  })

commander
  .command('balance <address>')
  .alias('b')
  .description('Obtains the balance for the given <address> (if any)')
  .action(async address => {
    await invoke(() => getBalanceCommand(address))
  })

commander
  .command('confirm <txhash>')
  .alias('cf')
  .action(async (txhash: string) => {
    await invoke(() => waitForConfirmationCommand(txhash))
  })

commander
  .command('exec [contractAddress] [method] [methodArgs...]')
  .alias('e')
  .description("Executes the specified smart contract method (no input validation, so make sure you're passing correctly arguments")
  .option('-f, --from-address <fromAddress>', 'from address', accounts.main.address)
  .action(async (contractAddress, method, methodArgs, options) => {
    if (!contractAddress || !method) {
      ora.fail(`Please provide correctly [contractAddress] and [method]`)
      process.exit(1)
    }
    const { fromAddress } = options
    await invoke(() => contractExecCommand(contractAddress, fromAddress, method, ...(methodArgs || [])))
  })

async function invoke(fn: () => void) {
  try {
    await fn()
    process.exit(0)
  } catch (e) {
    ora.fail(e.message)
    process.exit(1)
  }
}

commander.parse(process.argv)
