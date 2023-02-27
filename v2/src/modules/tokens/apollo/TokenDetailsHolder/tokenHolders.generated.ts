/* eslint-disable */
/**
 * NOTE: THIS IS AN AUTO-GENERATED FILE. DO NOT MODIFY IT DIRECTLY.
 */

import * as Types from '../../../../apollo/types'

import gql from 'graphql-tag'
import { Erc20TokenOwnerDetailsFragmentDoc, TokenDetailsFragmentDoc } from '../TokenDetails/tokenDetails.generated'
import * as VueApolloComposable from '@vue/apollo-composable'
import * as VueCompositionApi from 'vue'
export type ReactiveFunction<TParam> = () => TParam
export type Erc20TokenOwnersFragment = {
    __typename?: 'ERC20TokenOwners'
    nextKey?: string | null
    owners: Array<{
        __typename?: 'ERC20TokenBalance'
        owner: string
        balance: string
        tokenInfo: {
            __typename?: 'EthTokenInfo'
            name?: string | null
            symbol?: string | null
            decimals?: number | null
            totalSupply?: string | null
            contract: string
            tokenId?: string | null
        }
    } | null>
}

export type Erc721TokenOwnerDetailsFragment = {
    __typename?: 'ERC721TokenOwner'
    owner: string
    tokenId: string
    tokenInfo: {
        __typename?: 'EthTokenInfo'
        name?: string | null
        symbol?: string | null
        decimals?: number | null
        totalSupply?: string | null
        contract: string
        tokenId?: string | null
    }
}

export type Erc721TokenOwnersFragment = {
    __typename?: 'ERC721TokenOwners'
    nextKey?: string | null
    owners: Array<{
        __typename?: 'ERC721TokenOwner'
        owner: string
        tokenId: string
        tokenInfo: {
            __typename?: 'EthTokenInfo'
            name?: string | null
            symbol?: string | null
            decimals?: number | null
            totalSupply?: string | null
            contract: string
            tokenId?: string | null
        }
    } | null>
}

export type Erc1155TokenOwnerDetailsFragment = {
    __typename?: 'ERC1155TokenBalance'
    owner: string
    balance: string
    tokenInfo: {
        __typename?: 'EthTokenInfo'
        name?: string | null
        symbol?: string | null
        decimals?: number | null
        totalSupply?: string | null
        contract: string
        tokenId?: string | null
    }
}

export type Erc1155TokenOwnersFragment = {
    __typename?: 'ERC1155TokenBalances'
    nextKey?: string | null
    balances: Array<{
        __typename?: 'ERC1155TokenBalance'
        owner: string
        balance: string
        tokenInfo: {
            __typename?: 'EthTokenInfo'
            name?: string | null
            symbol?: string | null
            decimals?: number | null
            totalSupply?: string | null
            contract: string
            tokenId?: string | null
        }
    }>
}

