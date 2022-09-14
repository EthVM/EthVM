/* eslint-disable */
/**
 * NOTE: THIS IS AN AUTO-GENERATED FILE. DO NOT MODIFY IT DIRECTLY.
 */

import * as Types from '../../../../apollo/types'

import gql from 'graphql-tag'
import * as VueApolloComposable from '@vue/apollo-composable'
import * as VueCompositionApi from 'vue'
export type ReactiveFunction<TParam> = () => TParam
export type BlockInfoFragment = { __typename?: 'LatestBlockData'; number: number; avgBlockTime: number; hashRate: string; difficulty: string }

export type GetLatestBlockInfoQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetLatestBlockInfoQuery = {
    __typename?: 'Query'
    getLatestBlockInfo: { __typename?: 'LatestBlockData'; number: number; avgBlockTime: number; hashRate: string; difficulty: string }
}

export const BlockInfoFragmentDoc = gql`
    fragment blockInfo on LatestBlockData {
        number
        avgBlockTime
        hashRate
        difficulty
    }
`
export const GetLatestBlockInfoDocument = gql`
    query getLatestBlockInfo {
        getLatestBlockInfo {
            ...blockInfo
        }
    }
    ${BlockInfoFragmentDoc}
`

/**
 * __useGetLatestBlockInfoQuery__
 *
 * To run a query within a Vue component, call `useGetLatestBlockInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLatestBlockInfoQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetLatestBlockInfoQuery();
 */
export function useGetLatestBlockInfoQuery(
    options:
        | VueApolloComposable.UseQueryOptions<GetLatestBlockInfoQuery, GetLatestBlockInfoQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetLatestBlockInfoQuery, GetLatestBlockInfoQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetLatestBlockInfoQuery, GetLatestBlockInfoQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetLatestBlockInfoQuery, GetLatestBlockInfoQueryVariables>(GetLatestBlockInfoDocument, {}, options)
}
export function useGetLatestBlockInfoLazyQuery(
    options:
        | VueApolloComposable.UseQueryOptions<GetLatestBlockInfoQuery, GetLatestBlockInfoQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetLatestBlockInfoQuery, GetLatestBlockInfoQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetLatestBlockInfoQuery, GetLatestBlockInfoQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetLatestBlockInfoQuery, GetLatestBlockInfoQueryVariables>(GetLatestBlockInfoDocument, {}, options)
}
export type GetLatestBlockInfoQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetLatestBlockInfoQuery, GetLatestBlockInfoQueryVariables>
