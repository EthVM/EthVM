/* eslint-disable */
/**
 * NOTE: THIS IS AN AUTO-GENERATED FILE. DO NOT MODIFY IT DIRECTLY.
 */

import * as Types from '../../../../apollo/types'

import gql from 'graphql-tag'
import { BalanceFragmentFragmentDoc } from '../AddressRewards/rewards.generated'
import { TokenFragmentFragmentDoc } from '../AddressTokens/tokens.generated'
import * as VueApolloComposable from '@vue/apollo-composable'
import * as VueCompositionApi from 'vue'
export type ReactiveFunction<TParam> = () => TParam
export type TransferSummaryFragment = { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string }

export type GetAddressEthTransfersQueryVariables = Types.Exact<{
    hash?: Types.InputMaybe<Types.Scalars['String']>
    filter?: Types.InputMaybe<Types.TransferDirection>
    _limit?: Types.InputMaybe<Types.Scalars['Int']>
    _nextKey?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetAddressEthTransfersQuery = {
    __typename?: 'Query'
    getEthTransfersV2: {
        __typename?: 'ETHTransfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'EthTransfer'
            value: string
            transfer: {
                __typename?: 'Transfer'
                block: number
                status?: boolean | null
                transactionHash: string
                timestamp: number
                from: string
                to: string
                txFee: string
            }
            stateDiff?: {
                __typename?: 'StateDiffChange'
                to: { __typename?: 'BalanceDiff'; before: string; after: string }
                from?: { __typename?: 'BalanceDiff'; before: string; after: string } | null
            } | null
        } | null>
    }
}

export type TransferFragmentFragment = {
    __typename?: 'ERC20Transfer'
    value: string
    contract: string
    transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string }
    stateDiff?: {
        __typename?: 'StateDiffChange'
        to: { __typename?: 'BalanceDiff'; before: string; after: string }
        from?: { __typename?: 'BalanceDiff'; before: string; after: string } | null
    } | null
    tokenInfo: { __typename?: 'EthTokenInfo'; name?: string | null; symbol?: string | null; decimals?: number | null }
}

export type GetAddressErc20TransfersQueryVariables = Types.Exact<{
    hash: Types.Scalars['String']
    _limit?: Types.InputMaybe<Types.Scalars['Int']>
    _nextKey?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetAddressErc20TransfersQuery = {
    __typename?: 'Query'
    getERC20Transfers: {
        __typename?: 'ERC20Transfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'ERC20Transfer'
            value: string
            contract: string
            transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string }
            stateDiff?: {
                __typename?: 'StateDiffChange'
                to: { __typename?: 'BalanceDiff'; before: string; after: string }
                from?: { __typename?: 'BalanceDiff'; before: string; after: string } | null
            } | null
            tokenInfo: { __typename?: 'EthTokenInfo'; name?: string | null; symbol?: string | null; decimals?: number | null }
        } | null>
    }
}

export type Erc721TransferFragmentFragment = {
    __typename?: 'ERC721Transfer'
    token: string
    contract: string
    transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string }
    tokenInfo: { __typename?: 'EthTokenInfo'; name?: string | null }
}

export type GetAddressErc721TransfersQueryVariables = Types.Exact<{
    hash: Types.Scalars['String']
    _limit?: Types.InputMaybe<Types.Scalars['Int']>
    _nextKey?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetAddressErc721TransfersQuery = {
    __typename?: 'Query'
    getERC721Transfers: {
        __typename?: 'ERC721Transfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'ERC721Transfer'
            token: string
            contract: string
            transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string }
            tokenInfo: { __typename?: 'EthTokenInfo'; name?: string | null }
        } | null>
    }
}

export type GetTransactionStateDiffQueryVariables = Types.Exact<{
    hash: Types.Scalars['String']
}>

export type GetTransactionStateDiffQuery = {
    __typename?: 'Query'
    getTransactionStateDiff: Array<{ __typename?: 'TxStateDiff'; owner: string; from: string; to: string } | null>
}

