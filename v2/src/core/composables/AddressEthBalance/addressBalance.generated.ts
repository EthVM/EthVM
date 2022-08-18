/* eslint-disable */
/**
 * NOTE: THIS IS AN AUTO-GENERATED FILE. DO NOT MODIFY IT DIRECTLY.
 */

import * as Types from '../../../apollo/types'

import gql from 'graphql-tag'
import * as VueApolloComposable from '@vue/apollo-composable'
import * as VueCompositionApi from 'vue'
export type ReactiveFunction<TParam> = () => TParam
export type GetEthBalanceQueryVariables = Types.Exact<{
    hash: Types.Scalars['String']
}>

export type GetEthBalanceQuery = { __typename?: 'Query'; getEthBalance: { __typename?: 'EthOwner'; balance: string } }

export const GetEthBalanceDocument = gql`
    query getEthBalance($hash: String!) {
        getEthBalance(owner: $hash) {
            balance
        }
    }
`

/**
 * __useGetEthBalanceQuery__
 *
 * To run a query within a Vue component, call `useGetEthBalanceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEthBalanceQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetEthBalanceQuery({
 *   hash: // value for 'hash'
 * });
 */
export function useGetEthBalanceQuery(
    variables: GetEthBalanceQueryVariables | VueCompositionApi.Ref<GetEthBalanceQueryVariables> | ReactiveFunction<GetEthBalanceQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetEthBalanceQuery, GetEthBalanceQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetEthBalanceQuery, GetEthBalanceQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetEthBalanceQuery, GetEthBalanceQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetEthBalanceQuery, GetEthBalanceQueryVariables>(GetEthBalanceDocument, variables, options)
}
export function useGetEthBalanceLazyQuery(
    variables: GetEthBalanceQueryVariables | VueCompositionApi.Ref<GetEthBalanceQueryVariables> | ReactiveFunction<GetEthBalanceQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetEthBalanceQuery, GetEthBalanceQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetEthBalanceQuery, GetEthBalanceQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetEthBalanceQuery, GetEthBalanceQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetEthBalanceQuery, GetEthBalanceQueryVariables>(GetEthBalanceDocument, variables, options)
}
export type GetEthBalanceQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetEthBalanceQuery, GetEthBalanceQueryVariables>
