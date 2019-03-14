import { EthvmApi } from '@app/core/api'
import { Block, PendingTx, SimpleBlock, SimpleTx, Tx, Uncle } from '@app/core/models'
import { ApolloClient } from 'apollo-boost'
import {
  AddressBalance,
  AddressMetadata,
  BlockMetrics,
  Contract,
  ProcessingMetadata,
  Quote,
  Statistic,
  Token,
  TokenExchangeRate,
  TokenTransfer
} from 'ethvm-common'
import gql from 'graphql-tag'

export class EthvmApolloApi implements EthvmApi {
  constructor(private readonly apollo: ApolloClient<{}>) {}

  // ------------------------------------------------------------------------------------
  // Address
  // ------------------------------------------------------------------------------------

  public getAddressBalance(address: string): Promise<AddressBalance> {
    return this.apollo
      .query({
        query: gql`
          query balanceByHash(address: String!) {
            balanceByHash(hash: $address) {
              id
              address
              amount
            }
          }
        `,
        variables: {
          address: address.replace('0x', '')
        }
      })
      .then(res => res.data.accountMetadataByHash)
  }

  public getAddressMetadata(address: string): Promise<AddressMetadata> {
    return this.apollo
      .query({
        query: gql`
          query accountMetadataByHash(address: String!) {
            accountMetadataByHash(hash: $address) {
              id
              inTxCount
              isContractCreator
              isMiner
              outTxCount
              totalTxCount
            }
          }
        `,
        variables: {
          address: address.replace('0x', '')
        }
      })
      .then(res => res.data.accountMetadataByHash)
  }

  public getAddressAllTokensOwned(address: string): Promise<Token[]> {
    throw new Error('Method not implemented.')
  }

  public getAddressAmountTokensOwned(address: string): Promise<number> {
    throw new Error('Method not implemented.')
  }

  public getAddressTokenTransfers(address: string, limit: number, page: number): Promise<TokenTransfer[]> {
    throw new Error('Method not implemented.')
  }

  public getAddressTokenTransfersByHolder(address: string, holder: string, filter: string, limit: number, page: number): Promise<TokenTransfer[]> {
    throw new Error('Method not implemented.')
  }

  // ------------------------------------------------------------------------------------
  // Blocks
  // ------------------------------------------------------------------------------------

  public getBlock(hash: string): Promise<Block> {
    return this.apollo
      .query({
        query: gql`
          query block($hash: String) {
            blockByHash(hash: $hash) {
              header {
                number
                hash
                parentHash
                nonce
                sha3Uncles
                logsBloom
                transactionsRoot
                stateRoot
                receiptsRoot
                author
                difficulty
                extraData
                gasLimit
                gasUsed
                timestamp
                size
              }
              totalDifficulty
              transactions {
                blockHash
                blockNumber
                creates
                from
                gas
                gasPrice
                hash
                timestamp
                to
                transactionIndex
                value
                receipt {
                  contractAddress
                  gasUsed
                  status
                  traces {
                    error
                  }
                }
              }
              uncles {
                hash
              }
              rewards {
                author
                rewardType
                value
              }
            }
          }
        `,
        variables: {
          hash: hash.replace('0x', '')
        }
      })
      .then(res => new Block(res.data.blockByHash))
  }

  public getBlocks(format: string, limit: number, page: number, fromBlock: number): Promise<Block[] | SimpleBlock[]> {
    throw new Error('Method not implemented.')
  }

  public getBlockByNumber(no: number): Promise<Block> {
    return this.apollo
      .query({
        query: gql`
          query block($number: Int) {
            blockByNumber(number: $number) {
              header {
                number
                hash
                parentHash
                nonce
                sha3Uncles
                logsBloom
                transactionsRoot
                stateRoot
                receiptsRoot
                author
                difficulty
                extraData
                gasLimit
                gasUsed
                timestamp
                size
              }
              totalDifficulty
              transactions {
                blockHash
                blockNumber
                creates
                from
                gas
                gasPrice
                hash
                timestamp
                to
                transactionIndex
                value
                receipt {
                  contractAddress
                  gasUsed
                  status
                  traces {
                    error
                  }
                }
              }
              uncles {
                hash
              }
              rewards {
                author
                rewardType
                value
              }
            }
          }
        `,
        variables: {
          number: no
        }
      })
      .then(res => new Block(res.data.blockByNumber))
  }

