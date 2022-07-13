/**
 * NOTE: THIS IS AN AUTO-GENERATED FILE. DO NOT MODIFY IT DIRECTLY.
 */
/* eslint-disable */

import * as Types from '../../../apollo/types'

import gql from 'graphql-tag'
import * as VueApolloComposable from '@vue/apollo-composable'
import * as VueCompositionApi from 'vue'
export type ReactiveFunction<TParam> = () => TParam
export type TokenFragmentFragment = { __typename?: 'EthTokenInfo'; name?: string | null; symbol?: string | null; decimals?: number | null }

export type TokenOwnersFragment = {
    __typename?: 'ERC20TokenBalance'
    balance: string
    tokenInfo: { __typename?: 'EthTokenInfo'; contract: string; name?: string | null; symbol?: string | null; decimals?: number | null }
}

export type GetOwnersErc20TokensQueryVariables = Types.Exact<{
    hash: Types.Scalars['String']
    _nextKey?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetOwnersErc20TokensQuery = {
    __typename?: 'Query'
    getOwnersERC20Tokens: {
        __typename?: 'ERC20TokenOwners'
        nextKey?: string | null
        owners: Array<{
            __typename?: 'ERC20TokenBalance'
            balance: string
            tokenInfo: { __typename?: 'EthTokenInfo'; contract: string; name?: string | null; symbol?: string | null; decimals?: number | null }
        } | null>
    }
}

export const TokenFragmentFragmentDoc = gql`
    fragment TokenFragment on EthTokenInfo {
        name
        symbol
        decimals
    }
`
export const TokenOwnersFragmentDoc = gql`
    fragment TokenOwners on ERC20TokenBalance {
        tokenInfo {
            ...TokenFragment
            contract
        }
        balance
    }
    ${TokenFragmentFragmentDoc}
`
export const GetOwnersErc20TokensDocument = gql`
    query getOwnersERC20Tokens($hash: String!, $_nextKey: String) {
        getOwnersERC20Tokens(owner: $hash, nextKey: $_nextKey) {
            owners {
                ...TokenOwners
            }
            nextKey
        }
    }
    ${TokenOwnersFragmentDoc}
`

/**
 * __useGetOwnersErc20TokensQuery__
 *
 * To run a query within a Vue component, call `useGetOwnersErc20TokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOwnersErc20TokensQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetOwnersErc20TokensQuery({
 *   hash: // value for 'hash'
 *   _nextKey: // value for '_nextKey'
 * });
 */
export function useGetOwnersErc20TokensQuery(
    variables:
        | GetOwnersErc20TokensQueryVariables
        | VueCompositionApi.Ref<GetOwnersErc20TokensQueryVariables>
        | ReactiveFunction<GetOwnersErc20TokensQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetOwnersErc20TokensQuery, GetOwnersErc20TokensQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetOwnersErc20TokensQuery, GetOwnersErc20TokensQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetOwnersErc20TokensQuery, GetOwnersErc20TokensQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetOwnersErc20TokensQuery, GetOwnersErc20TokensQueryVariables>(GetOwnersErc20TokensDocument, variables, options)
}
export function useGetOwnersErc20TokensLazyQuery(
    variables:
        | GetOwnersErc20TokensQueryVariables
        | VueCompositionApi.Ref<GetOwnersErc20TokensQueryVariables>
        | ReactiveFunction<GetOwnersErc20TokensQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetOwnersErc20TokensQuery, GetOwnersErc20TokensQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetOwnersErc20TokensQuery, GetOwnersErc20TokensQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetOwnersErc20TokensQuery, GetOwnersErc20TokensQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetOwnersErc20TokensQuery, GetOwnersErc20TokensQueryVariables>(GetOwnersErc20TokensDocument, variables, options)
}
export type GetOwnersErc20TokensQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<
    GetOwnersErc20TokensQuery,
    GetOwnersErc20TokensQueryVariables
>
