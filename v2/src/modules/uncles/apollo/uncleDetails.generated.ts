/* eslint-disable */
/**
 * NOTE: THIS IS AN AUTO-GENERATED FILE. DO NOT MODIFY IT DIRECTLY.
 */

import * as Types from '../../../apollo/types'

import gql from 'graphql-tag'
import * as VueApolloComposable from '@vue/apollo-composable'
import * as VueCompositionApi from 'vue'
export type ReactiveFunction<TParam> = () => TParam
export type UncleDetailsFragment = {
    __typename?: 'Uncle'
    unclePosition: number
    parentBlockNumber: number
    block: {
        __typename?: 'Block'
        hash: string
        sha3Uncles: string
        gasLimit: number
        gasUsed: number
        summary: { __typename?: 'BlockSummary'; number: number; miner: string; timestamp: number }
    }
}

export type GetUncleByHashQueryVariables = Types.Exact<{
    hash: Types.Scalars['String']
}>

export type GetUncleByHashQuery = {
    __typename?: 'Query'
    getUncleByHash: {
        __typename?: 'Uncle'
        unclePosition: number
        parentBlockNumber: number
        block: {
            __typename?: 'Block'
            hash: string
            sha3Uncles: string
            gasLimit: number
            gasUsed: number
            summary: { __typename?: 'BlockSummary'; number: number; miner: string; timestamp: number }
        }
    }
}

export const UncleDetailsFragmentDoc = gql`
    fragment UncleDetails on Uncle {
        block {
            hash
            sha3Uncles
            gasLimit
            gasUsed
            summary {
                number
                miner
                timestamp
            }
        }
        unclePosition
        parentBlockNumber
    }
`
export const GetUncleByHashDocument = gql`
    query getUncleByHash($hash: String!) {
        getUncleByHash(hash: $hash) {
            ...UncleDetails
        }
    }
    ${UncleDetailsFragmentDoc}
`

/**
 * __useGetUncleByHashQuery__
 *
 * To run a query within a Vue component, call `useGetUncleByHashQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUncleByHashQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetUncleByHashQuery({
 *   hash: // value for 'hash'
 * });
 */
export function useGetUncleByHashQuery(
    variables: GetUncleByHashQueryVariables | VueCompositionApi.Ref<GetUncleByHashQueryVariables> | ReactiveFunction<GetUncleByHashQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetUncleByHashQuery, GetUncleByHashQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetUncleByHashQuery, GetUncleByHashQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetUncleByHashQuery, GetUncleByHashQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetUncleByHashQuery, GetUncleByHashQueryVariables>(GetUncleByHashDocument, variables, options)
}
export function useGetUncleByHashLazyQuery(
    variables: GetUncleByHashQueryVariables | VueCompositionApi.Ref<GetUncleByHashQueryVariables> | ReactiveFunction<GetUncleByHashQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetUncleByHashQuery, GetUncleByHashQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetUncleByHashQuery, GetUncleByHashQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetUncleByHashQuery, GetUncleByHashQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetUncleByHashQuery, GetUncleByHashQueryVariables>(GetUncleByHashDocument, variables, options)
}
export type GetUncleByHashQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetUncleByHashQuery, GetUncleByHashQueryVariables>
