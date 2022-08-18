/* eslint-disable */
/**
 * NOTE: THIS IS AN AUTO-GENERATED FILE. DO NOT MODIFY IT DIRECTLY.
 */

import * as Types from '../../../../apollo/types'

import gql from 'graphql-tag'
import { TransferSummaryFragmentDoc } from '../../../address/apollo/AddressTransfers/transfers.generated'
import * as VueApolloComposable from '@vue/apollo-composable'
import * as VueCompositionApi from 'vue'
export type ReactiveFunction<TParam> = () => TParam
export type TokenInfoFragment = {
    __typename?: 'EthTokenInfo'
    name?: string | null
    symbol?: string | null
    decimals?: number | null
    totalSupply?: string | null
    contract: string
}

export type TokenTransferFragment = {
    __typename?: 'ERC20Transfer'
    value: string
    transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string }
}

export type TokenTransfersFragment = {
    __typename?: 'ERC20Transfers'
    nextKey?: string | null
    transfers: Array<{
        __typename?: 'ERC20Transfer'
        value: string
        transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string }
    } | null>
}

export type GetErc20TokenTransfersQueryVariables = Types.Exact<{
    hash: Types.Scalars['String']
    _limit?: Types.InputMaybe<Types.Scalars['Int']>
    _nextKey?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetErc20TokenTransfersQuery = {
    __typename?: 'Query'
    getERC20TokenTransfers: {
        __typename?: 'ERC20Transfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'ERC20Transfer'
            value: string
            transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string }
        } | null>
    }
}

export type Erc721TransferFragment = {
    __typename?: 'ERC721Transfer'
    token: string
    contract: string
    transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string }
    tokenInfo: {
        __typename?: 'EthTokenInfo'
        name?: string | null
        symbol?: string | null
        decimals?: number | null
        totalSupply?: string | null
        contract: string
    }
}

export type Erc721TransfersFragment = {
    __typename?: 'ERC721Transfers'
    nextKey?: string | null
    transfers: Array<{
        __typename?: 'ERC721Transfer'
        token: string
        contract: string
        transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string }
        tokenInfo: {
            __typename?: 'EthTokenInfo'
            name?: string | null
            symbol?: string | null
            decimals?: number | null
            totalSupply?: string | null
            contract: string
        }
    } | null>
}

export type GetErc721TokenTransfersQueryVariables = Types.Exact<{
    hash: Types.Scalars['String']
    _limit?: Types.InputMaybe<Types.Scalars['Int']>
    _nextKey?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetErc721TokenTransfersQuery = {
    __typename?: 'Query'
    getERC721TokenTransfers: {
        __typename?: 'ERC721Transfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'ERC721Transfer'
            token: string
            contract: string
            transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string }
            tokenInfo: {
                __typename?: 'EthTokenInfo'
                name?: string | null
                symbol?: string | null
                decimals?: number | null
                totalSupply?: string | null
                contract: string
            }
        } | null>
    }
}

export const TokenTransferFragmentDoc = gql`
    fragment TokenTransfer on ERC20Transfer {
        transfer {
            ...TransferSummary
        }
        value
    }
    ${TransferSummaryFragmentDoc}
`
export const TokenTransfersFragmentDoc = gql`
    fragment TokenTransfers on ERC20Transfers {
        transfers {
            ...TokenTransfer
        }
        nextKey
    }
    ${TokenTransferFragmentDoc}
`
export const TokenInfoFragmentDoc = gql`
    fragment TokenInfo on EthTokenInfo {
        name
        symbol
        decimals
        totalSupply
        contract
    }
`
export const Erc721TransferFragmentDoc = gql`
    fragment Erc721Transfer on ERC721Transfer {
        transfer {
            ...TransferSummary
        }
        token
        contract
        tokenInfo {
            ...TokenInfo
        }
    }
    ${TransferSummaryFragmentDoc}
    ${TokenInfoFragmentDoc}
`
export const Erc721TransfersFragmentDoc = gql`
    fragment Erc721Transfers on ERC721Transfers {
        transfers {
            ...Erc721Transfer
        }
        nextKey
    }
    ${Erc721TransferFragmentDoc}
`
export const GetErc20TokenTransfersDocument = gql`
    query getERC20TokenTransfers($hash: String!, $_limit: Int, $_nextKey: String) {
        getERC20TokenTransfers(contract: $hash, limit: $_limit, nextKey: $_nextKey) {
            ...TokenTransfers
        }
    }
    ${TokenTransfersFragmentDoc}
`

