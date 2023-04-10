/* eslint-disable */
/**
 * NOTE: THIS IS AN AUTO-GENERATED FILE. DO NOT MODIFY IT DIRECTLY.
 */

import * as Types from '../../../../apollo/types'

import gql from 'graphql-tag'
import * as VueApolloComposable from '@vue/apollo-composable'
import * as VueCompositionApi from 'vue'
export type ReactiveFunction<TParam> = () => TParam
export type BlockWithdrawalFragment = {
    __typename?: 'ETHWithdrawalTransfer'
    validatorIndex: string
    value: string
    transfer: { __typename?: 'Transfer'; to: string }
}

export type GetBlockWithdrawalsQueryVariables = Types.Exact<{
    blockNumber: Types.Scalars['Int']
    nextKey?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetBlockWithdrawalsQuery = {
    __typename?: 'Query'
    getEthWithdrawalTransfers: {
        __typename?: 'ETHWithdrawalTransfers'
        nextKey?: string | null
        transfers: Array<{ __typename?: 'ETHWithdrawalTransfer'; validatorIndex: string; value: string; transfer: { __typename?: 'Transfer'; to: string } }>
    }
}

export const BlockWithdrawalFragmentDoc = gql`
    fragment blockWithdrawal on ETHWithdrawalTransfer {
        validatorIndex
        value
        transfer {
            to
        }
    }
`
export const GetBlockWithdrawalsDocument = gql`
    query getBlockWithdrawals($blockNumber: Int!, $nextKey: String) {
        getEthWithdrawalTransfers(blockNumber: $blockNumber, limit: 10, nextKey: $nextKey) {
            transfers {
                ...blockWithdrawal
            }
            nextKey
        }
    }
    ${BlockWithdrawalFragmentDoc}
`

/**
 * __useGetBlockWithdrawalsQuery__
 *
 * To run a query within a Vue component, call `useGetBlockWithdrawalsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBlockWithdrawalsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetBlockWithdrawalsQuery({
 *   blockNumber: // value for 'blockNumber'
 *   nextKey: // value for 'nextKey'
 * });
 */
export function useGetBlockWithdrawalsQuery(
    variables:
        | GetBlockWithdrawalsQueryVariables
        | VueCompositionApi.Ref<GetBlockWithdrawalsQueryVariables>
        | ReactiveFunction<GetBlockWithdrawalsQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetBlockWithdrawalsQuery, GetBlockWithdrawalsQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetBlockWithdrawalsQuery, GetBlockWithdrawalsQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetBlockWithdrawalsQuery, GetBlockWithdrawalsQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetBlockWithdrawalsQuery, GetBlockWithdrawalsQueryVariables>(GetBlockWithdrawalsDocument, variables, options)
}
export function useGetBlockWithdrawalsLazyQuery(
    variables:
        | GetBlockWithdrawalsQueryVariables
        | VueCompositionApi.Ref<GetBlockWithdrawalsQueryVariables>
        | ReactiveFunction<GetBlockWithdrawalsQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetBlockWithdrawalsQuery, GetBlockWithdrawalsQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetBlockWithdrawalsQuery, GetBlockWithdrawalsQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetBlockWithdrawalsQuery, GetBlockWithdrawalsQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetBlockWithdrawalsQuery, GetBlockWithdrawalsQueryVariables>(GetBlockWithdrawalsDocument, variables, options)
}
export type GetBlockWithdrawalsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetBlockWithdrawalsQuery, GetBlockWithdrawalsQueryVariables>
