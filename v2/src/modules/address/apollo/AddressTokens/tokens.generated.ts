/* eslint-disable */
/**
 * NOTE: THIS IS AN AUTO-GENERATED FILE. DO NOT MODIFY IT DIRECTLY.
 */

import * as Types from '../../../../apollo/types'

import gql from 'graphql-tag'
import * as VueApolloComposable from '@vue/apollo-composable'
import * as VueCompositionApi from 'vue'
export type ReactiveFunction<TParam> = () => TParam
export type TokenFragmentFragment = { __typename?: 'EthTokenInfo'; name?: string | null; symbol?: string | null; decimals?: number | null }

export type TokenOwnersFragment = {
    __typename?: 'ERC20TokenBalance'
    balance: string
    tokenInfo: { __typename?: 'EthTokenInfo'; contract: string; name?: string | null; symbol?: string | null; decimals?: number | null }
}

export type GetOwnersErc20TokensQueryVariables = Types.Exact<{
    hash: Types.Scalars['String']
    _nextKey?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetOwnersErc20TokensQuery = {
    __typename?: 'Query'
    getOwnersERC20Tokens: {
        __typename?: 'ERC20TokenOwners'
        nextKey?: string | null
        owners: Array<{
            __typename?: 'ERC20TokenBalance'
            balance: string
            tokenInfo: { __typename?: 'EthTokenInfo'; contract: string; name?: string | null; symbol?: string | null; decimals?: number | null }
        } | null>
    }
}

export type Erc721BalanceFragment = {
    __typename?: 'ERC721TokenBalance'
    balance: string
    tokenInfo: { __typename?: 'EthTokenInfo'; name?: string | null; symbol?: string | null; contract: string }
}

export type GetOwnersErc721BalancesQueryVariables = Types.Exact<{
    hash: Types.Scalars['String']
}>

export type GetOwnersErc721BalancesQuery = {
    __typename?: 'Query'
    getOwnersERC721Balances: Array<{
        __typename?: 'ERC721TokenBalance'
        balance: string
        tokenInfo: { __typename?: 'EthTokenInfo'; name?: string | null; symbol?: string | null; contract: string }
    } | null>
}

export type TokenFragment = { __typename?: 'ERC721TokenOwner'; token: string }

export type OwnerErc721Fragment = {
    __typename?: 'ERC721TokenContract'
    nextKey?: string | null
    tokens: Array<{ __typename?: 'ERC721TokenOwner'; token: string } | null>
}

export type GetOwnersErc721TokensQueryVariables = Types.Exact<{
    hash: Types.Scalars['String']
    tokenContract?: Types.InputMaybe<Types.Scalars['String']>
    _nextKey?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetOwnersErc721TokensQuery = {
    __typename?: 'Query'
    getOwnersERC721Tokens: {
        __typename?: 'ERC721TokenContract'
        nextKey?: string | null
        tokens: Array<{ __typename?: 'ERC721TokenOwner'; token: string } | null>
    }
}

export type PrimaryAssetContractFragment = {
    __typename?: 'PrimaryAssetContract'
    address: string
    name?: string | null
    symbol?: string | null
    total_supply?: number | null
    description?: string | null
    external_link?: string | null
    image_url?: string | null
}

export type TokenContractFragment = {
    __typename?: 'NFTContract'
    contractIdAddress: string
    owned_asset_count: number
    name?: string | null
    contractImage?: string | null
    primary_asset_contracts?: Array<{
        __typename?: 'PrimaryAssetContract'
        address: string
        name?: string | null
        symbol?: string | null
        total_supply?: number | null
        description?: string | null
        external_link?: string | null
        image_url?: string | null
    }> | null
}

export type GetNfTcontractsMetaQueryVariables = Types.Exact<{
    address: Types.Scalars['String']
}>

export type GetNfTcontractsMetaQuery = {
    __typename?: 'Query'
    getNFTcontractsMeta: {
        __typename?: 'AddressNFTcontracts'
        tokenContracts?: Array<{
            __typename?: 'NFTContract'
            contractIdAddress: string
            owned_asset_count: number
            name?: string | null
            contractImage?: string | null
            primary_asset_contracts?: Array<{
                __typename?: 'PrimaryAssetContract'
                address: string
                name?: string | null
                symbol?: string | null
                total_supply?: number | null
                description?: string | null
                external_link?: string | null
                image_url?: string | null
            }> | null
        } | null> | null
    }
}

export const TokenFragmentFragmentDoc = gql`
    fragment TokenFragment on EthTokenInfo {
        name
        symbol
        decimals
    }
`
export const TokenOwnersFragmentDoc = gql`
    fragment TokenOwners on ERC20TokenBalance {
        tokenInfo {
            ...TokenFragment
            contract
        }
        balance
    }
    ${TokenFragmentFragmentDoc}
`
export const Erc721BalanceFragmentDoc = gql`
    fragment Erc721Balance on ERC721TokenBalance {
        balance
        tokenInfo {
            name
            symbol
            contract
        }
    }
`
export const TokenFragmentDoc = gql`
    fragment Token on ERC721TokenOwner {
        token
    }
`
export const OwnerErc721FragmentDoc = gql`
    fragment OwnerErc721 on ERC721TokenContract {
        tokens {
            ...Token
        }
        nextKey
    }
    ${TokenFragmentDoc}
`
export const PrimaryAssetContractFragmentDoc = gql`
    fragment PrimaryAssetContract on PrimaryAssetContract {
        address
        name
        symbol
        total_supply
        description
        external_link
        image_url
    }
`
export const TokenContractFragmentDoc = gql`
    fragment TokenContract on NFTContract {
        contractIdAddress
        owned_asset_count
        name
        contractImage
        primary_asset_contracts @type(name: "PrimaryAssetContract") {
            ...PrimaryAssetContract
        }
    }
    ${PrimaryAssetContractFragmentDoc}
`
export const GetOwnersErc20TokensDocument = gql`
    query getOwnersERC20Tokens($hash: String!, $_nextKey: String) {
        getOwnersERC20Tokens(owner: $hash, nextKey: $_nextKey) {
            owners {
                ...TokenOwners
            }
            nextKey
        }
    }
    ${TokenOwnersFragmentDoc}
`

/**
 * __useGetOwnersErc20TokensQuery__
 *
 * To run a query within a Vue component, call `useGetOwnersErc20TokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOwnersErc20TokensQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetOwnersErc20TokensQuery({
 *   hash: // value for 'hash'
 *   _nextKey: // value for '_nextKey'
 * });
 */
export function useGetOwnersErc20TokensQuery(
    variables:
        | GetOwnersErc20TokensQueryVariables
        | VueCompositionApi.Ref<GetOwnersErc20TokensQueryVariables>
        | ReactiveFunction<GetOwnersErc20TokensQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetOwnersErc20TokensQuery, GetOwnersErc20TokensQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetOwnersErc20TokensQuery, GetOwnersErc20TokensQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetOwnersErc20TokensQuery, GetOwnersErc20TokensQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetOwnersErc20TokensQuery, GetOwnersErc20TokensQueryVariables>(GetOwnersErc20TokensDocument, variables, options)
}
export function useGetOwnersErc20TokensLazyQuery(
    variables:
        | GetOwnersErc20TokensQueryVariables
        | VueCompositionApi.Ref<GetOwnersErc20TokensQueryVariables>
        | ReactiveFunction<GetOwnersErc20TokensQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetOwnersErc20TokensQuery, GetOwnersErc20TokensQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetOwnersErc20TokensQuery, GetOwnersErc20TokensQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetOwnersErc20TokensQuery, GetOwnersErc20TokensQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetOwnersErc20TokensQuery, GetOwnersErc20TokensQueryVariables>(GetOwnersErc20TokensDocument, variables, options)
}
export type GetOwnersErc20TokensQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<
    GetOwnersErc20TokensQuery,
    GetOwnersErc20TokensQueryVariables
>
export const GetOwnersErc721BalancesDocument = gql`
    query getOwnersERC721Balances($hash: String!) {
        getOwnersERC721Balances(owner: $hash) {
            ...Erc721Balance
        }
    }
    ${Erc721BalanceFragmentDoc}
`

/**
 * __useGetOwnersErc721BalancesQuery__
 *
 * To run a query within a Vue component, call `useGetOwnersErc721BalancesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOwnersErc721BalancesQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetOwnersErc721BalancesQuery({
 *   hash: // value for 'hash'
 * });
 */
export function useGetOwnersErc721BalancesQuery(
    variables:
        | GetOwnersErc721BalancesQueryVariables
        | VueCompositionApi.Ref<GetOwnersErc721BalancesQueryVariables>
        | ReactiveFunction<GetOwnersErc721BalancesQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetOwnersErc721BalancesQuery, GetOwnersErc721BalancesQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetOwnersErc721BalancesQuery, GetOwnersErc721BalancesQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetOwnersErc721BalancesQuery, GetOwnersErc721BalancesQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetOwnersErc721BalancesQuery, GetOwnersErc721BalancesQueryVariables>(
        GetOwnersErc721BalancesDocument,
        variables,
        options
    )
}
export function useGetOwnersErc721BalancesLazyQuery(
    variables:
        | GetOwnersErc721BalancesQueryVariables
        | VueCompositionApi.Ref<GetOwnersErc721BalancesQueryVariables>
        | ReactiveFunction<GetOwnersErc721BalancesQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetOwnersErc721BalancesQuery, GetOwnersErc721BalancesQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetOwnersErc721BalancesQuery, GetOwnersErc721BalancesQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetOwnersErc721BalancesQuery, GetOwnersErc721BalancesQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetOwnersErc721BalancesQuery, GetOwnersErc721BalancesQueryVariables>(
        GetOwnersErc721BalancesDocument,
        variables,
        options
    )
}
export type GetOwnersErc721BalancesQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<
    GetOwnersErc721BalancesQuery,
    GetOwnersErc721BalancesQueryVariables
>
export const GetOwnersErc721TokensDocument = gql`
    query getOwnersERC721Tokens($hash: String!, $tokenContract: String, $_nextKey: String) {
        getOwnersERC721Tokens(owner: $hash, contract: $tokenContract, nextKey: $_nextKey) {
            ...OwnerErc721
        }
    }
    ${OwnerErc721FragmentDoc}
`

/**
 * __useGetOwnersErc721TokensQuery__
 *
 * To run a query within a Vue component, call `useGetOwnersErc721TokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOwnersErc721TokensQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetOwnersErc721TokensQuery({
 *   hash: // value for 'hash'
 *   tokenContract: // value for 'tokenContract'
 *   _nextKey: // value for '_nextKey'
 * });
 */
export function useGetOwnersErc721TokensQuery(
    variables:
        | GetOwnersErc721TokensQueryVariables
        | VueCompositionApi.Ref<GetOwnersErc721TokensQueryVariables>
        | ReactiveFunction<GetOwnersErc721TokensQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetOwnersErc721TokensQuery, GetOwnersErc721TokensQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetOwnersErc721TokensQuery, GetOwnersErc721TokensQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetOwnersErc721TokensQuery, GetOwnersErc721TokensQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetOwnersErc721TokensQuery, GetOwnersErc721TokensQueryVariables>(GetOwnersErc721TokensDocument, variables, options)
}
export function useGetOwnersErc721TokensLazyQuery(
    variables:
        | GetOwnersErc721TokensQueryVariables
        | VueCompositionApi.Ref<GetOwnersErc721TokensQueryVariables>
        | ReactiveFunction<GetOwnersErc721TokensQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetOwnersErc721TokensQuery, GetOwnersErc721TokensQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetOwnersErc721TokensQuery, GetOwnersErc721TokensQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetOwnersErc721TokensQuery, GetOwnersErc721TokensQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetOwnersErc721TokensQuery, GetOwnersErc721TokensQueryVariables>(GetOwnersErc721TokensDocument, variables, options)
}
export type GetOwnersErc721TokensQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<
    GetOwnersErc721TokensQuery,
    GetOwnersErc721TokensQueryVariables
>
export const GetNfTcontractsMetaDocument = gql`
    query getNFTcontractsMeta($address: String!) {
        getNFTcontractsMeta(address: $address) @rest(type: "AddressNFTcontracts", path: "/nft?{args}") {
            tokenContracts @type(name: "NFTContract") {
                ...TokenContract
            }
        }
    }
    ${TokenContractFragmentDoc}
`

/**
 * __useGetNfTcontractsMetaQuery__
 *
 * To run a query within a Vue component, call `useGetNfTcontractsMetaQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNfTcontractsMetaQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetNfTcontractsMetaQuery({
 *   address: // value for 'address'
 * });
 */
export function useGetNfTcontractsMetaQuery(
    variables:
        | GetNfTcontractsMetaQueryVariables
        | VueCompositionApi.Ref<GetNfTcontractsMetaQueryVariables>
        | ReactiveFunction<GetNfTcontractsMetaQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetNfTcontractsMetaQuery, GetNfTcontractsMetaQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetNfTcontractsMetaQuery, GetNfTcontractsMetaQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetNfTcontractsMetaQuery, GetNfTcontractsMetaQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetNfTcontractsMetaQuery, GetNfTcontractsMetaQueryVariables>(GetNfTcontractsMetaDocument, variables, options)
}
export function useGetNfTcontractsMetaLazyQuery(
    variables:
        | GetNfTcontractsMetaQueryVariables
        | VueCompositionApi.Ref<GetNfTcontractsMetaQueryVariables>
        | ReactiveFunction<GetNfTcontractsMetaQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetNfTcontractsMetaQuery, GetNfTcontractsMetaQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetNfTcontractsMetaQuery, GetNfTcontractsMetaQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetNfTcontractsMetaQuery, GetNfTcontractsMetaQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetNfTcontractsMetaQuery, GetNfTcontractsMetaQueryVariables>(GetNfTcontractsMetaDocument, variables, options)
}
export type GetNfTcontractsMetaQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetNfTcontractsMetaQuery, GetNfTcontractsMetaQueryVariables>
