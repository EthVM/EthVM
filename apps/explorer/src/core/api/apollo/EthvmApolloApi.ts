import { EthvmApi } from '@app/core/api'
import {
  accountByAddress,
  addressAllTokensOwned,
  addressAmountTokensOwned,
  internalTransactionsByAddress
} from '@app/core/api/apollo/queries/addresses.graphql'
import { blockMetricByHash, blockMetrics } from '@app/core/api/apollo/queries/block-metrics.graphql'
import { blockByHash, blockByNumber, blocks, minedBlocksByAddress, totalNumberOfBlocks } from '@app/core/api/apollo/queries/blocks.graphql'
import { contractByAddress, contractsCreatedBy } from '@app/core/api/apollo/queries/contracts.graphql'
import { search } from '@app/core/api/apollo/queries/search.graphql'
import {
  averageBlockTime,
  averageDifficulty,
  averageGasLimit,
  averageGasPrice,
  averageHashRate,
  averageMinerReward,
  averageTxFee,
  totalFailedTxs,
  totalSuccessfulTxs
} from '@app/core/api/apollo/queries/statistics.graphql'
import { newBlockMetrics, newSimpleBlocks, newSimpleTxs } from '@app/core/api/apollo/queries/subscriptions.graphql'
import {
  holderDetails,
  tokenHolders,
  tokenTransfersByContractAddress,
  tokenTransfersByContractAddressForHolder,
  coinExchangeRate,
  tokenExchangeRateByAddress,
  tokenExchangeRateBySymbol,
  tokenExchangeRates,
  totalNumTokenExchangeRates
} from '@app/core/api/apollo/queries/tokens.graphql'
import { totalNumberOfTransactions, tx, txs, txsForAddress } from '@app/core/api/apollo/queries/txs.graphql'
import { totalNumberOfUncles, uncleByHash, uncles } from '@app/core/api/apollo/queries/uncles.graphql'
import {
  Account,
  Block,
  BlockMetrics,
  Contract,
  PendingTx,
  SimpleBlock,
  SimpleTx,
  Statistic,
  Token,
  TokenExchangeRate,
  TokenTransfer,
  Transfer,
  Tx,
  Uncle,
  CoinExchangeRate
} from '@app/core/models'
import { ApolloClient } from 'apollo-client'
import { Observable } from 'apollo-client/util/Observable'

export class EthvmApolloApi implements EthvmApi {
  constructor(private readonly apollo: ApolloClient<{}>) {}

  // ------------------------------------------------------------------------------------
  // Address
  // ------------------------------------------------------------------------------------

  public getAccount(address: string): Promise<Account | null> {
    return this.apollo
      .query({
        query: accountByAddress,
        variables: {
          address
        }
      })
      .then(res => res.data.accountByAddress)
  }

  public getAddressAllTokensOwned(address: string): Promise<Token[]> {
    return this.apollo
      .query({
        query: addressAllTokensOwned,
        variables: {
          address
        }
      })
      .then(res => res.data.addressAllTokensOwned)
  }

  public getAddressAmountTokensOwned(address: string): Promise<number> {
    return this.apollo
      .query({
        query: addressAmountTokensOwned,
        variables: {
          address
        }
      })
      .then(res => res.data.addressAmountTokensOwned)
  }

  public getInternalTransactionsByAddress(address: string, limit?: number, page?: number): Promise<{ items: Transfer[]; totalCount: number }> {
    return this.apollo
      .query({
        query: internalTransactionsByAddress,
        variables: { address, limit, page }
      })
      .then(res => res.data.internalTransactionsByAddress)
  }

  // ------------------------------------------------------------------------------------
  // Blocks
  // ------------------------------------------------------------------------------------

  public getBlock(hash: string): Promise<Block> {
    return this.apollo
      .query({
        query: blockByHash,
        variables: {
          hash
        }
      })
      .then(res => new Block(res.data.blockByHash))
  }

  public getBlocks(limit: number, page: number, fromBlock: number): Promise<SimpleBlock[]> {
    return this.apollo
      .query({
        query: blocks,
        variables: {
          limit,
          page,
          fromBlock
        }
      })
      .then(res => res.data.blocks.map(raw => new Block(raw)))
  }

  public getBlockByNumber(number: number): Promise<Block> {
    return this.apollo
      .query({
        query: blockByNumber,
        variables: {
          number
        }
      })
      .then(res => new Block(res.data.blockByNumber))
  }

  public getBlocksMinedOfAddress(address: string, limit: number, page: number): Promise<{items: SimpleBlock[], totalCount: number}> {
    return this.apollo
      .query({
        query: minedBlocksByAddress,
        variables: {
          address,
          limit,
          page
        }
      })
      .then(res => {
        const { minedBlocksByAddress } = res.data
        return {
          items: minedBlocksByAddress.items.map(raw => new SimpleBlock(raw)),
          totalCount: minedBlocksByAddress.totalCount
        }
      })
  }

