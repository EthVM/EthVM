/* eslint-disable */
/**
 * NOTE: THIS IS AN AUTO-GENERATED FILE. DO NOT MODIFY IT DIRECTLY.
 */

import * as Types from '../../../../apollo/types'

import gql from 'graphql-tag'
import * as VueApolloComposable from '@vue/apollo-composable'
import * as VueCompositionApi from 'vue'
export type ReactiveFunction<TParam> = () => TParam
export type BalanceFragmentFragment = { __typename?: 'BalanceDiff'; before: string; after: string }

export type RewardTransferFragment = {
    __typename?: 'EthTransfer'
    value: string
    transfer: { __typename?: 'Transfer'; block: number; timestamp: number; txFee: string }
    stateDiff?: {
        __typename?: 'StateDiffChange'
        to: { __typename?: 'BalanceDiff'; before: string; after: string }
        from?: { __typename?: 'BalanceDiff'; before: string; after: string } | null
    } | null
}

export type RewardSummaryFragment = {
    __typename?: 'ETHTransfers'
    nextKey?: string | null
    transfers: Array<{
        __typename?: 'EthTransfer'
        value: string
        transfer: { __typename?: 'Transfer'; block: number; timestamp: number; txFee: string }
        stateDiff?: {
            __typename?: 'StateDiffChange'
            to: { __typename?: 'BalanceDiff'; before: string; after: string }
            from?: { __typename?: 'BalanceDiff'; before: string; after: string } | null
        } | null
    } | null>
}

export type GetAddrRewardsBlockQueryVariables = Types.Exact<{
    hash: Types.Scalars['String']
    _limit?: Types.InputMaybe<Types.Scalars['Int']>
    _nextKey?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetAddrRewardsBlockQuery = {
    __typename?: 'Query'
    getBlockRewards: {
        __typename?: 'ETHTransfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'EthTransfer'
            value: string
            transfer: { __typename?: 'Transfer'; block: number; timestamp: number; txFee: string }
            stateDiff?: {
                __typename?: 'StateDiffChange'
                to: { __typename?: 'BalanceDiff'; before: string; after: string }
                from?: { __typename?: 'BalanceDiff'; before: string; after: string } | null
            } | null
        } | null>
    }
}

export type GetAddrRewardsUncleQueryVariables = Types.Exact<{
    hash: Types.Scalars['String']
    _limit?: Types.InputMaybe<Types.Scalars['Int']>
    _nextKey?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetAddrRewardsUncleQuery = {
    __typename?: 'Query'
    getUncleRewards: {
        __typename?: 'ETHTransfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'EthTransfer'
            value: string
            transfer: { __typename?: 'Transfer'; block: number; timestamp: number; txFee: string }
            stateDiff?: {
                __typename?: 'StateDiffChange'
                to: { __typename?: 'BalanceDiff'; before: string; after: string }
                from?: { __typename?: 'BalanceDiff'; before: string; after: string } | null
            } | null
        } | null>
    }
}

export type GetAddrRewardsGenesisQueryVariables = Types.Exact<{
    hash: Types.Scalars['String']
    _limit?: Types.InputMaybe<Types.Scalars['Int']>
    _nextKey?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetAddrRewardsGenesisQuery = {
    __typename?: 'Query'
    getGenesisRewards: {
        __typename?: 'ETHTransfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'EthTransfer'
            value: string
            transfer: { __typename?: 'Transfer'; block: number; timestamp: number; txFee: string }
            stateDiff?: {
                __typename?: 'StateDiffChange'
                to: { __typename?: 'BalanceDiff'; before: string; after: string }
                from?: { __typename?: 'BalanceDiff'; before: string; after: string } | null
            } | null
        } | null>
    }
}

export type GetBlockUncleRewardsQueryVariables = Types.Exact<{
    blockRef: Types.Scalars['Int']
}>

export type GetBlockUncleRewardsQuery = {
    __typename?: 'Query'
    getBlockByNumber: { __typename?: 'Block'; summary: { __typename?: 'BlockSummary'; rewards: { __typename?: 'BlockRewards'; uncles: string } } }
}

