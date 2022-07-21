/* eslint-disable */
/**
 * NOTE: THIS IS AN AUTO-GENERATED FILE. DO NOT MODIFY IT DIRECTLY.
 */

import * as Types from '../../../../apollo/types'

import gql from 'graphql-tag'
import * as VueApolloComposable from '@vue/apollo-composable'
import * as VueCompositionApi from 'vue'
export type ReactiveFunction<TParam> = () => TParam
export type BlockDetailsFragment = {
    __typename?: 'Block'
    hash: string
    parentHash: string
    nonce: string
    sha3Uncles: string
    logsBloom: string
    transactionsRoot: string
    stateRoot: string
    receiptsRoot: string
    difficulty: string
    totalDifficulty: string
    extraData: string
    size: number
    gasLimit: number
    gasUsed: number
    transactions: Array<string | null>
    summary: {
        __typename?: 'BlockSummary'
        number: number
        miner: string
        txCount: number
        timestamp: number
        uncles: Array<string | null>
        txFail: number
        rewards: { __typename?: 'BlockRewards'; txFees: string; total: string; uncles: string }
    }
}

export type GetBlockByNumberQueryVariables = Types.Exact<{
    blockRef: Types.Scalars['Int']
}>

export type GetBlockByNumberQuery = {
    __typename?: 'Query'
    getBlockByNumber: {
        __typename?: 'Block'
        hash: string
        parentHash: string
        nonce: string
        sha3Uncles: string
        logsBloom: string
        transactionsRoot: string
        stateRoot: string
        receiptsRoot: string
        difficulty: string
        totalDifficulty: string
        extraData: string
        size: number
        gasLimit: number
        gasUsed: number
        transactions: Array<string | null>
        summary: {
            __typename?: 'BlockSummary'
            number: number
            miner: string
            txCount: number
            timestamp: number
            uncles: Array<string | null>
            txFail: number
            rewards: { __typename?: 'BlockRewards'; txFees: string; total: string; uncles: string }
        }
    }
}

export type GetBlockByHashQueryVariables = Types.Exact<{
    blockRef: Types.Scalars['String']
}>

export type GetBlockByHashQuery = {
    __typename?: 'Query'
    getBlockByHash: {
        __typename?: 'Block'
        hash: string
        parentHash: string
        nonce: string
        sha3Uncles: string
        logsBloom: string
        transactionsRoot: string
        stateRoot: string
        receiptsRoot: string
        difficulty: string
        totalDifficulty: string
        extraData: string
        size: number
        gasLimit: number
        gasUsed: number
        transactions: Array<string | null>
        summary: {
            __typename?: 'BlockSummary'
            number: number
            miner: string
            txCount: number
            timestamp: number
            uncles: Array<string | null>
            txFail: number
            rewards: { __typename?: 'BlockRewards'; txFees: string; total: string; uncles: string }
        }
    }
}

export type GetLastBlockNumberQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetLastBlockNumberQuery = { __typename?: 'Query'; getLatestBlockInfo: { __typename?: 'LatestBlockData'; number: number } }

export const BlockDetailsFragmentDoc = gql`
    fragment BlockDetails on Block {
        summary {
            number
            miner
            txCount
            timestamp
            uncles
            rewards {
                txFees
                total
                uncles
            }
            txFail
        }
        hash
        parentHash
        nonce
        sha3Uncles
        logsBloom
        transactionsRoot
        stateRoot
        receiptsRoot
        difficulty
        totalDifficulty
        extraData
        size
        gasLimit
        gasUsed
        transactions
    }
`
export const GetBlockByNumberDocument = gql`
    query getBlockByNumber($blockRef: Int!) {
        getBlockByNumber(number: $blockRef) {
            ...BlockDetails
        }
    }
    ${BlockDetailsFragmentDoc}
`

/**
 * __useGetBlockByNumberQuery__
 *
 * To run a query within a Vue component, call `useGetBlockByNumberQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBlockByNumberQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetBlockByNumberQuery({
 *   blockRef: // value for 'blockRef'
 * });
 */