  public getTotalNumberOfBlocks(): Promise<number> {
    return this.apollo
      .query({
        query: totalNumberOfBlocks
      })
      .then(res => res.data.totalNumberOfBlocks as number)
  }

  // ------------------------------------------------------------------------------------
  // Blocks Metrics
  // ------------------------------------------------------------------------------------

  public getBlockMetric(hash: string): Promise<BlockMetrics> {
    return this.apollo
      .query({
        query: blockMetricByHash,
        variables: {
          hash
        }
      })
      .then(res => res.data.blockMetrics)
  }

  public getBlockMetrics(limit: number, page: number): Promise<BlockMetrics[]> {
    return this.apollo
      .query({
        query: blockMetrics,
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
    return this.apollo
      .query({
        query: contractByAddress,
        variables: {
          address
        },
        fetchPolicy: 'network-only'
      })
      .then(res => res.data.contractByAddress)
  }

  public getContractsCreatedBy(address: string, limit?: number, page?: number): Promise<{ items: Contract[]; totalCount: number }> {
    return this.apollo
      .query({
        query: contractsCreatedBy,
        variables: {
          hash: address,
          limit,
          page
        }
      })
      .then(res => {
        const { contractsCreatedBy } = res.data as any
        contractsCreatedBy.items = contractsCreatedBy.items.map(contract => {
          // TODO work out why this check is necessary and remove it if possible
          if (contract.tx && !(contract.tx instanceof SimpleTx)) {
            contract.tx = new SimpleTx(contract.tx)
          }
          return contract
        })
        return contractsCreatedBy
      })
  }

  // ------------------------------------------------------------------------------------
  // Exchanges
  // ------------------------------------------------------------------------------------

  public getExchangeRateQuote(pair: string): Promise<CoinExchangeRate> {
    return this.apollo
      .query({
        query: coinExchangeRate,
        variables: {
          pair
        }
      })
      .then(res => res.data.coinExchangeRate)
  }

  public getTokenExchangeRates(filter: string, limit: number, page: number): Promise<TokenExchangeRate[]> {
    return this.apollo
      .query({
        query: tokenExchangeRates,
        variables: {
          filter,
          limit,
          page
        }
      })
      .then(res => res.data.tokenExchangeRates)
  }

  public getTotalNumberOfTokenExchangeRates(): Promise<number> {
    return this.apollo
      .query({
        query: totalNumTokenExchangeRates
      })
      .then(res => res.data.totalNumTokenExchangeRates)
  }

  public getTokenExchangeRateBySymbol(symbol: string): Promise<TokenExchangeRate> {
    return this.apollo
      .query({
        query: tokenExchangeRateBySymbol,
        variables: {
          symbol
        }
      })
      .then(res => res.data.tokenExchangeRateBySymbol)
  }

  public getTokenExchangeRateByAddress(address: string): Promise<TokenExchangeRate> {
    return this.apollo
      .query({
        query: tokenExchangeRateByAddress,
        variables: {
          address
        }
      })
      .then(res => res.data.tokenExchangeRateByAddress)
  }

  public getHolderDetails(address: string, holderAddress: string): Promise<any> {
    return this.apollo
      .query({
        query: holderDetails,
        variables: {
          address,
          holderAddress
        }
      })
      .then(res => res.data.holderDetails)
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
  // Tokens
  // ------------------------------------------------------------------------------------

  public getTokenHolders(address: string, limit?: number, page?: number): Promise<any> {
    return this.apollo
      .query({
        query: tokenHolders,
        variables: {
          address,
          limit,
          page
        }
      })
      .then(res => res.data.tokenHolders)
  }

  public getTokenTransfersByContractAddress(address: string, limit?: number, page?: number): Promise<{ items: Transfer[]; totalCount: number }> {
    return this.apollo
      .query({
        query: tokenTransfersByContractAddress,
        variables: {
          address,
          limit,
          page
        }
      })
      .then(res => res.data.tokenTransfersByContractAddress)
  }

  public getTokenTransfersByContractAddressForHolder(address: string, holder: string, filter: string, limit: number, page: number): Promise<TokenTransfer[]> {
    return this.apollo
      .query({
        query: tokenTransfersByContractAddressForHolder,
        variables: {
          address,
          holder,
          filter,
          limit,
          page
        }
      })
      .then(res => res.data.tokenTransfersByContractAddressForHolder)
  }

  // ------------------------------------------------------------------------------------
  // Txs
  // ------------------------------------------------------------------------------------

  public getTx(hash: string): Promise<Tx> {
    return this.apollo
      .query({
        query: tx,
        variables: {
          hash
        }
      })
      .then(res => new Tx(res.data.tx))
  }

  public getTxs(limit: number, order: string, fromBlock: number): Promise<SimpleTx[]> {
    return this.apollo
      .query({
        query: txs,
        variables: {
          limit,
          order,
          fromBlock
        }
      })
      .then(res => res.data.txs.map(raw => new SimpleTx(raw)))
  }

  public getTxsOfAddress(hash: string, filter: string, limit: number, page: number): Promise<SimpleTx[]> {
    return this.apollo
      .query({
        query: txsForAddress,
        variables: {
          hash: hash ? hash : '',
          filter,
          limit,
          page
        }
      })
      .then(res => res.data.txsForAddress.map(raw => new SimpleTx(raw)))
  }

  public getTotalNumberOfTxs(): Promise<number> {
    return this.apollo
      .query({
        query: totalNumberOfTransactions
      })
      .then(res => res.data.totalNumberOfTransactions as number)
  }

  // ------------------------------------------------------------------------------------
  // Uncles
  // ------------------------------------------------------------------------------------

  public getUncle(hash: string): Promise<Uncle> {
    return this.apollo
      .query({
        query: uncleByHash,
        variables: {
          hash
        }
      })
      .then(res => new Uncle(res.data.uncleByHash))
  }

  public getUncles(limit: number, page: number, fromUncle: number): Promise<Uncle[]> {
    return this.apollo
      .query({
        query: uncles,
        variables: {
          limit,
          page,
          fromUncle
        }
      })
      .then(res => res.data.uncles.map(raw => new Uncle(raw)))
  }

  public getTotalNumberOfUncles(): Promise<number> {
    return this.apollo
      .query({
        query: totalNumberOfUncles
      })
      .then(res => res.data.totalNumberOfUncles as number)
  }

  // ------------------------------------------------------------------------------------
  // Statistics
  // ------------------------------------------------------------------------------------

  public getAverageBlockTimeStats(duration: string): Promise<Statistic[]> {
    return this.apollo
      .query({
        query: averageBlockTime,
        variables: {
          duration
        }
      })
      .then(res => res.data.blockMetricsByDay)
  }

  public getAverageDifficultyStats(duration: string): Promise<Statistic[]> {
    return this.apollo
      .query({
        query: averageDifficulty,
        variables: {
          duration
        }
      })
      .then(res => res.data.blockMetricsByDay)
  }

  public getAverageGasLimitStats(duration: string): Promise<Statistic[]> {
    return this.apollo
      .query({
        query: averageGasLimit,
        variables: {
          duration
        }
      })
      .then(res => res.data.blockMetricsByDay)
  }

  public getAverageGasPriceStats(duration: string): Promise<Statistic[]> {
    return this.apollo
      .query({
        query: averageGasPrice,
        variables: {
          duration
        }
      })
      .then(res => res.data.blockMetricsByDay)
  }

  public getAverageHashRateStats(duration: string): Promise<Statistic[]> {
    return this.apollo
      .query({
        query: averageHashRate,
        variables: {
          duration
        }
      })
      .then(res => res.data.blockMetricsByDay)
  }

  public getAverageMinerRewardsStats(duration: string): Promise<Statistic[]> {
    return this.apollo
      .query({
        query: averageMinerReward,
        variables: {
          duration
        }
      })
      .then(res => res.data.blockMetricsByDay)
  }

  public getAverageTxFeeStats(duration: string): Promise<Statistic[]> {
    return this.apollo
      .query({
        query: averageTxFee,
        variables: {
          duration
        }
      })
      .then(res => res.data.blockMetricsByDay)
  }

  public getFailedTxStats(duration: string): Promise<Statistic[]> {
    return this.apollo
      .query({
        query: totalFailedTxs,
        variables: {
          duration
        }
      })
      .then(res => res.data.blockMetricsByDay)
  }

  public getSuccessfulTxStats(duration: string): Promise<Statistic[]> {
    return this.apollo
      .query({
        query: totalSuccessfulTxs,
        variables: {
          duration
        }
      })
      .then(res => res.data.blockMetricsByDay)
  }

  // ------------------------------------------------------------------------------------
  // Search
  // ------------------------------------------------------------------------------------

  public search(query: string): Promise<any> {
    return this.apollo
      .query({
        query: search,
        variables: {
          query
        }
      })
      .then(res => res.data.search)
  }

  // ------------------------------------------------------------------------------------
  // Subscriptions
  // ------------------------------------------------------------------------------------

  public observable<T>(type: string): Observable<T> {
    let query
    switch (type) {
      case 'simpleBlocks':
        query = newSimpleBlocks
        break
      case 'blockMetrics':
        query = newBlockMetrics
        break
      case 'simpleTxs':
        query = newSimpleTxs
        break
      default:
      // TODO error
    }

    return this.apollo.subscribe<T>({
      query
    })
  }
}