  public getBlocksMinedOfAddress(address: string, limit: number, page: number): Promise<SimpleBlock[]> {
    return this.apollo
      .query({
        query: gql`
          query blocks($address: String, limit: $number, page: $number) {
            minedBlocksByAddress(address: $address, limit: $limit, page: $page) {
              header {
                hash
                number
                author
              }
              uncles {
                hash
              }
              rewards {
                rewardType
                value
              }
            }
          }
        `,
        variables: {
          address,
          limit,
          page
        }
      })
      .then(res => res.data.minedBlocksByAddress.map(raw => new SimpleBlock(raw)))
  }

  public getTotalNumberOfBlocks(): Promise<number> {
    return this.apollo
      .query({
        query: gql`totalNumberOfBlocks`
      })
      .then(res => res.data.totalNumberOfBlocks as number)
  }

  // ------------------------------------------------------------------------------------
  // Blocks Metrics
  // ------------------------------------------------------------------------------------

  public getBlockMetric(hash: string): Promise<BlockMetrics> {
    return this.apollo
      .query({
        query: gql`
          query blockMetric($hash: String) {
            blockMetricByHash(hash: $hash) {
              avgGasLimit
              avgGasPrice
              avgTxFees
              blockTime
              difficulty
              hash
              number
              numFailedTxs
              numPendingTxs
              numSuccessfulTxs
              numUncles
              timestamp
              totalDifficulty
              totalTxs
            }
          }
        `,
        variables: {
          hash: hash.replace('0x', '')
        }
      })
      .then(res => res.data.blockMetrics)
  }

  public getBlockMetrics(limit: number, page: number): Promise<BlockMetrics[]> {
    return this.apollo
      .query({
        query: gql`
          query blockMetrics($limit: Int, $page: Int) {
            blockMetrics(limit: $limit, page: $page) {
              avgGasLimit
              avgGasPrice
              avgTxFees
              blockTime
              difficulty
              hash
              number
              numFailedTxs
              numPendingTxs
              numSuccessfulTxs
              numUncles
              timestamp
              totalDifficulty
              totalTxs
            }
          }
        `,
        variables: {
          limit,
          page
        }
      })
      .then(res => res.data.blockMetrics)
  }

  // ------------------------------------------------------------------------------------
  // Contracts
  // ------------------------------------------------------------------------------------

  public getContract(address: string): Promise<Contract> {
    throw new Error('Method not implemented.')
  }

  public getContractsCreatedBy(address: string, limit: number, page: number): Promise<Contract[]> {
    throw new Error('Method not implemented.')
  }

  // ------------------------------------------------------------------------------------
  // Exchanges
  // ------------------------------------------------------------------------------------

  public getExchangeRateQuote(symbol: string, to: string): Promise<Quote> {
    throw new Error('Method not implemented.')
  }

  public getTokenExchangeRates(filter: string, limit: number, page: number): Promise<TokenExchangeRate[]> {
    throw new Error('Method not implemented.')
  }

  public getTotalNumberOfTokenExchangeRates(): Promise<number> {
    throw new Error('Method not implemented.')
  }

  public getTokenExchangeRateBySymbol(symbol: string): Promise<TokenExchangeRate> {
    throw new Error('Method not implemented.')
  }

  public getTokenExchangeRateByAddress(address: string): Promise<TokenExchangeRate> {
    throw new Error('Method not implemented.')
  }

  // ------------------------------------------------------------------------------------
  // Pending Txs
  // ------------------------------------------------------------------------------------

  public getPendingTxs(limit: number, page: number): Promise<PendingTx[]> {
    throw new Error('Method not implemented.')
  }

  public getPendingTxsOfAddress(address: string, filter: string, limit: number, page: number): Promise<PendingTx[]> {
    throw new Error('Method not implemented.')
  }

  public getNumberOfPendingTxsOfAddress(address: string): Promise<number> {
    throw new Error('Method not implemented.')
  }

  public getTotalNumberOfPendingTxs(): Promise<number> {
    throw new Error('Method not implemented.')
  }

  // ------------------------------------------------------------------------------------
  // Txs
  // ------------------------------------------------------------------------------------

  public getTx(hash: string): Promise<Tx> {
    return this.apollo
      .query({
        query: gql`
          query tx(hash: String) {
            tx(hash: $hash) {
              blockHash
              blockNumber
              creates
              from
              gas
              gasPrice
              hash
              input
              nonce
              r
              s
              timestamp
              to
              transactionIndex
              v
              value
              receipt {
                blockHash
                blockNumber
                contractAddress
                cumulativeGasUsed
                gasUsed
                logsBloom
                numInternalTxs
                root
                status
                transactionHash
                transactionIndex
                logs {
                  address
                  data
                  topics
                }
                traces {
                  blockHash
                  blockNumber
                  error
                  subtraces
                  traceAddress
                  transactionHash
                  transactionPosition
                  type
                  action
                  result {
                    address
                    code
                    gasUsed
                    output
                  }
                }
              }
            }
          }
        `,
        variables: {
          hash: hash.replace('0x', '')
        }
      })
      .then(res => new Tx(res.data.tx))
  }

