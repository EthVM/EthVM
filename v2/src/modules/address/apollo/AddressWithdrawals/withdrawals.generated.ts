/* eslint-disable */
/**
 * NOTE: THIS IS AN AUTO-GENERATED FILE. DO NOT MODIFY IT DIRECTLY.
 */

import * as Types from '../../../../apollo/types'

import gql from 'graphql-tag'
import * as VueApolloComposable from '@vue/apollo-composable'
import * as VueCompositionApi from 'vue'
export type ReactiveFunction<TParam> = () => TParam
export type AdrWithdrawalFragment = {
    __typename?: 'ETHWithdrawalTransfer'
    validatorIndex: string
    value: string
    transfer: { __typename?: 'Transfer'; block: number; timestamp: number }
}

export type GetAdrWithdrawalsQueryVariables = Types.Exact<{
    address: Types.Scalars['String']
    nextKey?: Types.InputMaybe<Types.Scalars['String']>
    limit: Types.Scalars['Int']
}>

export type GetAdrWithdrawalsQuery = {
    __typename?: 'Query'
    getEthWithdrawalTransfers: {
        __typename?: 'ETHWithdrawalTransfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'ETHWithdrawalTransfer'
            validatorIndex: string
            value: string
            transfer: { __typename?: 'Transfer'; block: number; timestamp: number }
        }>
    }
}

export const AdrWithdrawalFragmentDoc = gql`
    fragment AdrWithdrawal on ETHWithdrawalTransfer {
        validatorIndex
        value
        transfer {
            block
            timestamp
        }
    }
`
export const GetAdrWithdrawalsDocument = gql`
    query getAdrWithdrawals($address: String!, $nextKey: String, $limit: Int!) {
        getEthWithdrawalTransfers(address: $address, limit: $limit, nextKey: $nextKey) {
            transfers {
                ...AdrWithdrawal
            }
            nextKey
        }
    }
    ${AdrWithdrawalFragmentDoc}
`

/**
 * __useGetAdrWithdrawalsQuery__
 *
 * To run a query within a Vue component, call `useGetAdrWithdrawalsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdrWithdrawalsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetAdrWithdrawalsQuery({
 *   address: // value for 'address'
 *   nextKey: // value for 'nextKey'
 *   limit: // value for 'limit'
 * });
 */
export function useGetAdrWithdrawalsQuery(
    variables: GetAdrWithdrawalsQueryVariables | VueCompositionApi.Ref<GetAdrWithdrawalsQueryVariables> | ReactiveFunction<GetAdrWithdrawalsQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetAdrWithdrawalsQuery, GetAdrWithdrawalsQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetAdrWithdrawalsQuery, GetAdrWithdrawalsQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetAdrWithdrawalsQuery, GetAdrWithdrawalsQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetAdrWithdrawalsQuery, GetAdrWithdrawalsQueryVariables>(GetAdrWithdrawalsDocument, variables, options)
}
export function useGetAdrWithdrawalsLazyQuery(
    variables: GetAdrWithdrawalsQueryVariables | VueCompositionApi.Ref<GetAdrWithdrawalsQueryVariables> | ReactiveFunction<GetAdrWithdrawalsQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetAdrWithdrawalsQuery, GetAdrWithdrawalsQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetAdrWithdrawalsQuery, GetAdrWithdrawalsQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetAdrWithdrawalsQuery, GetAdrWithdrawalsQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetAdrWithdrawalsQuery, GetAdrWithdrawalsQueryVariables>(GetAdrWithdrawalsDocument, variables, options)
}
export type GetAdrWithdrawalsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetAdrWithdrawalsQuery, GetAdrWithdrawalsQueryVariables>
