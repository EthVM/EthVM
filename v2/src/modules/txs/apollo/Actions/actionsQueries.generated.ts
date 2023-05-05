/* eslint-disable */
/**
 * NOTE: THIS IS AN AUTO-GENERATED FILE. DO NOT MODIFY IT DIRECTLY.
 */

import * as Types from '../../../../apollo/types'

import gql from 'graphql-tag'
import * as VueApolloComposable from '@vue/apollo-composable'
import * as VueCompositionApi from 'vue'
export type ReactiveFunction<TParam> = () => TParam
export type EthTransferInTxFragment = {
    __typename?: 'EthTransfer'
    value: string
    transfer: { __typename?: 'Transfer'; type: Types.TransferType; from: string; to: string }
}

export type GetEthTransfersInTxQueryVariables = Types.Exact<{
    limit?: Types.InputMaybe<Types.Scalars['Int']>
    hash: Types.Scalars['String']
    nextKey?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetEthTransfersInTxQuery = {
    __typename?: 'Query'
    getEthTransfersByHash: {
        __typename?: 'ETHTransfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'EthTransfer'
            value: string
            transfer: { __typename?: 'Transfer'; type: Types.TransferType; from: string; to: string }
        } | null>
    }
}

export type Erc20TransferInTxFragment = {
    __typename?: 'ERC20Transfer'
    value: string
    contract: string
    transfer: { __typename?: 'Transfer'; type: Types.TransferType; from: string; to: string }
    tokenInfo: { __typename?: 'EthTokenInfo'; name?: string | null; symbol?: string | null; decimals?: number | null; iconPng?: string | null }
}

export type Erc20MetaFragment = {
    __typename?: 'ERC20Transfer'
    contract: string
    tokenInfo: { __typename?: 'EthTokenInfo'; name?: string | null; symbol?: string | null; decimals?: number | null; iconPng?: string | null }
}

export type GetErc20TransfersInTxQueryVariables = Types.Exact<{
    limit?: Types.InputMaybe<Types.Scalars['Int']>
    hash: Types.Scalars['String']
    nextKey?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetErc20TransfersInTxQuery = {
    __typename?: 'Query'
    getERC20TransfersByHash: {
        __typename?: 'ERC20Transfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'ERC20Transfer'
            value: string
            contract: string
            transfer: { __typename?: 'Transfer'; type: Types.TransferType; from: string; to: string }
            tokenInfo: { __typename?: 'EthTokenInfo'; name?: string | null; symbol?: string | null; decimals?: number | null; iconPng?: string | null }
        } | null>
    }
}

export const EthTransferInTxFragmentDoc = gql`
    fragment EthTransferInTx on EthTransfer {
        transfer {
            type
            from
            to
        }
        value
    }
`
export const Erc20MetaFragmentDoc = gql`
    fragment erc20Meta on ERC20Transfer {
        contract
        tokenInfo {
            name
            symbol
            decimals
            iconPng
        }
    }
`
export const Erc20TransferInTxFragmentDoc = gql`
    fragment Erc20TransferInTx on ERC20Transfer {
        transfer {
            type
            from
            to
        }
        value
        ...erc20Meta
    }
    ${Erc20MetaFragmentDoc}
`
export const GetEthTransfersInTxDocument = gql`
    query getEthTransfersInTx($limit: Int, $hash: String!, $nextKey: String) {
        getEthTransfersByHash(limit: $limit, hash: $hash, nextKey: $nextKey) {
            transfers {
                ...EthTransferInTx
            }
            nextKey
        }
    }
    ${EthTransferInTxFragmentDoc}
`

/**
 * __useGetEthTransfersInTxQuery__
 *
 * To run a query within a Vue component, call `useGetEthTransfersInTxQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEthTransfersInTxQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetEthTransfersInTxQuery({
 *   limit: // value for 'limit'
 *   hash: // value for 'hash'
 *   nextKey: // value for 'nextKey'
 * });
 */
export function useGetEthTransfersInTxQuery(
    variables:
        | GetEthTransfersInTxQueryVariables
        | VueCompositionApi.Ref<GetEthTransfersInTxQueryVariables>
        | ReactiveFunction<GetEthTransfersInTxQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetEthTransfersInTxQuery, GetEthTransfersInTxQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetEthTransfersInTxQuery, GetEthTransfersInTxQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetEthTransfersInTxQuery, GetEthTransfersInTxQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetEthTransfersInTxQuery, GetEthTransfersInTxQueryVariables>(GetEthTransfersInTxDocument, variables, options)
}
export function useGetEthTransfersInTxLazyQuery(
    variables:
        | GetEthTransfersInTxQueryVariables
        | VueCompositionApi.Ref<GetEthTransfersInTxQueryVariables>
        | ReactiveFunction<GetEthTransfersInTxQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetEthTransfersInTxQuery, GetEthTransfersInTxQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetEthTransfersInTxQuery, GetEthTransfersInTxQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetEthTransfersInTxQuery, GetEthTransfersInTxQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetEthTransfersInTxQuery, GetEthTransfersInTxQueryVariables>(GetEthTransfersInTxDocument, variables, options)
}
export type GetEthTransfersInTxQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetEthTransfersInTxQuery, GetEthTransfersInTxQueryVariables>
export const GetErc20TransfersInTxDocument = gql`
    query getERC20TransfersInTx($limit: Int, $hash: String!, $nextKey: String) {
        getERC20TransfersByHash(limit: $limit, hash: $hash, nextKey: $nextKey) {
            transfers {
                ...Erc20TransferInTx
            }
            nextKey
        }
    }
    ${Erc20TransferInTxFragmentDoc}
`

/**
 * __useGetErc20TransfersInTxQuery__
 *
 * To run a query within a Vue component, call `useGetErc20TransfersInTxQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetErc20TransfersInTxQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetErc20TransfersInTxQuery({
 *   limit: // value for 'limit'
 *   hash: // value for 'hash'
 *   nextKey: // value for 'nextKey'
 * });
 */
export function useGetErc20TransfersInTxQuery(
    variables:
        | GetErc20TransfersInTxQueryVariables
        | VueCompositionApi.Ref<GetErc20TransfersInTxQueryVariables>
        | ReactiveFunction<GetErc20TransfersInTxQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetErc20TransfersInTxQuery, GetErc20TransfersInTxQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetErc20TransfersInTxQuery, GetErc20TransfersInTxQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetErc20TransfersInTxQuery, GetErc20TransfersInTxQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetErc20TransfersInTxQuery, GetErc20TransfersInTxQueryVariables>(GetErc20TransfersInTxDocument, variables, options)
}
export function useGetErc20TransfersInTxLazyQuery(
    variables:
        | GetErc20TransfersInTxQueryVariables
        | VueCompositionApi.Ref<GetErc20TransfersInTxQueryVariables>
        | ReactiveFunction<GetErc20TransfersInTxQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetErc20TransfersInTxQuery, GetErc20TransfersInTxQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetErc20TransfersInTxQuery, GetErc20TransfersInTxQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetErc20TransfersInTxQuery, GetErc20TransfersInTxQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetErc20TransfersInTxQuery, GetErc20TransfersInTxQueryVariables>(GetErc20TransfersInTxDocument, variables, options)
}
export type GetErc20TransfersInTxQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<
    GetErc20TransfersInTxQuery,
    GetErc20TransfersInTxQueryVariables
>
