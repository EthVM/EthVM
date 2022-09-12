/* eslint-disable */
/**
 * NOTE: THIS IS AN AUTO-GENERATED FILE. DO NOT MODIFY IT DIRECTLY.
 */

import * as Types from '../../../apollo/types'

import gql from 'graphql-tag'
import * as VueApolloComposable from '@vue/apollo-composable'
import * as VueCompositionApi from 'vue'
export type ReactiveFunction<TParam> = () => TParam
export type TxSummaryFragment = {
    __typename?: 'ETHTransfers'
    transfers: Array<{
        __typename?: 'EthTransfer'
        value: string
        transfer: {
            __typename?: 'Transfer'
            transactionHash: string
            to: string
            block: number
            timestamp: number
            from: string
            txFee: string
            status?: boolean | null
        }
    } | null>
}

export type SummaryFragment = {
    __typename?: 'Transfer'
    transactionHash: string
    to: string
    block: number
    timestamp: number
    from: string
    txFee: string
    status?: boolean | null
}

export type GetBlockTransfersQueryVariables = Types.Exact<{
    _number?: Types.InputMaybe<Types.Scalars['Int']>
}>

export type GetBlockTransfersQuery = {
    __typename?: 'Query'
    getBlockTransfers: {
        __typename?: 'ETHTransfers'
        transfers: Array<{
            __typename?: 'EthTransfer'
            value: string
            transfer: {
                __typename?: 'Transfer'
                transactionHash: string
                to: string
                block: number
                timestamp: number
                from: string
                txFee: string
                status?: boolean | null
            }
        } | null>
    }
}

export type EthTransfersFragment = {
    __typename?: 'ETHTransfers'
    nextKey?: string | null
    transfers: Array<{
        __typename?: 'EthTransfer'
        value: string
        transfer: {
            __typename?: 'Transfer'
            transactionHash: string
            to: string
            block: number
            timestamp: number
            from: string
            txFee: string
            status?: boolean | null
        }
    } | null>
}

export type GetAllTxsQueryVariables = Types.Exact<{
    _limit?: Types.InputMaybe<Types.Scalars['Int']>
    _nextKey?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetAllTxsQuery = {
    __typename?: 'Query'
    getAllEthTransfers: {
        __typename?: 'ETHTransfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'EthTransfer'
            value: string
            transfer: {
                __typename?: 'Transfer'
                transactionHash: string
                to: string
                block: number
                timestamp: number
                from: string
                txFee: string
                status?: boolean | null
            }
        } | null>
    }
}

export type NewTransfersCompleteFeedSubscriptionVariables = Types.Exact<{ [key: string]: never }>

export type NewTransfersCompleteFeedSubscription = {
    __typename?: 'Subscription'
    newTransfersCompleteFeed: { __typename?: 'TransferComplete'; block: number; type: Types.TransferType }
}

export const SummaryFragmentDoc = gql`
    fragment Summary on Transfer {
        transactionHash
        to
        block
        timestamp
        from
        txFee
        status
    }
`
export const TxSummaryFragmentDoc = gql`
    fragment TxSummary on ETHTransfers {
        transfers {
            transfer {
                ...Summary
            }
            value
        }
    }
    ${SummaryFragmentDoc}
`
export const EthTransfersFragmentDoc = gql`
    fragment EthTransfers on ETHTransfers {
        ...TxSummary
        nextKey
    }
    ${TxSummaryFragmentDoc}
`
export const GetBlockTransfersDocument = gql`
    query getBlockTransfers($_number: Int) {
        getBlockTransfers(number: $_number) {
            ...TxSummary
        }
    }
    ${TxSummaryFragmentDoc}
`

/**
 * __useGetBlockTransfersQuery__
 *
 * To run a query within a Vue component, call `useGetBlockTransfersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBlockTransfersQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetBlockTransfersQuery({
 *   _number: // value for '_number'
 * });
 */
