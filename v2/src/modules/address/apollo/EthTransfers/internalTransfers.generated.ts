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
export type InternalTransactionTransferFragment = {
    __typename?: 'Transfer'
    transactionHash: string
    block: number
    timestamp: number
    from: string
    to: string
    txFee: string
    status?: boolean | null
}

export type EthInternalTransactionTransfersFragment = {
    __typename?: 'EthTransfer'
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
}

export type GetEthInternalTransactionTransfersQueryVariables = Types.Exact<{
    hash: Types.Scalars['String']
    _limit?: Types.InputMaybe<Types.Scalars['Int']>
    _nextKey?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetEthInternalTransactionTransfersQuery = {
    __typename?: 'Query'
    getEthInternalTransactionTransfers: {
        __typename?: 'ETHTransfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'EthTransfer'
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
        } | null>
    }
}

export const InternalTransactionTransferFragmentDoc = gql`
    fragment InternalTransactionTransfer on Transfer {
        transactionHash
        block
        timestamp
        from
        to
        txFee
        status
    }
`
export const EthInternalTransactionTransfersFragmentDoc = gql`
    fragment EthInternalTransactionTransfers on EthTransfer {
        transfer {
            ...InternalTransactionTransfer
        }
        stateDiff {
            to {
                ...BalanceFragment
            }
            from {
                ...BalanceFragment
            }
        }
        value
    }
    ${InternalTransactionTransferFragmentDoc}
    ${BalanceFragmentFragmentDoc}
`
export const GetEthInternalTransactionTransfersDocument = gql`
    query getEthInternalTransactionTransfers($hash: String!, $_limit: Int, $_nextKey: String) {
        getEthInternalTransactionTransfers(owner: $hash, limit: $_limit, nextKey: $_nextKey) {
            transfers {
                ...EthInternalTransactionTransfers
            }
            nextKey
        }
    }
    ${EthInternalTransactionTransfersFragmentDoc}
`

/**
 * __useGetEthInternalTransactionTransfersQuery__
 *
 * To run a query within a Vue component, call `useGetEthInternalTransactionTransfersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEthInternalTransactionTransfersQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetEthInternalTransactionTransfersQuery({
 *   hash: // value for 'hash'
 *   _limit: // value for '_limit'
 *   _nextKey: // value for '_nextKey'
 * });
 */
export function useGetEthInternalTransactionTransfersQuery(
    variables:
        | GetEthInternalTransactionTransfersQueryVariables
        | VueCompositionApi.Ref<GetEthInternalTransactionTransfersQueryVariables>
        | ReactiveFunction<GetEthInternalTransactionTransfersQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetEthInternalTransactionTransfersQuery, GetEthInternalTransactionTransfersQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetEthInternalTransactionTransfersQuery, GetEthInternalTransactionTransfersQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetEthInternalTransactionTransfersQuery, GetEthInternalTransactionTransfersQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetEthInternalTransactionTransfersQuery, GetEthInternalTransactionTransfersQueryVariables>(
        GetEthInternalTransactionTransfersDocument,
        variables,
        options
    )
}
export function useGetEthInternalTransactionTransfersLazyQuery(
    variables:
        | GetEthInternalTransactionTransfersQueryVariables
        | VueCompositionApi.Ref<GetEthInternalTransactionTransfersQueryVariables>
        | ReactiveFunction<GetEthInternalTransactionTransfersQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetEthInternalTransactionTransfersQuery, GetEthInternalTransactionTransfersQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetEthInternalTransactionTransfersQuery, GetEthInternalTransactionTransfersQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetEthInternalTransactionTransfersQuery, GetEthInternalTransactionTransfersQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetEthInternalTransactionTransfersQuery, GetEthInternalTransactionTransfersQueryVariables>(
        GetEthInternalTransactionTransfersDocument,
        variables,
        options
    )
}
export type GetEthInternalTransactionTransfersQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<
    GetEthInternalTransactionTransfersQuery,
    GetEthInternalTransactionTransfersQueryVariables
>