export const TransferSummaryFragmentDoc = gql`
    fragment TransferSummary on Transfer {
        transactionHash
        timestamp
        from
        to
        txFee
    }
`
export const TransferFragmentFragmentDoc = gql`
    fragment TransferFragment on ERC20Transfer {
        transfer {
            ...TransferSummary
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
        contract
        tokenInfo {
            ...TokenFragment
        }
    }
    ${TransferSummaryFragmentDoc}
    ${BalanceFragmentFragmentDoc}
    ${TokenFragmentFragmentDoc}
`
export const Erc721TransferFragmentFragmentDoc = gql`
    fragment Erc721TransferFragment on ERC721Transfer {
        transfer {
            ...TransferSummary
        }
        token
        contract
        tokenInfo {
            name
        }
    }
    ${TransferSummaryFragmentDoc}
`
export const GetAddressEthTransfersDocument = gql`
    query getAddressEthTransfers($hash: String, $filter: TransferDirection, $_limit: Int, $_nextKey: String) {
        getEthTransfersV2(owner: $hash, direction: $filter, limit: $_limit, nextKey: $_nextKey) {
            transfers {
                transfer {
                    ...TransferSummary
                    block
                    status
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
            nextKey
        }
    }
    ${TransferSummaryFragmentDoc}
    ${BalanceFragmentFragmentDoc}
`

/**
 * __useGetAddressEthTransfersQuery__
 *
 * To run a query within a Vue component, call `useGetAddressEthTransfersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAddressEthTransfersQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetAddressEthTransfersQuery({
 *   hash: // value for 'hash'
 *   filter: // value for 'filter'
 *   _limit: // value for '_limit'
 *   _nextKey: // value for '_nextKey'
 * });
 */
export function useGetAddressEthTransfersQuery(
    variables:
        | GetAddressEthTransfersQueryVariables
        | VueCompositionApi.Ref<GetAddressEthTransfersQueryVariables>
        | ReactiveFunction<GetAddressEthTransfersQueryVariables> = {},
    options:
        | VueApolloComposable.UseQueryOptions<GetAddressEthTransfersQuery, GetAddressEthTransfersQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetAddressEthTransfersQuery, GetAddressEthTransfersQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetAddressEthTransfersQuery, GetAddressEthTransfersQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetAddressEthTransfersQuery, GetAddressEthTransfersQueryVariables>(GetAddressEthTransfersDocument, variables, options)
}
export function useGetAddressEthTransfersLazyQuery(
    variables:
        | GetAddressEthTransfersQueryVariables
        | VueCompositionApi.Ref<GetAddressEthTransfersQueryVariables>
        | ReactiveFunction<GetAddressEthTransfersQueryVariables> = {},
    options:
        | VueApolloComposable.UseQueryOptions<GetAddressEthTransfersQuery, GetAddressEthTransfersQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetAddressEthTransfersQuery, GetAddressEthTransfersQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetAddressEthTransfersQuery, GetAddressEthTransfersQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetAddressEthTransfersQuery, GetAddressEthTransfersQueryVariables>(
        GetAddressEthTransfersDocument,
        variables,
        options
    )
}
export type GetAddressEthTransfersQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<
    GetAddressEthTransfersQuery,
    GetAddressEthTransfersQueryVariables
>
export const GetAddressErc20TransfersDocument = gql`
    query getAddressERC20Transfers($hash: String!, $_limit: Int, $_nextKey: String) {
        getERC20Transfers(owner: $hash, limit: $_limit, nextKey: $_nextKey) {
            transfers {
                ...TransferFragment
            }
            nextKey
        }
    }
    ${TransferFragmentFragmentDoc}
`

/**
 * __useGetAddressErc20TransfersQuery__
 *
 * To run a query within a Vue component, call `useGetAddressErc20TransfersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAddressErc20TransfersQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetAddressErc20TransfersQuery({
 *   hash: // value for 'hash'
 *   _limit: // value for '_limit'
 *   _nextKey: // value for '_nextKey'
 * });
 */
export function useGetAddressErc20TransfersQuery(
    variables:
        | GetAddressErc20TransfersQueryVariables
        | VueCompositionApi.Ref<GetAddressErc20TransfersQueryVariables>
        | ReactiveFunction<GetAddressErc20TransfersQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetAddressErc20TransfersQuery, GetAddressErc20TransfersQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetAddressErc20TransfersQuery, GetAddressErc20TransfersQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetAddressErc20TransfersQuery, GetAddressErc20TransfersQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetAddressErc20TransfersQuery, GetAddressErc20TransfersQueryVariables>(
        GetAddressErc20TransfersDocument,
        variables,
        options
    )
}
export function useGetAddressErc20TransfersLazyQuery(
    variables:
        | GetAddressErc20TransfersQueryVariables
        | VueCompositionApi.Ref<GetAddressErc20TransfersQueryVariables>
        | ReactiveFunction<GetAddressErc20TransfersQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetAddressErc20TransfersQuery, GetAddressErc20TransfersQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetAddressErc20TransfersQuery, GetAddressErc20TransfersQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetAddressErc20TransfersQuery, GetAddressErc20TransfersQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetAddressErc20TransfersQuery, GetAddressErc20TransfersQueryVariables>(
        GetAddressErc20TransfersDocument,
        variables,
        options
    )
}
export type GetAddressErc20TransfersQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<
    GetAddressErc20TransfersQuery,
    GetAddressErc20TransfersQueryVariables
