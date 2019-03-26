import { EthvmApi } from '@app/core/api'
import { accountMetadataByHash, addressBalanceByHash, addressAllTokensOwned, addressAmountTokensOwned } from '@app/core/api/apollo/queries/addresses.graphql'
import { blockMetricByHash, blockMetrics } from '@app/core/api/apollo/queries/block-metrics.graphql'
import { blockByHash, blockByNumber, blocks, minedBlocksByAddress, totalNumberOfBlocks } from '@app/core/api/apollo/queries/blocks.graphql'
import { contractByHash, contractsCreatedBy } from '@app/core/api/apollo/queries/contracts.graphql'
import {
  quote,
  tokenExchangeRateByAddress,
  tokenExchangeRateBySymbol,
  tokenExchangeRates,
  totalNumTokenExchangeRates
} from '@app/core/api/apollo/queries/exchanges.graphql'
import { processingMetadataById } from '@app/core/api/apollo/queries/processing-metadata.graphql'
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
import {
  addressTokenTransfers,
  addressTokenTransfersByHolder,
  tokenHistory,
  topTokenHolders,
  holderDetails,
  holderTransfers
} from '@app/core/api/apollo/queries/token-transfers.graphql'
import { totalNumberOfTransactions, tx, txs, txsForAddress } from '@app/core/api/apollo/queries/txs.graphql'
import { totalNumberOfUncles, uncleByHash, uncles } from '@app/core/api/apollo/queries/uncles.graphql'
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

export class EthvmApolloApi implements EthvmApi {
  constructor(private readonly apollo: ApolloClient<{}>) {}

  // ------------------------------------------------------------------------------------
  // Address
  // ------------------------------------------------------------------------------------

  public getAddressBalance(address: string): Promise<AddressBalance> {
    return this.apollo
      .query({
        query: addressBalanceByHash,
        variables: {
          address
        }
      })
      .then(res => res.data.balanceByHash)
  }

  public getAddressMetadata(address: string): Promise<AddressMetadata> {
    return this.apollo
      .query({
        query: accountMetadataByHash,
        variables: {
          address
        }
      })
      .then(res => res.data.accountMetadataByHash)
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

  public getAddressTokenTransfers(address: string, limit: number, page: number): Promise<TokenTransfer[]> {
    return this.apollo
      .query({
        query: addressTokenTransfers,
        variables: {
          address,
          limit,
          page
        }
      })
      .then(res => res.data.addressTokenTransfers)
  }

  public getAddressTokenTransfersByHolder(address: string, holder: string, filter: string, limit: number, page: number): Promise<TokenTransfer[]> {
    return this.apollo
      .query({
        query: addressTokenTransfersByHolder,
        variables: {
          address,
          holder,
          filter,
          limit,
          page
        }
      })
      .then(res => res.data.addressTokenTransfersByHolder)
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

  public getBlocks(format: string, limit: number, page: number, fromBlock: number): Promise<Block[] | SimpleBlock[]> {
    return this.apollo
      .query({
        query: blocks,
        variables: {
          limit,
          page
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

  public getBlocksMinedOfAddress(address: string, limit: number, page: number): Promise<SimpleBlock[]> {
    return this.apollo
      .query({
        query: minedBlocksByAddress,
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
        query: contractByHash,
        variables: {
          address
        },
        fetchPolicy: 'network-only'
      })
      .then(res => res.data.contractByHash)
  }

  public getContractsCreatedBy(address: string, limit?: number, page?: number): Promise<Contract[]> {
    return this.apollo
      .query({
        query: contractsCreatedBy,
        variables: {
          hash: address,
          limit,
          page
        }
      })
      .then(res => res.data.contractsCreatedBy)
  }

  // ------------------------------------------------------------------------------------
  // Exchanges
  // ------------------------------------------------------------------------------------

  public getExchangeRateQuote(symbol: string, to: string): Promise<Quote> {
    return this.apollo
      .query({
        query: quote,
        variables: {
          symbol,
          to
        }
      })
      .then(res => res.data.quote)
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

  public getTokenHistory(address: string): Promise<any> {
    return this.apollo
      .query({
        query: tokenHistory,
        variables: {
          address
        }
      })
      .then(res => res.data.tokenHistory)
  }

  public getTopTokenHolders(address: string): Promise<any> {
    return this.apollo
      .query({
        query: topTokenHolders,
        variables: {
          address
        }
      })
      .then(res => res.data.topTokenHolders)
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

  public getHolderTransfers(address: string, holderAddress: string): Promise<any> {
    return this.apollo
      .query({
        query: holderTransfers,
        variables: {
          address,
          holderAddress
        }
      })
      .then(res => res.data.holderTransfers)
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
      .then(res => res.data.txs.map(raw => new Tx(raw)))
  }

  public getTxsOfAddress(hash: string, filter: string, limit: number, page: number): Promise<Tx[]> {
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
      .then(res => res.data.txsForAddress.map(raw => new Tx(raw)))
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
      .then(res => res.data.averageBlockTime)
  }

  public getAverageDifficultyStats(duration: string): Promise<Statistic[]> {
    return this.apollo
      .query({
        query: averageDifficulty,
        variables: {
          duration
        }
      })
      .then(res => res.data.averageDifficulty)
  }

  public getAverageGasLimitStats(duration: string): Promise<Statistic[]> {
    return this.apollo
      .query({
        query: averageGasLimit,
        variables: {
          duration
        }
      })
      .then(res => res.data.averageGasLimit)
  }

  public getAverageGasPriceStats(duration: string): Promise<Statistic[]> {
    return this.apollo
      .query({
        query: averageGasPrice,
        variables: {
          duration
        }
      })
      .then(res => res.data.averageGasPrice)
  }

  public getAverageHashRateStats(duration: string): Promise<Statistic[]> {
    return this.apollo
      .query({
        query: averageHashRate,
        variables: {
          duration
        }
      })
      .then(res => res.data.averageHashRate)
  }

  public getAverageMinerRewardsStats(duration: string): Promise<Statistic[]> {
    return this.apollo
      .query({
        query: averageMinerReward,
        variables: {
          duration
        }
      })
      .then(res => res.data.averageMinerReward)
  }

  public getAverageTxFeeStats(duration: string): Promise<Statistic[]> {
    return this.apollo
      .query({
        query: averageTxFee,
        variables: {
          duration
        }
      })
      .then(res => res.data.averageTxFee)
  }

  public getFailedTxStats(duration: string): Promise<Statistic[]> {
    return this.apollo
      .query({
        query: totalFailedTxs,
        variables: {
          duration
        }
      })
      .then(res => res.data.totalFailedTxs)
  }

  public getSuccessfulTxStats(duration: string): Promise<Statistic[]> {
    return this.apollo
      .query({
        query: totalSuccessfulTxs,
        variables: {
          duration
        }
      })
      .then(res => res.data.totalSuccessfulTxs)
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
  // Processing Metadata
  // ------------------------------------------------------------------------------------

  public getProcessingMetadata(id: string): Promise<ProcessingMetadata> {
    return this.apollo
      .query({
        query: processingMetadataById,
        variables: {
          id
        }
      })
      .then(res => res.data.processingMetadataById)
  }
}