export const BalanceFragmentFragmentDoc = gql`
    fragment BalanceFragment on BalanceDiff {
        before
        after
    }
`
export const RewardTransferFragmentDoc = gql`
    fragment RewardTransfer on EthTransfer {
        transfer {
            block
            timestamp
            txFee
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
    ${BalanceFragmentFragmentDoc}
`
export const RewardSummaryFragmentDoc = gql`
    fragment RewardSummary on ETHTransfers {
        transfers {
            ...RewardTransfer
        }
        nextKey
    }
    ${RewardTransferFragmentDoc}
`
export const GetAddrRewardsBlockDocument = gql`
    query getAddrRewardsBlock($hash: String!, $_limit: Int, $_nextKey: String) {
        getBlockRewards(owner: $hash, limit: $_limit, nextKey: $_nextKey) {
            ...RewardSummary
        }
    }
    ${RewardSummaryFragmentDoc}
`

/**
 * __useGetAddrRewardsBlockQuery__
 *
 * To run a query within a Vue component, call `useGetAddrRewardsBlockQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAddrRewardsBlockQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetAddrRewardsBlockQuery({
 *   hash: // value for 'hash'
 *   _limit: // value for '_limit'
 *   _nextKey: // value for '_nextKey'
 * });
 */
export function useGetAddrRewardsBlockQuery(
    variables:
        | GetAddrRewardsBlockQueryVariables
        | VueCompositionApi.Ref<GetAddrRewardsBlockQueryVariables>
        | ReactiveFunction<GetAddrRewardsBlockQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetAddrRewardsBlockQuery, GetAddrRewardsBlockQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetAddrRewardsBlockQuery, GetAddrRewardsBlockQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetAddrRewardsBlockQuery, GetAddrRewardsBlockQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetAddrRewardsBlockQuery, GetAddrRewardsBlockQueryVariables>(GetAddrRewardsBlockDocument, variables, options)
}
export function useGetAddrRewardsBlockLazyQuery(
    variables:
        | GetAddrRewardsBlockQueryVariables
        | VueCompositionApi.Ref<GetAddrRewardsBlockQueryVariables>
        | ReactiveFunction<GetAddrRewardsBlockQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetAddrRewardsBlockQuery, GetAddrRewardsBlockQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetAddrRewardsBlockQuery, GetAddrRewardsBlockQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetAddrRewardsBlockQuery, GetAddrRewardsBlockQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetAddrRewardsBlockQuery, GetAddrRewardsBlockQueryVariables>(GetAddrRewardsBlockDocument, variables, options)
}
export type GetAddrRewardsBlockQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetAddrRewardsBlockQuery, GetAddrRewardsBlockQueryVariables>
export const GetAddrRewardsUncleDocument = gql`
    query getAddrRewardsUncle($hash: String!, $_limit: Int, $_nextKey: String) {
        getUncleRewards(owner: $hash, limit: $_limit, nextKey: $_nextKey) {
            ...RewardSummary
        }
    }
    ${RewardSummaryFragmentDoc}
`

/**
 * __useGetAddrRewardsUncleQuery__
 *
 * To run a query within a Vue component, call `useGetAddrRewardsUncleQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAddrRewardsUncleQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetAddrRewardsUncleQuery({
 *   hash: // value for 'hash'
 *   _limit: // value for '_limit'
 *   _nextKey: // value for '_nextKey'
 * });
 */
export function useGetAddrRewardsUncleQuery(
    variables:
        | GetAddrRewardsUncleQueryVariables
        | VueCompositionApi.Ref<GetAddrRewardsUncleQueryVariables>
        | ReactiveFunction<GetAddrRewardsUncleQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetAddrRewardsUncleQuery, GetAddrRewardsUncleQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetAddrRewardsUncleQuery, GetAddrRewardsUncleQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetAddrRewardsUncleQuery, GetAddrRewardsUncleQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetAddrRewardsUncleQuery, GetAddrRewardsUncleQueryVariables>(GetAddrRewardsUncleDocument, variables, options)
}
export function useGetAddrRewardsUncleLazyQuery(
    variables:
        | GetAddrRewardsUncleQueryVariables
        | VueCompositionApi.Ref<GetAddrRewardsUncleQueryVariables>
        | ReactiveFunction<GetAddrRewardsUncleQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetAddrRewardsUncleQuery, GetAddrRewardsUncleQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetAddrRewardsUncleQuery, GetAddrRewardsUncleQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetAddrRewardsUncleQuery, GetAddrRewardsUncleQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetAddrRewardsUncleQuery, GetAddrRewardsUncleQueryVariables>(GetAddrRewardsUncleDocument, variables, options)
}
export type GetAddrRewardsUncleQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetAddrRewardsUncleQuery, GetAddrRewardsUncleQueryVariables>
export const GetAddrRewardsGenesisDocument = gql`
    query getAddrRewardsGenesis($hash: String!, $_limit: Int, $_nextKey: String) {
        getGenesisRewards(owner: $hash, limit: $_limit, nextKey: $_nextKey) {
            ...RewardSummary
        }
    }
    ${RewardSummaryFragmentDoc}
`