export function useGetBlockByNumberQuery(
    variables: GetBlockByNumberQueryVariables | VueCompositionApi.Ref<GetBlockByNumberQueryVariables> | ReactiveFunction<GetBlockByNumberQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetBlockByNumberQuery, GetBlockByNumberQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetBlockByNumberQuery, GetBlockByNumberQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetBlockByNumberQuery, GetBlockByNumberQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetBlockByNumberQuery, GetBlockByNumberQueryVariables>(GetBlockByNumberDocument, variables, options)
}
export function useGetBlockByNumberLazyQuery(
    variables: GetBlockByNumberQueryVariables | VueCompositionApi.Ref<GetBlockByNumberQueryVariables> | ReactiveFunction<GetBlockByNumberQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetBlockByNumberQuery, GetBlockByNumberQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetBlockByNumberQuery, GetBlockByNumberQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetBlockByNumberQuery, GetBlockByNumberQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetBlockByNumberQuery, GetBlockByNumberQueryVariables>(GetBlockByNumberDocument, variables, options)
}
export type GetBlockByNumberQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetBlockByNumberQuery, GetBlockByNumberQueryVariables>
export const GetBlockByHashDocument = gql`
    query getBlockByHash($blockRef: String!) {
        getBlockByHash(hash: $blockRef) {
            ...BlockDetails
        }
    }
    ${BlockDetailsFragmentDoc}
`

/**
 * __useGetBlockByHashQuery__
 *
 * To run a query within a Vue component, call `useGetBlockByHashQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBlockByHashQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetBlockByHashQuery({
 *   blockRef: // value for 'blockRef'
 * });
 */
export function useGetBlockByHashQuery(
    variables: GetBlockByHashQueryVariables | VueCompositionApi.Ref<GetBlockByHashQueryVariables> | ReactiveFunction<GetBlockByHashQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetBlockByHashQuery, GetBlockByHashQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetBlockByHashQuery, GetBlockByHashQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetBlockByHashQuery, GetBlockByHashQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetBlockByHashQuery, GetBlockByHashQueryVariables>(GetBlockByHashDocument, variables, options)
}
export function useGetBlockByHashLazyQuery(
    variables: GetBlockByHashQueryVariables | VueCompositionApi.Ref<GetBlockByHashQueryVariables> | ReactiveFunction<GetBlockByHashQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetBlockByHashQuery, GetBlockByHashQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetBlockByHashQuery, GetBlockByHashQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetBlockByHashQuery, GetBlockByHashQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetBlockByHashQuery, GetBlockByHashQueryVariables>(GetBlockByHashDocument, variables, options)
}
export type GetBlockByHashQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetBlockByHashQuery, GetBlockByHashQueryVariables>
export const GetLastBlockNumberDocument = gql`
    query getLastBlockNumber {
        getLatestBlockInfo {
            number
        }
    }
`

/**
 * __useGetLastBlockNumberQuery__
 *
 * To run a query within a Vue component, call `useGetLastBlockNumberQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLastBlockNumberQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetLastBlockNumberQuery();
 */
export function useGetLastBlockNumberQuery(
    options:
        | VueApolloComposable.UseQueryOptions<GetLastBlockNumberQuery, GetLastBlockNumberQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetLastBlockNumberQuery, GetLastBlockNumberQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetLastBlockNumberQuery, GetLastBlockNumberQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetLastBlockNumberQuery, GetLastBlockNumberQueryVariables>(GetLastBlockNumberDocument, {}, options)
}
export function useGetLastBlockNumberLazyQuery(
    options:
        | VueApolloComposable.UseQueryOptions<GetLastBlockNumberQuery, GetLastBlockNumberQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetLastBlockNumberQuery, GetLastBlockNumberQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetLastBlockNumberQuery, GetLastBlockNumberQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetLastBlockNumberQuery, GetLastBlockNumberQueryVariables>(GetLastBlockNumberDocument, {}, options)
}
export type GetLastBlockNumberQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetLastBlockNumberQuery, GetLastBlockNumberQueryVariables>
