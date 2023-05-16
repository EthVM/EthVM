/* eslint-disable */
/**
 * NOTE: THIS IS AN AUTO-GENERATED FILE. DO NOT MODIFY IT DIRECTLY.
 */

import * as Types from '../../../../apollo/types'

import gql from 'graphql-tag'
import * as VueApolloComposable from '@vue/apollo-composable'
import * as VueCompositionApi from 'vue'
export type ReactiveFunction<TParam> = () => TParam
export type LogFragmentFragment = {
    __typename?: 'Log'
    address: string
    data: string
    logIndex: number
    removed: boolean
    topics: Array<string>
    type?: string | null
}

export type TraceActionFragment = {
    __typename?: 'TraceAction'
    callType?: string | null
    from?: string | null
    gas?: string | null
    input?: string | null
    to?: string | null
    value?: string | null
}

export type TraceResultFragment = { __typename?: 'TraceResult'; gasUsed?: string | null; output?: string | null }

export type TraceFragmentFragment = {
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
}

export type TxDetailsFragment = {
    __typename?: 'Tx'
    blockHash?: string | null
    blockNumber?: number | null
    from: string
    gas: string
    gasPrice: string
    maxFeePerGas?: string | null
    maxPriorityFeePerGas?: string | null
    baseFeePerGas?: string | null
    timestamp?: number | null
    gasUsed?: string | null
    hash: string
    status?: string | null
    input: string
    nonce: number
    to?: string | null
    transactionIndex?: number | null
    value: string
    replacedBy?: string | null
    v?: string | null
    r?: string | null
    s?: string | null
    contractAddress?: string | null
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

export type GetTransactionByHashQueryVariables = Types.Exact<{
    hash: Types.Scalars['String']
}>

export type GetTransactionByHashQuery = {
    __typename?: 'Query'
    getTransactionByHash: {
        __typename?: 'Tx'
        blockHash?: string | null
        blockNumber?: number | null
        from: string
        gas: string
        gasPrice: string
        maxFeePerGas?: string | null
        maxPriorityFeePerGas?: string | null
        baseFeePerGas?: string | null
        timestamp?: number | null
        gasUsed?: string | null
        hash: string
        status?: string | null
        input: string
        nonce: number
        to?: string | null
        transactionIndex?: number | null
        value: string
        replacedBy?: string | null
        v?: string | null
        r?: string | null
        s?: string | null
        contractAddress?: string | null
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
}

export type TransactionEventSubscriptionVariables = Types.Exact<{
    hash: Types.Scalars['String']
}>

export type TransactionEventSubscription = { __typename?: 'Subscription'; transactionEvent: string }

export const LogFragmentFragmentDoc = gql`
    fragment LogFragment on Log {
        address
        data
        logIndex
        removed
        topics
        type
    }
`
export const TraceActionFragmentDoc = gql`
    fragment TraceAction on TraceAction {
        callType
        from
        gas
        input
        to
        value
    }
`
export const TraceResultFragmentDoc = gql`
    fragment TraceResult on TraceResult {
        gasUsed
        output
    }
`
export const TraceFragmentFragmentDoc = gql`
    fragment TraceFragment on Trace {
        action {
            ...TraceAction
        }
        result {
            ...TraceResult
        }
        subtraces
        traceAddress
        transactionPosition
        type
    }
    ${TraceActionFragmentDoc}
    ${TraceResultFragmentDoc}
`
export const TxDetailsFragmentDoc = gql`
    fragment TxDetails on Tx {
        blockHash
        blockNumber
        from
        gas
        gasPrice
        maxFeePerGas
        maxPriorityFeePerGas
        baseFeePerGas
        timestamp
        gasUsed
        hash
        status
        input
        nonce
        to
        transactionIndex
        value
        replacedBy
        v
        r
        s
        contractAddress
        logs {
            ...LogFragment
        }
        trace {
            ...TraceFragment
        }
    }
    ${LogFragmentFragmentDoc}
    ${TraceFragmentFragmentDoc}
`
export const GetTransactionByHashDocument = gql`
    query getTransactionByHash($hash: String!) {
        getTransactionByHash(hash: $hash) {
            ...TxDetails
        }
    }
    ${TxDetailsFragmentDoc}
`

/**
 * __useGetTransactionByHashQuery__
 *
 * To run a query within a Vue component, call `useGetTransactionByHashQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTransactionByHashQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetTransactionByHashQuery({
 *   hash: // value for 'hash'
 * });
 */
export function useGetTransactionByHashQuery(
    variables:
        | GetTransactionByHashQueryVariables
        | VueCompositionApi.Ref<GetTransactionByHashQueryVariables>
        | ReactiveFunction<GetTransactionByHashQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetTransactionByHashQuery, GetTransactionByHashQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetTransactionByHashQuery, GetTransactionByHashQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetTransactionByHashQuery, GetTransactionByHashQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetTransactionByHashQuery, GetTransactionByHashQueryVariables>(GetTransactionByHashDocument, variables, options)
}
export function useGetTransactionByHashLazyQuery(
    variables:
        | GetTransactionByHashQueryVariables
        | VueCompositionApi.Ref<GetTransactionByHashQueryVariables>
        | ReactiveFunction<GetTransactionByHashQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetTransactionByHashQuery, GetTransactionByHashQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetTransactionByHashQuery, GetTransactionByHashQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetTransactionByHashQuery, GetTransactionByHashQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetTransactionByHashQuery, GetTransactionByHashQueryVariables>(GetTransactionByHashDocument, variables, options)
}
export type GetTransactionByHashQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<
    GetTransactionByHashQuery,
    GetTransactionByHashQueryVariables
>
export const TransactionEventDocument = gql`
    subscription transactionEvent($hash: String!) {
        transactionEvent(hash: $hash)
    }
`

/**
 * __useTransactionEventSubscription__
 *
 * To run a query within a Vue component, call `useTransactionEventSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTransactionEventSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the subscription
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useTransactionEventSubscription({
 *   hash: // value for 'hash'
 * });
 */
export function useTransactionEventSubscription(
    variables:
        | TransactionEventSubscriptionVariables
        | VueCompositionApi.Ref<TransactionEventSubscriptionVariables>
        | ReactiveFunction<TransactionEventSubscriptionVariables>,
    options:
        | VueApolloComposable.UseSubscriptionOptions<TransactionEventSubscription, TransactionEventSubscriptionVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<TransactionEventSubscription, TransactionEventSubscriptionVariables>>
        | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<TransactionEventSubscription, TransactionEventSubscriptionVariables>> = {}
) {
    return VueApolloComposable.useSubscription<TransactionEventSubscription, TransactionEventSubscriptionVariables>(
        TransactionEventDocument,
        variables,
        options
    )
}
export type TransactionEventSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<
    TransactionEventSubscription,
    TransactionEventSubscriptionVariables
>
