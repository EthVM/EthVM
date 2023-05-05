/* eslint-disable */
/**
 * NOTE: THIS IS AN AUTO-GENERATED FILE. DO NOT MODIFY IT DIRECTLY.
 */

import * as Types from '../../../../apollo/types'

import gql from 'graphql-tag'
import * as VueApolloComposable from '@vue/apollo-composable'
import * as VueCompositionApi from 'vue'
export type ReactiveFunction<TParam> = () => TParam
export type EthTransferInTxFragment = {
    __typename?: 'EthTransfer'
    value: string
    transfer: { __typename?: 'Transfer'; type: Types.TransferType; from: string; to: string }
}

export type GetEthTransfersInTxQueryVariables = Types.Exact<{
    limit?: Types.InputMaybe<Types.Scalars['Int']>
    hash: Types.Scalars['String']
    nextKey?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetEthTransfersInTxQuery = {
    __typename?: 'Query'
    getEthTransfersByHash: {
        __typename?: 'ETHTransfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'EthTransfer'
            value: string
            transfer: { __typename?: 'Transfer'; type: Types.TransferType; from: string; to: string }
        } | null>
    }
}

export const EthTransferInTxFragmentDoc = gql`
    fragment EthTransferInTx on EthTransfer {
        transfer {
            type
            from
            to
        }
        value
    }
`
export const GetEthTransfersInTxDocument = gql`
    query getEthTransfersInTx($limit: Int, $hash: String!, $nextKey: String) {
        getEthTransfersByHash(limit: $limit, hash: $hash, nextKey: $nextKey) {
            transfers {
                ...EthTransferInTx
            }
            nextKey
        }
    }
    ${EthTransferInTxFragmentDoc}
`

/**
 * __useGetEthTransfersInTxQuery__
 *
 * To run a query within a Vue component, call `useGetEthTransfersInTxQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEthTransfersInTxQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetEthTransfersInTxQuery({
 *   limit: // value for 'limit'
 *   hash: // value for 'hash'
 *   nextKey: // value for 'nextKey'
 * });
 */
export function useGetEthTransfersInTxQuery(
    variables:
        | GetEthTransfersInTxQueryVariables
        | VueCompositionApi.Ref<GetEthTransfersInTxQueryVariables>
        | ReactiveFunction<GetEthTransfersInTxQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetEthTransfersInTxQuery, GetEthTransfersInTxQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetEthTransfersInTxQuery, GetEthTransfersInTxQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetEthTransfersInTxQuery, GetEthTransfersInTxQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetEthTransfersInTxQuery, GetEthTransfersInTxQueryVariables>(GetEthTransfersInTxDocument, variables, options)
}
export function useGetEthTransfersInTxLazyQuery(
    variables:
        | GetEthTransfersInTxQueryVariables
        | VueCompositionApi.Ref<GetEthTransfersInTxQueryVariables>
        | ReactiveFunction<GetEthTransfersInTxQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetEthTransfersInTxQuery, GetEthTransfersInTxQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetEthTransfersInTxQuery, GetEthTransfersInTxQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetEthTransfersInTxQuery, GetEthTransfersInTxQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetEthTransfersInTxQuery, GetEthTransfersInTxQueryVariables>(GetEthTransfersInTxDocument, variables, options)
}
export type GetEthTransfersInTxQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetEthTransfersInTxQuery, GetEthTransfersInTxQueryVariables>