  public getTxs(format: string, limit: number, order: string, fromBlock: number): Promise<Tx[] | SimpleTx[]> {
    throw new Error('Method not implemented.')
  }

  public getTxsOfAddress(hash: string, filter: string, limit: number, page: number): Promise<Tx[]> {
    return this.apollo
      .query({
        query: gql`
          query txsForAddress(hash: String!, filter: String, limit: Int, page: Int) {
            tx(hash: $hash, filter: $filter, limit: $limit, page: $page) {
              blockHash
              blockNumber
              creates
              from
              gas
              gasPrice
              hash
              input
              nonce
              r
              s
              timestamp
              to
              transactionIndex
              v
              value
              receipt {
                blockHash
                blockNumber
                contractAddress
                cumulativeGasUsed
                gasUsed
                logsBloom
                numInternalTxs
                root
                status
                transactionHash
                transactionIndex
                logs {
                  address
                  data
                  topics
                }
                traces {
                  blockHash
                  blockNumber
                  error
                  subtraces
                  traceAddress
                  transactionHash
                  transactionPosition
                  type
                  action
                  result {
                    address
                    code
                    gasUsed
                    output
                  }
                }
              }
            }
          }
        `,
        variables: {
          hash: hash ? hash.replace('0x', '') : '',
          filter,
          limit,
          page
        }
      })
      .then(res => res.data.txsForAddress.map(raw => new Tx(raw)))
  }

  public getTotalNumberOfTxs(): Promise<number> {
    return this.apollo
      .query({
        query: gql`totalNumberOfTransactions`
      })
      .then(res => res.data.totalNumberOfTransactions as number)
  }

  // ------------------------------------------------------------------------------------
  // Uncles
  // ------------------------------------------------------------------------------------

  public getUncle(hash: string): Promise<Uncle> {
    throw new Error('Method not implemented.')
  }

  public getUncles(limit: number, page: number, fromUncle: number): Promise<Uncle[]> {
    throw new Error('Method not implemented.')
  }

  public getTotalNumberOfUncles(): Promise<number> {
    throw new Error('Method not implemented.')
  }

  // ------------------------------------------------------------------------------------
  // Statistics
  // ------------------------------------------------------------------------------------

  public getAverageBlockTimeStats(duration: string): Promise<Statistic[]> {
    throw new Error('Method not implemented.')
  }

  public getAverageDifficultyStats(duration: string): Promise<Statistic[]> {
    throw new Error('Method not implemented.')
  }

  public getAverageGasLimitStats(duration: string): Promise<Statistic[]> {
    throw new Error('Method not implemented.')
  }

  public getAverageGasPriceStats(duration: string): Promise<Statistic[]> {
    throw new Error('Method not implemented.')
  }

  public getAverageHashRateStats(duration: string): Promise<Statistic[]> {
    throw new Error('Method not implemented.')
  }

  public getAverageMinerRewardsStats(duration: string): Promise<Statistic[]> {
    throw new Error('Method not implemented.')
  }

  public getAverageTxFeeStats(duration: string): Promise<Statistic[]> {
    throw new Error('Method not implemented.')
  }

  public getFailedTxStats(duration: string): Promise<Statistic[]> {
    throw new Error('Method not implemented.')
  }

  public getSuccessfulTxStats(duration: string): Promise<Statistic[]> {
    throw new Error('Method not implemented.')
  }

  // ------------------------------------------------------------------------------------
  // Search
  // ------------------------------------------------------------------------------------

  public search(hash: string): Promise<any> {
    throw new Error('Method not implemented.')
  }

  // ------------------------------------------------------------------------------------
  // Processing Metadata
  // ------------------------------------------------------------------------------------

  public getProcessingMetadata(id: string): Promise<ProcessingMetadata> {
    return this.apollo
      .query({
        query: gql`
          query processingMetadataById($id: String!) {
            processingMetadataById(id: $id) {
              id
            }
          }
        `,
        variables: {
          id
        }
      })
      .then(res => res.data.processingMetadataById)
  }
}