/**
 * __useGetAddrRewardsGenesisQuery__
 *
 * To run a query within a Vue component, call `useGetAddrRewardsGenesisQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAddrRewardsGenesisQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetAddrRewardsGenesisQuery({
 *   hash: // value for 'hash'
 *   _limit: // value for '_limit'
 *   _nextKey: // value for '_nextKey'
 * });
 */
export function useGetAddrRewardsGenesisQuery(
    variables:
        | GetAddrRewardsGenesisQueryVariables
        | VueCompositionApi.Ref<GetAddrRewardsGenesisQueryVariables>
        | ReactiveFunction<GetAddrRewardsGenesisQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetAddrRewardsGenesisQuery, GetAddrRewardsGenesisQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetAddrRewardsGenesisQuery, GetAddrRewardsGenesisQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetAddrRewardsGenesisQuery, GetAddrRewardsGenesisQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetAddrRewardsGenesisQuery, GetAddrRewardsGenesisQueryVariables>(GetAddrRewardsGenesisDocument, variables, options)
}
export function useGetAddrRewardsGenesisLazyQuery(
    variables:
        | GetAddrRewardsGenesisQueryVariables
        | VueCompositionApi.Ref<GetAddrRewardsGenesisQueryVariables>
        | ReactiveFunction<GetAddrRewardsGenesisQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetAddrRewardsGenesisQuery, GetAddrRewardsGenesisQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetAddrRewardsGenesisQuery, GetAddrRewardsGenesisQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetAddrRewardsGenesisQuery, GetAddrRewardsGenesisQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetAddrRewardsGenesisQuery, GetAddrRewardsGenesisQueryVariables>(GetAddrRewardsGenesisDocument, variables, options)
}
export type GetAddrRewardsGenesisQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<
    GetAddrRewardsGenesisQuery,
    GetAddrRewardsGenesisQueryVariables
>
export const GetBlockUncleRewardsDocument = gql`
    query getBlockUncleRewards($blockRef: Int!) {
        getBlockByNumber(number: $blockRef) {
            summary {
                rewards {
                    uncles
                }
            }
        }
    }
`

/**
 * __useGetBlockUncleRewardsQuery__
 *
 * To run a query within a Vue component, call `useGetBlockUncleRewardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBlockUncleRewardsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetBlockUncleRewardsQuery({
 *   blockRef: // value for 'blockRef'
 * });
 */
export function useGetBlockUncleRewardsQuery(
    variables:
        | GetBlockUncleRewardsQueryVariables
        | VueCompositionApi.Ref<GetBlockUncleRewardsQueryVariables>
        | ReactiveFunction<GetBlockUncleRewardsQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetBlockUncleRewardsQuery, GetBlockUncleRewardsQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetBlockUncleRewardsQuery, GetBlockUncleRewardsQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetBlockUncleRewardsQuery, GetBlockUncleRewardsQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetBlockUncleRewardsQuery, GetBlockUncleRewardsQueryVariables>(GetBlockUncleRewardsDocument, variables, options)
}
export function useGetBlockUncleRewardsLazyQuery(
    variables:
        | GetBlockUncleRewardsQueryVariables
        | VueCompositionApi.Ref<GetBlockUncleRewardsQueryVariables>
        | ReactiveFunction<GetBlockUncleRewardsQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetBlockUncleRewardsQuery, GetBlockUncleRewardsQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetBlockUncleRewardsQuery, GetBlockUncleRewardsQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetBlockUncleRewardsQuery, GetBlockUncleRewardsQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetBlockUncleRewardsQuery, GetBlockUncleRewardsQueryVariables>(GetBlockUncleRewardsDocument, variables, options)
}
export type GetBlockUncleRewardsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<
    GetBlockUncleRewardsQuery,
    GetBlockUncleRewardsQueryVariables
>
