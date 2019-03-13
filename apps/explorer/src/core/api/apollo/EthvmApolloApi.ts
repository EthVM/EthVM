import { EthvmApi, GraphQLQueries } from '@app/core/api'
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
    throw new Error('Method not implemented.')
  }

  public getAddressMetadata(address: string): Promise<AddressMetadata> {
    throw new Error('Method not implemented.')
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
            block(hash: $hash) {
              header {
                number
                hash
                parentHash
                nonce
                sha3Uncles
                logsBloom
                # transactionsRoot
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
            }
          }
        `,
        variables: {
          hash: hash.replace('0x', '')
        }
      })
      .then(res => new Block(res.data))
  }

  public getBlocks(format: string, limit: number, page: number, fromBlock: number): Promise<Block[] | SimpleBlock[]> {
    throw new Error('Method not implemented.')
  }

  public getBlockByNumber(no: number): Promise<Block> {
    throw new Error('Method not implemented.')
  }

  public getBlocksMinedOfAddress(address: string, limit: number, page: number): Promise<Block[]> {
    throw new Error('Method not implemented.')
  }

  public getTotalNumberOfBlocks(): Promise<number> {
    throw new Error('Method not implemented.')
  }

  // ------------------------------------------------------------------------------------
  // Blocks Metrics
  // ------------------------------------------------------------------------------------

  public getBlockMetric(hash: string): Promise<BlockMetrics> {
    throw new Error('Method not implemented.')
  }

  public getBlockMetrics(limit: number, page: number): Promise<BlockMetrics[]> {
    throw new Error('Method not implemented.')
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
    throw new Error('Method not implemented.')
  }

  public getTxs(format: string, limit: number, order: string, fromBlock: number): Promise<Tx[] | SimpleTx[]> {
    throw new Error('Method not implemented.')
  }

  public getTxsOfBlock(hash: string): Promise<Tx[]> {
    throw new Error('Method not implemented.')
  }

  public getTxsOfAddress(hash: string, filter: string, limit: number, page: number): Promise<Tx[]> {
    throw new Error('Method not implemented.')
  }

  public getTotalNumberOfTxs(): Promise<number> {
    throw new Error('Method not implemented.')
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
    throw new Error('Method not implemented.')
  }

  // ------------------------------------------------------------------------------------
  // Private Methods
  // ------------------------------------------------------------------------------------
}