export function useGetBlockTransfersQuery(
    variables:
        | GetBlockTransfersQueryVariables
        | VueCompositionApi.Ref<GetBlockTransfersQueryVariables>
        | ReactiveFunction<GetBlockTransfersQueryVariables> = {},
    options:
        | VueApolloComposable.UseQueryOptions<GetBlockTransfersQuery, GetBlockTransfersQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetBlockTransfersQuery, GetBlockTransfersQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetBlockTransfersQuery, GetBlockTransfersQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetBlockTransfersQuery, GetBlockTransfersQueryVariables>(GetBlockTransfersDocument, variables, options)
}
export function useGetBlockTransfersLazyQuery(
    variables:
        | GetBlockTransfersQueryVariables
        | VueCompositionApi.Ref<GetBlockTransfersQueryVariables>
        | ReactiveFunction<GetBlockTransfersQueryVariables> = {},
    options:
        | VueApolloComposable.UseQueryOptions<GetBlockTransfersQuery, GetBlockTransfersQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetBlockTransfersQuery, GetBlockTransfersQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetBlockTransfersQuery, GetBlockTransfersQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetBlockTransfersQuery, GetBlockTransfersQueryVariables>(GetBlockTransfersDocument, variables, options)
}
export type GetBlockTransfersQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetBlockTransfersQuery, GetBlockTransfersQueryVariables>
export const GetAllTxsDocument = gql`
    query getAllTxs($_limit: Int, $_nextKey: String) {
        getAllEthTransfers(limit: $_limit, nextKey: $_nextKey) {
            ...EthTransfers
        }
    }
    ${EthTransfersFragmentDoc}
`

/**
 * __useGetAllTxsQuery__
 *
 * To run a query within a Vue component, call `useGetAllTxsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllTxsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetAllTxsQuery({
 *   _limit: // value for '_limit'
 *   _nextKey: // value for '_nextKey'
 * });
 */
export function useGetAllTxsQuery(
    variables: GetAllTxsQueryVariables | VueCompositionApi.Ref<GetAllTxsQueryVariables> | ReactiveFunction<GetAllTxsQueryVariables> = {},
    options:
        | VueApolloComposable.UseQueryOptions<GetAllTxsQuery, GetAllTxsQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetAllTxsQuery, GetAllTxsQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetAllTxsQuery, GetAllTxsQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetAllTxsQuery, GetAllTxsQueryVariables>(GetAllTxsDocument, variables, options)
}
export function useGetAllTxsLazyQuery(
    variables: GetAllTxsQueryVariables | VueCompositionApi.Ref<GetAllTxsQueryVariables> | ReactiveFunction<GetAllTxsQueryVariables> = {},
    options:
        | VueApolloComposable.UseQueryOptions<GetAllTxsQuery, GetAllTxsQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetAllTxsQuery, GetAllTxsQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetAllTxsQuery, GetAllTxsQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetAllTxsQuery, GetAllTxsQueryVariables>(GetAllTxsDocument, variables, options)
}
export type GetAllTxsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetAllTxsQuery, GetAllTxsQueryVariables>
export const NewTransfersCompleteFeedDocument = gql`
    subscription newTransfersCompleteFeed {
        newTransfersCompleteFeed {
            block
            type
        }
    }
`

/**
 * __useNewTransfersCompleteFeedSubscription__
 *
 * To run a query within a Vue component, call `useNewTransfersCompleteFeedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewTransfersCompleteFeedSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useNewTransfersCompleteFeedSubscription();
 */
export function useNewTransfersCompleteFeedSubscription(
    options:
        | VueApolloComposable.UseSubscriptionOptions<NewTransfersCompleteFeedSubscription, NewTransfersCompleteFeedSubscriptionVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<NewTransfersCompleteFeedSubscription, NewTransfersCompleteFeedSubscriptionVariables>>
        | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<NewTransfersCompleteFeedSubscription, NewTransfersCompleteFeedSubscriptionVariables>> = {}
) {
    return VueApolloComposable.useSubscription<NewTransfersCompleteFeedSubscription, NewTransfersCompleteFeedSubscriptionVariables>(
        NewTransfersCompleteFeedDocument,
        {},
        options
    )
}
export type NewTransfersCompleteFeedSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<
    NewTransfersCompleteFeedSubscription,
    NewTransfersCompleteFeedSubscriptionVariables
>