>
export const GetAddressErc721TransfersDocument = gql`
    query getAddressERC721Transfers($hash: String!, $_limit: Int, $_nextKey: String) {
        getERC721Transfers(owner: $hash, limit: $_limit, nextKey: $_nextKey) {
            transfers {
                ...Erc721TransferFragment
            }
            nextKey
        }
    }
    ${Erc721TransferFragmentFragmentDoc}
`

/**
 * __useGetAddressErc721TransfersQuery__
 *
 * To run a query within a Vue component, call `useGetAddressErc721TransfersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAddressErc721TransfersQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetAddressErc721TransfersQuery({
 *   hash: // value for 'hash'
 *   _limit: // value for '_limit'
 *   _nextKey: // value for '_nextKey'
 * });
 */
export function useGetAddressErc721TransfersQuery(
    variables:
        | GetAddressErc721TransfersQueryVariables
        | VueCompositionApi.Ref<GetAddressErc721TransfersQueryVariables>
        | ReactiveFunction<GetAddressErc721TransfersQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetAddressErc721TransfersQuery, GetAddressErc721TransfersQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetAddressErc721TransfersQuery, GetAddressErc721TransfersQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetAddressErc721TransfersQuery, GetAddressErc721TransfersQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetAddressErc721TransfersQuery, GetAddressErc721TransfersQueryVariables>(
        GetAddressErc721TransfersDocument,
        variables,
        options
    )
}
export function useGetAddressErc721TransfersLazyQuery(
    variables:
        | GetAddressErc721TransfersQueryVariables
        | VueCompositionApi.Ref<GetAddressErc721TransfersQueryVariables>
        | ReactiveFunction<GetAddressErc721TransfersQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetAddressErc721TransfersQuery, GetAddressErc721TransfersQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetAddressErc721TransfersQuery, GetAddressErc721TransfersQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetAddressErc721TransfersQuery, GetAddressErc721TransfersQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetAddressErc721TransfersQuery, GetAddressErc721TransfersQueryVariables>(
        GetAddressErc721TransfersDocument,
        variables,
        options
    )
}
export type GetAddressErc721TransfersQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<
    GetAddressErc721TransfersQuery,
    GetAddressErc721TransfersQueryVariables
>
export const GetTransactionStateDiffDocument = gql`
    query getTransactionStateDiff($hash: String!) {
        getTransactionStateDiff(hash: $hash) {
            owner
            from
            to
        }
    }
`

/**
 * __useGetTransactionStateDiffQuery__
 *
 * To run a query within a Vue component, call `useGetTransactionStateDiffQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTransactionStateDiffQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetTransactionStateDiffQuery({
 *   hash: // value for 'hash'
 * });
 */
export function useGetTransactionStateDiffQuery(
    variables:
        | GetTransactionStateDiffQueryVariables
        | VueCompositionApi.Ref<GetTransactionStateDiffQueryVariables>
        | ReactiveFunction<GetTransactionStateDiffQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetTransactionStateDiffQuery, GetTransactionStateDiffQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetTransactionStateDiffQuery, GetTransactionStateDiffQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetTransactionStateDiffQuery, GetTransactionStateDiffQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetTransactionStateDiffQuery, GetTransactionStateDiffQueryVariables>(
        GetTransactionStateDiffDocument,
        variables,
        options
    )
}
export function useGetTransactionStateDiffLazyQuery(
    variables:
        | GetTransactionStateDiffQueryVariables
        | VueCompositionApi.Ref<GetTransactionStateDiffQueryVariables>
        | ReactiveFunction<GetTransactionStateDiffQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetTransactionStateDiffQuery, GetTransactionStateDiffQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetTransactionStateDiffQuery, GetTransactionStateDiffQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetTransactionStateDiffQuery, GetTransactionStateDiffQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetTransactionStateDiffQuery, GetTransactionStateDiffQueryVariables>(
        GetTransactionStateDiffDocument,
        variables,
        options
    )
}
export type GetTransactionStateDiffQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<
    GetTransactionStateDiffQuery,
    GetTransactionStateDiffQueryVariables
>
