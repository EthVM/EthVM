import { Config } from '@app/config'
import axios from 'axios'
import fs from 'fs'
import ora from 'ora'
import * as rax from 'retry-axios'

const spinner = ora()

rax.attach()

interface Token {
  symbol: string
  name: string
  address: string
}

interface Entry {
  address: string
  id: string
}

export async function EthTokensToCoingecko(config: Config) {
  spinner.info(`Fetching ETH Tokens from: ${config.ethTokensUrl}`)

  const tokens: Token[] = (await fetch<any[]>(config.ethTokensUrl)).map(t => {
    const { symbol, name, address } = t
    return { symbol, name, address }
  })

  spinner.info(`List of ETH Tokens correctly fetched!`)

  const sucessfuls: Entry[] = []
  const failures: Entry[] = []
  const chunked = chunk(tokens, 5)

  spinner.info(`${tokens.length} tokens to process! Number of chunks ${chunked.length}!`)

  let i = 0
  for (const batch of chunked) {
    await Promise.all(
      batch.map(token => {
        const { name, address } = token

        spinner.start(`Processing token ${name}`)

        return fetch<any>(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}`)
          .then(res => {
            const { id } = res
            sucessfuls.push({ id, address })
            spinner.succeed(`Processed sucessfully: ${name} - ${address}`)
          })
          .catch(err => {
            failures.push({ id: name, address })
            spinner.fail(`Failure to process: ${name} - ${address}. Status code: ${err.response.status}`)
          })
      })
    ).then(() => {
      spinner.info(`Processed chunk ${i} / ${chunked.length}`)
      i += 1
    })
  }

  await Promise.all([
    writeFile('./out/coingecko.json', JSON.stringify(sucessfuls, null, 2)),
    writeFile('./out/coingecko-failures.json', JSON.stringify(failures, null, 2))
  ])
    .then(() => {
      spinner.succeed(`Sucessfully wrote ETH Tokens to CoinGecko mappings file!`)
      spinner.info(`Summary - Sucessfuls: ${sucessfuls.length} / Failures: ${failures.length}`)
      process.exit(0)
    })
    .catch(err => {
      spinner.succeed(`Failure to write ETH Tokens to CoinGecko mappings file: ${err.response.status}`)
      process.exit(1)
    })
}

const fetch = async <T>(url: string): Promise<T> =>
  axios
    .get<T>(url, {
      raxConfig: {
        retry: 100,
        noResponseRetries: 3,
        retryDelay: 500,
        statusCodesToRetry: [[100, 199], [429, 429], [500, 599]],
        onRetryAttempt: err => spinner.info(`Status code: ${err.response.status} - Retrying request for URL: ${err.config.url}`)
      }
    } as rax.RaxConfig)
    .then(response => response.data)

const writeFile = (path, data, opts = 'utf8') => new Promise((resolve, reject) => fs.writeFile(path, data, opts, err => (err ? reject(err) : resolve())))

const chunk = (arr, size) => arr.reduce((chunks, el, i) => (i % size ? chunks[chunks.length - 1].push(el) : chunks.push([el])) && chunks, [])