/**
 * __useGetErc20TokenTransfersQuery__
 *
 * To run a query within a Vue component, call `useGetErc20TokenTransfersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetErc20TokenTransfersQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetErc20TokenTransfersQuery({
 *   hash: // value for 'hash'
 *   _limit: // value for '_limit'
 *   _nextKey: // value for '_nextKey'
 * });
 */
export function useGetErc20TokenTransfersQuery(
    variables:
        | GetErc20TokenTransfersQueryVariables
        | VueCompositionApi.Ref<GetErc20TokenTransfersQueryVariables>
        | ReactiveFunction<GetErc20TokenTransfersQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetErc20TokenTransfersQuery, GetErc20TokenTransfersQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetErc20TokenTransfersQuery, GetErc20TokenTransfersQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetErc20TokenTransfersQuery, GetErc20TokenTransfersQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetErc20TokenTransfersQuery, GetErc20TokenTransfersQueryVariables>(GetErc20TokenTransfersDocument, variables, options)
}
export function useGetErc20TokenTransfersLazyQuery(
    variables:
        | GetErc20TokenTransfersQueryVariables
        | VueCompositionApi.Ref<GetErc20TokenTransfersQueryVariables>
        | ReactiveFunction<GetErc20TokenTransfersQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetErc20TokenTransfersQuery, GetErc20TokenTransfersQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetErc20TokenTransfersQuery, GetErc20TokenTransfersQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetErc20TokenTransfersQuery, GetErc20TokenTransfersQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetErc20TokenTransfersQuery, GetErc20TokenTransfersQueryVariables>(
        GetErc20TokenTransfersDocument,
        variables,
        options
    )
}
export type GetErc20TokenTransfersQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<
    GetErc20TokenTransfersQuery,
    GetErc20TokenTransfersQueryVariables
>
export const GetErc721TokenTransfersDocument = gql`
    query getERC721TokenTransfers($hash: String!, $_limit: Int, $_nextKey: String) {
        getERC721TokenTransfers(contract: $hash, limit: $_limit, nextKey: $_nextKey) {
            ...Erc721Transfers
        }
    }
    ${Erc721TransfersFragmentDoc}
`

/**
 * __useGetErc721TokenTransfersQuery__
 *
 * To run a query within a Vue component, call `useGetErc721TokenTransfersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetErc721TokenTransfersQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetErc721TokenTransfersQuery({
 *   hash: // value for 'hash'
 *   _limit: // value for '_limit'
 *   _nextKey: // value for '_nextKey'
 * });
 */
export function useGetErc721TokenTransfersQuery(
    variables:
        | GetErc721TokenTransfersQueryVariables
        | VueCompositionApi.Ref<GetErc721TokenTransfersQueryVariables>
        | ReactiveFunction<GetErc721TokenTransfersQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetErc721TokenTransfersQuery, GetErc721TokenTransfersQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetErc721TokenTransfersQuery, GetErc721TokenTransfersQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetErc721TokenTransfersQuery, GetErc721TokenTransfersQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetErc721TokenTransfersQuery, GetErc721TokenTransfersQueryVariables>(
        GetErc721TokenTransfersDocument,
        variables,
        options
    )
}
export function useGetErc721TokenTransfersLazyQuery(
    variables:
        | GetErc721TokenTransfersQueryVariables
        | VueCompositionApi.Ref<GetErc721TokenTransfersQueryVariables>
        | ReactiveFunction<GetErc721TokenTransfersQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetErc721TokenTransfersQuery, GetErc721TokenTransfersQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetErc721TokenTransfersQuery, GetErc721TokenTransfersQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetErc721TokenTransfersQuery, GetErc721TokenTransfersQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetErc721TokenTransfersQuery, GetErc721TokenTransfersQueryVariables>(
        GetErc721TokenTransfersDocument,
        variables,
        options
    )
}
export type GetErc721TokenTransfersQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<
    GetErc721TokenTransfersQuery,
    GetErc721TokenTransfersQueryVariables
>
