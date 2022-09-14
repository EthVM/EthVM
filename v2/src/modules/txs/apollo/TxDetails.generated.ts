/* eslint-disable */
/**
 * NOTE: THIS IS AN AUTO-GENERATED FILE. DO NOT MODIFY IT DIRECTLY.
 */

import * as Types from '../../../apollo/types'

import gql from 'graphql-tag'
import * as VueApolloComposable from '@vue/apollo-composable'
import * as VueCompositionApi from 'vue'
export type ReactiveFunction<TParam> = () => TParam
export type TxDetailsFragment = {
    __typename?: 'Tx'
    blockNumber?: number | null
    from: string
    gas: string
    gasPrice: string
    gasUsed?: string | null
    timestamp?: number | null
    hash: string
    input: string
    status?: string | null
    nonce: number
    to?: string | null
    transactionIndex?: number | null
    value: string
    replacedBy?: string | null
    contractAddress?: string | null
}

export type GetTransactionByHashQueryVariables = Types.Exact<{
    hash: Types.Scalars['String']
}>

export type GetTransactionByHashQuery = {
    __typename?: 'Query'
    getTransactionByHash: {
        __typename?: 'Tx'
        blockNumber?: number | null
        from: string
        gas: string
        gasPrice: string
        gasUsed?: string | null
        timestamp?: number | null
        hash: string
        input: string
        status?: string | null
        nonce: number
        to?: string | null
        transactionIndex?: number | null
        value: string
        replacedBy?: string | null
        contractAddress?: string | null
    }
}

export type TransactionEventSubscriptionVariables = Types.Exact<{
    hash: Types.Scalars['String']
}>

export type TransactionEventSubscription = { __typename?: 'Subscription'; transactionEvent: string }

export const TxDetailsFragmentDoc = gql`
    fragment TxDetails on Tx {
        blockNumber
        from
        gas
        gasPrice
        gasUsed
        timestamp
        hash
        input
        status
        nonce
        to
        transactionIndex
        value
        replacedBy
        contractAddress
    }
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
