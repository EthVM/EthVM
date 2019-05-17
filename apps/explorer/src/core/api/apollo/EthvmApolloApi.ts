import { EthvmApi } from '@app/core/api'
import { blockByHash, blockByNumber, blocks, minedBlocksByAddress, totalNumberOfBlocks } from '@app/core/api/apollo/queries/blocks.graphql'
import { contractByAddress } from '@app/core/api/apollo/queries/contracts.graphql'
import { search } from '@app/core/api/apollo/queries/search.graphql'

import {
  coinExchangeRate,
  holderDetails,
  tokenExchangeRateByAddress,
  tokenExchangeRateBySymbol,
  tokenExchangeRates,
  tokenHolders,
  tokenTransfersByContractAddress,
  tokenTransfersByContractAddressForHolder,
  totalNumTokenExchangeRates
} from '@app/core/api/apollo/queries/tokens.graphql'
import { totalNumberOfTransactions, tx, txs, txsForAddress } from '@app/core/api/apollo/queries/txs.graphql'
import {
  Account,
  Block,
  CoinExchangeRate,
  Contract,
  PendingTx,
  SimpleBlock,
  SimpleTx,
  Token,
  TokenExchangeRate,
  TokenHolder,
  Transfer,
  Tx
} from '@app/core/models'
import { totalNumberOfUncles, uncleByHash, uncles } from '@app/core/api/apollo/queries/uncles.graphql'
import { ApolloClient } from 'apollo-client'
import BigNumber from 'bignumber.js'

export class EthvmApolloApi implements EthvmApi {
  constructor(private readonly apollo: ApolloClient<{}>) {}

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
      .then(res => res.data.transactions.map(raw => new Block(raw)))
  }

  public getBlockByNumber(number: BigNumber): Promise<Block> {
    return this.apollo
      .query({
        query: blockByNumber,
        variables: {
          number: number.toString()
        }
      })
      .then(res => new Block(res.data.blockByNumber))
  }

  public getBlocksMinedOfAddress(address: string, limit: number, page: number): Promise<{ items: SimpleBlock[]; totalCount: number }> {
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

  public getTokenHolders(address: string, limit?: number, page?: number): Promise<{ items: TokenHolder[]; totalCount: number }> {
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

  public getTokenTransfersByContractAddress(address: string, limit?: number, page?: number): Promise<{ items: Transfer[]; totalCount: string }> {
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

  public getTokenTransfersByContractAddressForHolder(
    address: string,
    holder: string,
    filter: string,
    limit: number,
    page: number
  ): Promise<{ items: Transfer[]; totalCount: string }> {
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
}
