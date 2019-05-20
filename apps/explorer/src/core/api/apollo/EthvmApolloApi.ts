import { EthvmApi } from '@app/core/api'
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
import { CoinExchangeRate, Contract, PendingTx, TokenExchangeRate, TokenHolder, Transfer } from '@app/core/models'
import { ApolloClient } from 'apollo-client'

export class EthvmApolloApi implements EthvmApi {
  constructor(private readonly apollo: ApolloClient<{}>) {}

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
