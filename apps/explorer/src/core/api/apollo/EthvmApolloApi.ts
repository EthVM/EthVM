import { EthvmApi } from '@app/core/api'
import { search } from '@app/core/api/apollo/queries/search.graphql'
import { PendingTx } from '@app/core/models'
import { ApolloClient } from 'apollo-client'

export class EthvmApolloApi implements EthvmApi {
  constructor(private readonly apollo: ApolloClient<{}>) {}

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
