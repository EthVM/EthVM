#!/usr/bin/env node

import commander from 'commander'
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
  .option('-c, --count <count>', 'amount of random txs')
  .action(async options => {
    await invoke(() => randomTxsCommand(options.count || 10))
  })

commander
  .command('deploy [address]')
  .alias('d')
  .option('-c, --contract', 'contract type. Default to erc20')
  .action(async (address, options) => {
    address = address || '0xF15bCa2e1cb09718A9217a1e07693415C2032666'
    const type = options.contract || 'erc20'
    await invoke(() => deployContractCommand(address, type))
  })

commander
  .command('contract-address <txhash>')
  .alias('ca')
  .action(async txhash => {
    await invoke(() => getContractAddressCommand(txhash))
  })

commander
  .command('balance <address>')
  .alias('b')
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
  .command('exec [methodArgs...]')
  .alias('e')
  .option('-c, --contract-address <contractAddress>', 'contract address')
  .option('-f, --from-address <fromAddress>', 'from address')
  .option('-m, --method <method>', 'method to execute')
  .action(async (methodArgs, options) => {
    console.log('Method args', methodArgs)
    const { contractAddress, fromAddress, method } = options
    await invoke(() => contractExecCommand(contractAddress, fromAddress || '0xF15bCa2e1cb09718A9217a1e07693415C2032666', method, ...methodArgs))
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
