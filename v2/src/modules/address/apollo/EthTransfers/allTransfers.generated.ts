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
export type AllTransfersFragment = {
    __typename?: 'Transfer'
    transactionHash: string
    block: number
    timestamp: number
    from: string
    to: string
    txFee: string
    status?: boolean | null
}

export type AllEthTransfersFragment = {
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

export type GetAllEthTransfersQueryVariables = Types.Exact<{
    hash: Types.Scalars['String']
    _limit?: Types.InputMaybe<Types.Scalars['Int']>
    _nextKey?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetAllEthTransfersQuery = {
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

export const AllTransfersFragmentDoc = gql`
    fragment AllTransfers on Transfer {
        transactionHash
        block
        timestamp
        from
        to
        txFee
        status
    }
`
export const AllEthTransfersFragmentDoc = gql`
    fragment AllEthTransfers on EthTransfer {
        transfer {
            ...AllTransfers
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
    ${AllTransfersFragmentDoc}
    ${BalanceFragmentFragmentDoc}
`
export const GetAllEthTransfersDocument = gql`
    query getAllEthTransfers($hash: String!, $_limit: Int, $_nextKey: String) {
        getAllEthTransfers(owner: $hash, limit: $_limit, nextKey: $_nextKey) {
            transfers {
                ...AllEthTransfers
            }
            nextKey
        }
    }
    ${AllEthTransfersFragmentDoc}
`

/**
 * __useGetAllEthTransfersQuery__
 *
 * To run a query within a Vue component, call `useGetAllEthTransfersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllEthTransfersQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetAllEthTransfersQuery({
 *   hash: // value for 'hash'
 *   _limit: // value for '_limit'
 *   _nextKey: // value for '_nextKey'
 * });
 */
export function useGetAllEthTransfersQuery(
    variables: GetAllEthTransfersQueryVariables | VueCompositionApi.Ref<GetAllEthTransfersQueryVariables> | ReactiveFunction<GetAllEthTransfersQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetAllEthTransfersQuery, GetAllEthTransfersQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetAllEthTransfersQuery, GetAllEthTransfersQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetAllEthTransfersQuery, GetAllEthTransfersQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetAllEthTransfersQuery, GetAllEthTransfersQueryVariables>(GetAllEthTransfersDocument, variables, options)
}
export function useGetAllEthTransfersLazyQuery(
    variables: GetAllEthTransfersQueryVariables | VueCompositionApi.Ref<GetAllEthTransfersQueryVariables> | ReactiveFunction<GetAllEthTransfersQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetAllEthTransfersQuery, GetAllEthTransfersQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetAllEthTransfersQuery, GetAllEthTransfersQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetAllEthTransfersQuery, GetAllEthTransfersQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetAllEthTransfersQuery, GetAllEthTransfersQueryVariables>(GetAllEthTransfersDocument, variables, options)
}
export type GetAllEthTransfersQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetAllEthTransfersQuery, GetAllEthTransfersQueryVariables>
