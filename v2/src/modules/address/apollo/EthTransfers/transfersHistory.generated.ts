/* eslint-disable */
/**
 * NOTE: THIS IS AN AUTO-GENERATED FILE. DO NOT MODIFY IT DIRECTLY.
 */

import * as Types from '../../../../apollo/types'

import gql from 'graphql-tag'
import { BalanceFragmentFragmentDoc } from '../AddressRewards/rewards.generated'
import * as VueApolloComposable from '@vue/apollo-composable'
import * as VueCompositionApi from 'vue'
export type ReactiveFunction<TParam> = () => TParam
export type TransfersFragment = {
    __typename?: 'Transfer'
    transactionHash: string
    block: number
    timestamp: number
    from: string
    to: string
    txFee: string
    status?: boolean | null
}

export type TxsTransfersFragment = {
    __typename?: 'ETHTransactionTransfer'
    value: string
    transfer: {
        __typename?: 'Transfer'
        transactionHash: string
        block: number
        timestamp: number
        from: string
        to: string
        txFee: string
        status?: boolean | null
    }
    stateDiff?: {
        __typename?: 'StateDiffChange'
        to: { __typename?: 'BalanceDiff'; before: string; after: string }
        from?: { __typename?: 'BalanceDiff'; before: string; after: string } | null
    } | null
    transactionStateDiff: {
        __typename?: 'TransactionStateDiffChange'
        to: { __typename?: 'BalanceDiff'; before: string; after: string }
        from?: { __typename?: 'BalanceDiff'; before: string; after: string } | null
    }
}

export type GetEthTransactionTransfersQueryVariables = Types.Exact<{
    hash: Types.Scalars['String']
    _limit?: Types.InputMaybe<Types.Scalars['Int']>
    _nextKey?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetEthTransactionTransfersQuery = {
    __typename?: 'Query'
    getEthTransactionTransfers: {
        __typename?: 'ETHTransactionTransfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'ETHTransactionTransfer'
            value: string
            transfer: {
                __typename?: 'Transfer'
                transactionHash: string
                block: number
                timestamp: number
                from: string
                to: string
                txFee: string
                status?: boolean | null
            }
            stateDiff?: {
                __typename?: 'StateDiffChange'
                to: { __typename?: 'BalanceDiff'; before: string; after: string }
                from?: { __typename?: 'BalanceDiff'; before: string; after: string } | null
            } | null
            transactionStateDiff: {
                __typename?: 'TransactionStateDiffChange'
                to: { __typename?: 'BalanceDiff'; before: string; after: string }
                from?: { __typename?: 'BalanceDiff'; before: string; after: string } | null
            }
        }>
    }
}

export const TransfersFragmentDoc = gql`
    fragment Transfers on Transfer {
        transactionHash
        block
        timestamp
        from
        to
        txFee
        status
    }
`
export const TxsTransfersFragmentDoc = gql`
    fragment TxsTransfers on ETHTransactionTransfer {
        transfer {
            ...Transfers
        }
        stateDiff {
            to {
                ...BalanceFragment
            }
            from {
                ...BalanceFragment
            }
        }
        transactionStateDiff {
            to {
                ...BalanceFragment
            }
            from {
                ...BalanceFragment
            }
        }
        value
    }
    ${TransfersFragmentDoc}
    ${BalanceFragmentFragmentDoc}
`
export const GetEthTransactionTransfersDocument = gql`
    query getEthTransactionTransfers($hash: String!, $_limit: Int, $_nextKey: String) {
        getEthTransactionTransfers(owner: $hash, limit: $_limit, nextKey: $_nextKey) {
            transfers {
                ...TxsTransfers
            }
            nextKey
        }
    }
    ${TxsTransfersFragmentDoc}
`

/**
 * __useGetEthTransactionTransfersQuery__
 *
 * To run a query within a Vue component, call `useGetEthTransactionTransfersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEthTransactionTransfersQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetEthTransactionTransfersQuery({
 *   hash: // value for 'hash'
 *   _limit: // value for '_limit'
 *   _nextKey: // value for '_nextKey'
 * });
 */
export function useGetEthTransactionTransfersQuery(
    variables:
        | GetEthTransactionTransfersQueryVariables
        | VueCompositionApi.Ref<GetEthTransactionTransfersQueryVariables>
        | ReactiveFunction<GetEthTransactionTransfersQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetEthTransactionTransfersQuery, GetEthTransactionTransfersQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetEthTransactionTransfersQuery, GetEthTransactionTransfersQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetEthTransactionTransfersQuery, GetEthTransactionTransfersQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetEthTransactionTransfersQuery, GetEthTransactionTransfersQueryVariables>(
        GetEthTransactionTransfersDocument,
        variables,
        options
    )
}
export function useGetEthTransactionTransfersLazyQuery(
    variables:
        | GetEthTransactionTransfersQueryVariables
        | VueCompositionApi.Ref<GetEthTransactionTransfersQueryVariables>
        | ReactiveFunction<GetEthTransactionTransfersQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetEthTransactionTransfersQuery, GetEthTransactionTransfersQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetEthTransactionTransfersQuery, GetEthTransactionTransfersQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetEthTransactionTransfersQuery, GetEthTransactionTransfersQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetEthTransactionTransfersQuery, GetEthTransactionTransfersQueryVariables>(
        GetEthTransactionTransfersDocument,
        variables,
        options
    )
}
export type GetEthTransactionTransfersQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<
    GetEthTransactionTransfersQuery,
    GetEthTransactionTransfersQueryVariables
>
