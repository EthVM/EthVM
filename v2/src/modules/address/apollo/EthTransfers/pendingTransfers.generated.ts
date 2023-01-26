/* eslint-disable */
/**
 * NOTE: THIS IS AN AUTO-GENERATED FILE. DO NOT MODIFY IT DIRECTLY.
 */

import * as Types from '../../../../apollo/types'

import gql from 'graphql-tag'
import * as VueApolloComposable from '@vue/apollo-composable'
import * as VueCompositionApi from 'vue'
export type ReactiveFunction<TParam> = () => TParam
export type PendingTxsFragmentFragment = {
    __typename?: 'Tx'
    baseFeePerGas?: string | null
    blockHash?: string | null
    blockNumber?: number | null
    contractAddress?: string | null
    from: string
    gas: string
    gasPrice: string
    gasUsed?: string | null
    hash: string
    input: string
    maxFeePerGas?: string | null
    maxPriorityFeePerGas?: string | null
    nonce: number
    r?: string | null
    replacedBy?: string | null
    s?: string | null
    status?: string | null
    timestamp?: number | null
    to?: string | null
    transactionIndex?: number | null
    v?: string | null
    value: string
    logs: Array<{ __typename?: 'Log'; address: string; data: string; logIndex: number; removed: boolean; topics: Array<string>; type?: string | null }>
    trace?: Array<{
        __typename?: 'Trace'
        subtraces?: number | null
        traceAddress?: Array<number> | null
        transactionPosition?: number | null
        type?: string | null
        action?: {
            __typename?: 'TraceAction'
            callType?: string | null
            from?: string | null
            gas?: string | null
            input?: string | null
            to?: string | null
            value?: string | null
        } | null
        result?: { __typename?: 'TraceResult'; gasUsed?: string | null; output?: string | null } | null
    }> | null
}

export type GetPendingTransactionsQueryVariables = Types.Exact<{
    hash: Types.Scalars['String']
    _limit?: Types.InputMaybe<Types.Scalars['Int']>
    _nextKey?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetPendingTransactionsQuery = {
    __typename?: 'Query'
    getPendingTransactionsV2: {
        __typename?: 'PendingTransactions'
        nextKey?: string | null
        items: Array<{
            __typename?: 'Tx'
            baseFeePerGas?: string | null
            blockHash?: string | null
            blockNumber?: number | null
            contractAddress?: string | null
            from: string
            gas: string
            gasPrice: string
            gasUsed?: string | null
            hash: string
            input: string
            maxFeePerGas?: string | null
            maxPriorityFeePerGas?: string | null
            nonce: number
            r?: string | null
            replacedBy?: string | null
            s?: string | null
            status?: string | null
            timestamp?: number | null
            to?: string | null
            transactionIndex?: number | null
            v?: string | null
            value: string
            logs: Array<{ __typename?: 'Log'; address: string; data: string; logIndex: number; removed: boolean; topics: Array<string>; type?: string | null }>
            trace?: Array<{
                __typename?: 'Trace'
                subtraces?: number | null
                traceAddress?: Array<number> | null
                transactionPosition?: number | null
                type?: string | null
                action?: {
                    __typename?: 'TraceAction'
                    callType?: string | null
                    from?: string | null
                    gas?: string | null
                    input?: string | null
                    to?: string | null
                    value?: string | null
                } | null
                result?: { __typename?: 'TraceResult'; gasUsed?: string | null; output?: string | null } | null
            }> | null
        }>
    }
}

export const PendingTxsFragmentFragmentDoc = gql`
    fragment PendingTxsFragment on Tx {
        baseFeePerGas
        blockHash
        blockNumber
        contractAddress
        from
        gas
        gasPrice
        gasUsed
        hash
        input
        logs {
            address
            data
            logIndex
            removed
            topics
            type
        }
        maxFeePerGas
        maxPriorityFeePerGas
        nonce
        r
        replacedBy
        s
        status
        timestamp
        to
        trace {
            action {
                callType
                from
                gas
                input
                to
                value
            }
            result {
                gasUsed
                output
            }
            subtraces
            traceAddress
            transactionPosition
            type
        }
        transactionIndex
        v
        value
    }
`
export const GetPendingTransactionsDocument = gql`
    query getPendingTransactions($hash: String!, $_limit: Int, $_nextKey: String) {
        getPendingTransactionsV2(owner: $hash, limit: $_limit, nextKey: $_nextKey) {
            items {
                ...PendingTxsFragment
            }
            nextKey
        }
    }
    ${PendingTxsFragmentFragmentDoc}
`

/**
 * __useGetPendingTransactionsQuery__
 *
 * To run a query within a Vue component, call `useGetPendingTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPendingTransactionsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetPendingTransactionsQuery({
 *   hash: // value for 'hash'
 *   _limit: // value for '_limit'
 *   _nextKey: // value for '_nextKey'
 * });
 */
export function useGetPendingTransactionsQuery(
    variables:
        | GetPendingTransactionsQueryVariables
        | VueCompositionApi.Ref<GetPendingTransactionsQueryVariables>
        | ReactiveFunction<GetPendingTransactionsQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetPendingTransactionsQuery, GetPendingTransactionsQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetPendingTransactionsQuery, GetPendingTransactionsQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetPendingTransactionsQuery, GetPendingTransactionsQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetPendingTransactionsQuery, GetPendingTransactionsQueryVariables>(GetPendingTransactionsDocument, variables, options)
}
export function useGetPendingTransactionsLazyQuery(
    variables:
        | GetPendingTransactionsQueryVariables
        | VueCompositionApi.Ref<GetPendingTransactionsQueryVariables>
        | ReactiveFunction<GetPendingTransactionsQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetPendingTransactionsQuery, GetPendingTransactionsQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetPendingTransactionsQuery, GetPendingTransactionsQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetPendingTransactionsQuery, GetPendingTransactionsQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetPendingTransactionsQuery, GetPendingTransactionsQueryVariables>(
        GetPendingTransactionsDocument,
        variables,
        options
    )
}
export type GetPendingTransactionsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<
    GetPendingTransactionsQuery,
    GetPendingTransactionsQueryVariables
>
