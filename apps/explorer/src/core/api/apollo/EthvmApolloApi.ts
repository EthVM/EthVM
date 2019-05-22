import { EthvmApi } from '@app/core/api'
import { contractByAddress } from '@app/core/api/apollo/queries/contracts.graphql'
import { search } from '@app/core/api/apollo/queries/search.graphql'
import { coinExchangeRate, tokenExchangeRateBySymbol } from '@app/core/api/apollo/queries/tokens.graphql'
import { CoinExchangeRate, Contract, PendingTx, TokenExchangeRate } from '@app/core/models'
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