export type GetErc20TokenOwnersQueryVariables = Types.Exact<{
    contract: Types.Scalars['String']
    _limit?: Types.InputMaybe<Types.Scalars['Int']>
    _nextKey?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetErc20TokenOwnersQuery = {
    __typename?: 'Query'
    getERC20TokenOwners: {
        __typename?: 'ERC20TokenOwners'
        nextKey?: string | null
        owners: Array<{
            __typename?: 'ERC20TokenBalance'
            owner: string
            balance: string
            tokenInfo: {
                __typename?: 'EthTokenInfo'
                name?: string | null
                symbol?: string | null
                decimals?: number | null
                totalSupply?: string | null
                contract: string
                tokenId?: string | null
            }
        } | null>
    }
}

export type GetErc721TokenOwnersQueryVariables = Types.Exact<{
    contract: Types.Scalars['String']
    _limit?: Types.InputMaybe<Types.Scalars['Int']>
    _nextKey?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetErc721TokenOwnersQuery = {
    __typename?: 'Query'
    getERC721TokenOwners: {
        __typename?: 'ERC721TokenOwners'
        nextKey?: string | null
        owners: Array<{
            __typename?: 'ERC721TokenOwner'
            owner: string
            tokenId: string
            tokenInfo: {
                __typename?: 'EthTokenInfo'
                name?: string | null
                symbol?: string | null
                decimals?: number | null
                totalSupply?: string | null
                contract: string
                tokenId?: string | null
            }
        } | null>
    }
}

export type GetErc1155TokenOwnersQueryVariables = Types.Exact<{
    contract: Types.Scalars['String']
    _limit?: Types.InputMaybe<Types.Scalars['Int']>
    _nextKey?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetErc1155TokenOwnersQuery = {
    __typename?: 'Query'
    getERC1155TokensByContract: {
        __typename?: 'ERC1155TokenBalances'
        nextKey?: string | null
        balances: Array<{
            __typename?: 'ERC1155TokenBalance'
            owner: string
            balance: string
            tokenInfo: {
                __typename?: 'EthTokenInfo'
                name?: string | null
                symbol?: string | null
                decimals?: number | null
                totalSupply?: string | null
                contract: string
                tokenId?: string | null
            }
        }>
    }
}

export const Erc20TokenOwnersFragmentDoc = gql`
    fragment ERC20TokenOwners on ERC20TokenOwners {
        owners {
            ...ERC20TokenOwnerDetails
        }
        nextKey
    }
    ${Erc20TokenOwnerDetailsFragmentDoc}
`
export const Erc721TokenOwnerDetailsFragmentDoc = gql`
    fragment ERC721TokenOwnerDetails on ERC721TokenOwner {
        tokenInfo {
            ...TokenDetails
        }
        owner
        tokenId
    }
    ${TokenDetailsFragmentDoc}
`
export const Erc721TokenOwnersFragmentDoc = gql`
    fragment ERC721TokenOwners on ERC721TokenOwners {
        owners {
            ...ERC721TokenOwnerDetails
        }
        nextKey
    }
    ${Erc721TokenOwnerDetailsFragmentDoc}
`
export const Erc1155TokenOwnerDetailsFragmentDoc = gql`
    fragment ERC1155TokenOwnerDetails on ERC1155TokenBalance {
        tokenInfo {
            ...TokenDetails
        }
        owner
        balance
    }
    ${TokenDetailsFragmentDoc}
`
export const Erc1155TokenOwnersFragmentDoc = gql`
    fragment ERC1155TokenOwners on ERC1155TokenBalances {
        balances {
            ...ERC1155TokenOwnerDetails
        }
        nextKey
    }
    ${Erc1155TokenOwnerDetailsFragmentDoc}
`
export const GetErc20TokenOwnersDocument = gql`
    query getERC20TokenOwners($contract: String!, $_limit: Int, $_nextKey: String) {
        getERC20TokenOwners(contract: $contract, limit: $_limit, nextKey: $_nextKey) {
            ...ERC20TokenOwners
        }
    }
    ${Erc20TokenOwnersFragmentDoc}
`

/**
 * __useGetErc20TokenOwnersQuery__
 *
 * To run a query within a Vue component, call `useGetErc20TokenOwnersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetErc20TokenOwnersQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetErc20TokenOwnersQuery({
 *   contract: // value for 'contract'
 *   _limit: // value for '_limit'
 *   _nextKey: // value for '_nextKey'
 * });
 */
export function useGetErc20TokenOwnersQuery(
    variables:
        | GetErc20TokenOwnersQueryVariables
        | VueCompositionApi.Ref<GetErc20TokenOwnersQueryVariables>
        | ReactiveFunction<GetErc20TokenOwnersQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetErc20TokenOwnersQuery, GetErc20TokenOwnersQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetErc20TokenOwnersQuery, GetErc20TokenOwnersQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetErc20TokenOwnersQuery, GetErc20TokenOwnersQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetErc20TokenOwnersQuery, GetErc20TokenOwnersQueryVariables>(GetErc20TokenOwnersDocument, variables, options)
}
export function useGetErc20TokenOwnersLazyQuery(
    variables:
        | GetErc20TokenOwnersQueryVariables
        | VueCompositionApi.Ref<GetErc20TokenOwnersQueryVariables>
        | ReactiveFunction<GetErc20TokenOwnersQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetErc20TokenOwnersQuery, GetErc20TokenOwnersQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetErc20TokenOwnersQuery, GetErc20TokenOwnersQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetErc20TokenOwnersQuery, GetErc20TokenOwnersQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetErc20TokenOwnersQuery, GetErc20TokenOwnersQueryVariables>(GetErc20TokenOwnersDocument, variables, options)
}
export type GetErc20TokenOwnersQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetErc20TokenOwnersQuery, GetErc20TokenOwnersQueryVariables>
export const GetErc721TokenOwnersDocument = gql`
    query getERC721TokenOwners($contract: String!, $_limit: Int, $_nextKey: String) {
        getERC721TokenOwners(contract: $contract, limit: $_limit, nextKey: $_nextKey) {
            ...ERC721TokenOwners
        }
    }
    ${Erc721TokenOwnersFragmentDoc}
`

/**
 * __useGetErc721TokenOwnersQuery__
 *
 * To run a query within a Vue component, call `useGetErc721TokenOwnersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetErc721TokenOwnersQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetErc721TokenOwnersQuery({
 *   contract: // value for 'contract'
 *   _limit: // value for '_limit'
 *   _nextKey: // value for '_nextKey'
 * });
 */
export function useGetErc721TokenOwnersQuery(
    variables:
        | GetErc721TokenOwnersQueryVariables
        | VueCompositionApi.Ref<GetErc721TokenOwnersQueryVariables>
        | ReactiveFunction<GetErc721TokenOwnersQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetErc721TokenOwnersQuery, GetErc721TokenOwnersQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetErc721TokenOwnersQuery, GetErc721TokenOwnersQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetErc721TokenOwnersQuery, GetErc721TokenOwnersQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetErc721TokenOwnersQuery, GetErc721TokenOwnersQueryVariables>(GetErc721TokenOwnersDocument, variables, options)
}
export function useGetErc721TokenOwnersLazyQuery(
    variables:
        | GetErc721TokenOwnersQueryVariables
        | VueCompositionApi.Ref<GetErc721TokenOwnersQueryVariables>
        | ReactiveFunction<GetErc721TokenOwnersQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetErc721TokenOwnersQuery, GetErc721TokenOwnersQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetErc721TokenOwnersQuery, GetErc721TokenOwnersQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetErc721TokenOwnersQuery, GetErc721TokenOwnersQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetErc721TokenOwnersQuery, GetErc721TokenOwnersQueryVariables>(GetErc721TokenOwnersDocument, variables, options)
}
export type GetErc721TokenOwnersQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<
    GetErc721TokenOwnersQuery,
    GetErc721TokenOwnersQueryVariables
>
export const GetErc1155TokenOwnersDocument = gql`
    query getERC1155TokenOwners($contract: String!, $_limit: Int, $_nextKey: String) {
        getERC1155TokensByContract(contract: $contract, limit: $_limit, nextKey: $_nextKey) {
            ...ERC1155TokenOwners
        }
    }
    ${Erc1155TokenOwnersFragmentDoc}
`

/**
 * __useGetErc1155TokenOwnersQuery__
 *
 * To run a query within a Vue component, call `useGetErc1155TokenOwnersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetErc1155TokenOwnersQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetErc1155TokenOwnersQuery({
 *   contract: // value for 'contract'
 *   _limit: // value for '_limit'
 *   _nextKey: // value for '_nextKey'
 * });
 */
export function useGetErc1155TokenOwnersQuery(
    variables:
        | GetErc1155TokenOwnersQueryVariables
        | VueCompositionApi.Ref<GetErc1155TokenOwnersQueryVariables>
        | ReactiveFunction<GetErc1155TokenOwnersQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetErc1155TokenOwnersQuery, GetErc1155TokenOwnersQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetErc1155TokenOwnersQuery, GetErc1155TokenOwnersQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetErc1155TokenOwnersQuery, GetErc1155TokenOwnersQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetErc1155TokenOwnersQuery, GetErc1155TokenOwnersQueryVariables>(GetErc1155TokenOwnersDocument, variables, options)
}
export function useGetErc1155TokenOwnersLazyQuery(
    variables:
        | GetErc1155TokenOwnersQueryVariables
        | VueCompositionApi.Ref<GetErc1155TokenOwnersQueryVariables>
        | ReactiveFunction<GetErc1155TokenOwnersQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetErc1155TokenOwnersQuery, GetErc1155TokenOwnersQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetErc1155TokenOwnersQuery, GetErc1155TokenOwnersQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetErc1155TokenOwnersQuery, GetErc1155TokenOwnersQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetErc1155TokenOwnersQuery, GetErc1155TokenOwnersQueryVariables>(GetErc1155TokenOwnersDocument, variables, options)
}
export type GetErc1155TokenOwnersQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<
    GetErc1155TokenOwnersQuery,
    GetErc1155TokenOwnersQueryVariables
>
