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
    transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string; type: Types.TransferType }
}

export type Erc20TokenTransfersFragment = {
    __typename?: 'ERC20Transfers'
    nextKey?: string | null
    transfers: Array<{
        __typename?: 'ERC20Transfer'
        value: string
        transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string; type: Types.TransferType }
    } | null>
}

export type GetErc20TokenTransfersQueryVariables = Types.Exact<{
    _contract: Types.Scalars['String']
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
            transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string; type: Types.TransferType }
        } | null>
    }
}

export type Erc721TransferFragment = {
    __typename?: 'ERC721Transfer'
    tokenId: string
    contract: string
    transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string; type: Types.TransferType }
    tokenInfo: {
        __typename?: 'EthTokenInfo'
        name?: string | null
        symbol?: string | null
        decimals?: number | null
        totalSupply?: string | null
        contract: string
    }
}

export type Erc721TokenTransfersFragment = {
    __typename?: 'ERC721Transfers'
    nextKey?: string | null
    transfers: Array<{
        __typename?: 'ERC721Transfer'
        tokenId: string
        contract: string
        transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string; type: Types.TransferType }
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
    _contract: Types.Scalars['String']
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
            tokenId: string
            contract: string
            transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string; type: Types.TransferType }
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

export type Erc1155TokenTransferFragment = {
    __typename?: 'ERC1155Transfer'
    tokenId: string
    value: string
    contract: string
    transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string; type: Types.TransferType }
    tokenInfo: {
        __typename?: 'EthTokenInfo'
        name?: string | null
        symbol?: string | null
        decimals?: number | null
        totalSupply?: string | null
        contract: string
    }
}

export type Erc1155TokenTransfersFragment = {
    __typename?: 'ERC1155Transfers'
    nextKey?: string | null
    transfers: Array<{
        __typename?: 'ERC1155Transfer'
        tokenId: string
        value: string
        contract: string
        transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string; type: Types.TransferType }
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

export type GetErc1155TokenTransfersQueryVariables = Types.Exact<{
    _contract: Types.Scalars['String']
    _limit?: Types.InputMaybe<Types.Scalars['Int']>
    _nextKey?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetErc1155TokenTransfersQuery = {
    __typename?: 'Query'
    getERC1155TokenTransfers: {
        __typename?: 'ERC1155Transfers'
        nextKey?: string | null
        transfers: Array<{
            __typename?: 'ERC1155Transfer'
            tokenId: string
            value: string
            contract: string
            transfer: { __typename?: 'Transfer'; transactionHash: string; timestamp: number; from: string; to: string; txFee: string; type: Types.TransferType }
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
export const Erc20TokenTransfersFragmentDoc = gql`
    fragment Erc20TokenTransfers on ERC20Transfers {
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
        tokenId
        contract
        tokenInfo {
            ...TokenInfo
        }
    }
    ${TransferSummaryFragmentDoc}
    ${TokenInfoFragmentDoc}
`
export const Erc721TokenTransfersFragmentDoc = gql`
    fragment Erc721TokenTransfers on ERC721Transfers {
        transfers {
            ...Erc721Transfer
        }
        nextKey
    }
    ${Erc721TransferFragmentDoc}
`
export const Erc1155TokenTransferFragmentDoc = gql`
    fragment Erc1155TokenTransfer on ERC1155Transfer {
        transfer {
            ...TransferSummary
        }
        tokenId
        value
        contract
        tokenInfo {
            ...TokenInfo
        }
    }
    ${TransferSummaryFragmentDoc}
    ${TokenInfoFragmentDoc}
`
export const Erc1155TokenTransfersFragmentDoc = gql`
    fragment Erc1155TokenTransfers on ERC1155Transfers {
        transfers {
            ...Erc1155TokenTransfer
        }
        nextKey
    }
    ${Erc1155TokenTransferFragmentDoc}
`
export const GetErc20TokenTransfersDocument = gql`
    query getERC20TokenTransfers($_contract: String!, $_limit: Int, $_nextKey: String) {
        getERC20TokenTransfers(contract: $_contract, limit: $_limit, nextKey: $_nextKey) {
            ...Erc20TokenTransfers
        }
    }
    ${Erc20TokenTransfersFragmentDoc}
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
 *   _contract: // value for '_contract'
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
    query getERC721TokenTransfers($_contract: String!, $_limit: Int, $_nextKey: String) {
        getERC721TokenTransfers(contract: $_contract, limit: $_limit, nextKey: $_nextKey) {
            ...Erc721TokenTransfers
        }
    }
    ${Erc721TokenTransfersFragmentDoc}
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
 *   _contract: // value for '_contract'
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
export const GetErc1155TokenTransfersDocument = gql`
    query getERC1155TokenTransfers($_contract: String!, $_limit: Int, $_nextKey: String) {
        getERC1155TokenTransfers(contract: $_contract, limit: $_limit, nextKey: $_nextKey) {
            ...Erc1155TokenTransfers
        }
    }
    ${Erc1155TokenTransfersFragmentDoc}
`

/**
 * __useGetErc1155TokenTransfersQuery__
 *
 * To run a query within a Vue component, call `useGetErc1155TokenTransfersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetErc1155TokenTransfersQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetErc1155TokenTransfersQuery({
 *   _contract: // value for '_contract'
 *   _limit: // value for '_limit'
 *   _nextKey: // value for '_nextKey'
 * });
 */
export function useGetErc1155TokenTransfersQuery(
    variables:
        | GetErc1155TokenTransfersQueryVariables
        | VueCompositionApi.Ref<GetErc1155TokenTransfersQueryVariables>
        | ReactiveFunction<GetErc1155TokenTransfersQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetErc1155TokenTransfersQuery, GetErc1155TokenTransfersQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetErc1155TokenTransfersQuery, GetErc1155TokenTransfersQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetErc1155TokenTransfersQuery, GetErc1155TokenTransfersQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetErc1155TokenTransfersQuery, GetErc1155TokenTransfersQueryVariables>(
        GetErc1155TokenTransfersDocument,
        variables,
        options
    )
}
export function useGetErc1155TokenTransfersLazyQuery(
    variables:
        | GetErc1155TokenTransfersQueryVariables
        | VueCompositionApi.Ref<GetErc1155TokenTransfersQueryVariables>
        | ReactiveFunction<GetErc1155TokenTransfersQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetErc1155TokenTransfersQuery, GetErc1155TokenTransfersQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetErc1155TokenTransfersQuery, GetErc1155TokenTransfersQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetErc1155TokenTransfersQuery, GetErc1155TokenTransfersQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetErc1155TokenTransfersQuery, GetErc1155TokenTransfersQueryVariables>(
        GetErc1155TokenTransfersDocument,
        variables,
        options
    )
}
export type GetErc1155TokenTransfersQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<
    GetErc1155TokenTransfersQuery,
    GetErc1155TokenTransfersQueryVariables
>
