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
export type ItxTransferFragment = {
    __typename?: 'Transfer'
    transactionHash: string
    block: number
    timestamp: number
    from: string
    to: string
    txFee: string
    status?: boolean | null
}

export type EthItxTransfersFragment = {
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

export type GetEthItxTransfersQueryVariables = Types.Exact<{
    hash: Types.Scalars['String']
    _limit?: Types.InputMaybe<Types.Scalars['Int']>
    _nextKey?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetEthItxTransfersQuery = {
    __typename?: 'Query'
    getEthItxTransfers: {
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

export const ItxTransferFragmentDoc = gql`
    fragment ItxTransfer on Transfer {
        transactionHash
        block
        timestamp
        from
        to
        txFee
        status
    }
`
export const EthItxTransfersFragmentDoc = gql`
    fragment EthItxTransfers on EthTransfer {
        transfer {
            ...ItxTransfer
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
    ${ItxTransferFragmentDoc}
    ${BalanceFragmentFragmentDoc}
`
export const GetEthItxTransfersDocument = gql`
    query getEthItxTransfers($hash: String!, $_limit: Int, $_nextKey: String) {
        getEthItxTransfers(owner: $hash, limit: $_limit, nextKey: $_nextKey) {
            transfers {
                ...EthItxTransfers
            }
            nextKey
        }
    }
    ${EthItxTransfersFragmentDoc}
`

/**
 * __useGetEthItxTransfersQuery__
 *
 * To run a query within a Vue component, call `useGetEthItxTransfersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEthItxTransfersQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetEthItxTransfersQuery({
 *   hash: // value for 'hash'
 *   _limit: // value for '_limit'
 *   _nextKey: // value for '_nextKey'
 * });
 */
export function useGetEthItxTransfersQuery(
    variables: GetEthItxTransfersQueryVariables | VueCompositionApi.Ref<GetEthItxTransfersQueryVariables> | ReactiveFunction<GetEthItxTransfersQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetEthItxTransfersQuery, GetEthItxTransfersQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetEthItxTransfersQuery, GetEthItxTransfersQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetEthItxTransfersQuery, GetEthItxTransfersQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetEthItxTransfersQuery, GetEthItxTransfersQueryVariables>(GetEthItxTransfersDocument, variables, options)
}
export function useGetEthItxTransfersLazyQuery(
    variables: GetEthItxTransfersQueryVariables | VueCompositionApi.Ref<GetEthItxTransfersQueryVariables> | ReactiveFunction<GetEthItxTransfersQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetEthItxTransfersQuery, GetEthItxTransfersQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetEthItxTransfersQuery, GetEthItxTransfersQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetEthItxTransfersQuery, GetEthItxTransfersQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetEthItxTransfersQuery, GetEthItxTransfersQueryVariables>(GetEthItxTransfersDocument, variables, options)
}
export type GetEthItxTransfersQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetEthItxTransfersQuery, GetEthItxTransfersQueryVariables>
