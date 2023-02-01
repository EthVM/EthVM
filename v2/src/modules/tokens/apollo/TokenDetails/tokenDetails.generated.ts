/* eslint-disable */
/**
 * NOTE: THIS IS AN AUTO-GENERATED FILE. DO NOT MODIFY IT DIRECTLY.
 */

import * as Types from '../../../../apollo/types'

import gql from 'graphql-tag'
import * as VueApolloComposable from '@vue/apollo-composable'
import * as VueCompositionApi from 'vue'
export type ReactiveFunction<TParam> = () => TParam
export type TokenDetailsFragment = {
    __typename?: 'EthTokenInfo'
    name?: string | null
    symbol?: string | null
    decimals?: number | null
    totalSupply?: string | null
    contract: string
    tokenId?: string | null
}

export type Erc20TokenOwnerDetailsFragment = {
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
}

export type GetTokenInfoByContractQueryVariables = Types.Exact<{
    contract: Types.Scalars['String']
}>

export type GetTokenInfoByContractQuery = {
    __typename?: 'Query'
    getTokenInfoByContract: {
        __typename?: 'EthTokenInfo'
        name?: string | null
        symbol?: string | null
        decimals?: number | null
        totalSupply?: string | null
        contract: string
        tokenId?: string | null
    }
}

export type GetErc20TokenBalanceQueryVariables = Types.Exact<{
    contract: Types.Scalars['String']
    owner: Types.Scalars['String']
}>

export type GetErc20TokenBalanceQuery = {
    __typename?: 'Query'
    getERC20TokenBalance: {
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
    }
}

export type GetNftContractMetaQueryVariables = Types.Exact<{
    input: Types.Scalars['String']
}>

export type GetNftContractMetaQuery = {
    __typename?: 'Query'
    getNFTContractMeta?: {
        __typename?: 'RespCollections'
        nextKey?: string | null
        collections: Array<{
            __typename?: 'RespCollection'
            name?: string | null
            description?: string | null
            image_url?: string | null
            external_url?: string | null
            twitter_username?: string | null
            discord_url?: string | null
            distinct_owner_count?: number | null
            distinct_nft_count?: number | null
            floor_prices: Array<{
                __typename?: 'RespNftFloorPrice'
                value?: number | null
                payment_token: { __typename?: 'RespPaymentToken'; name?: string | null; address?: string | null }
            }>
        }>
    } | null
}

export const TokenDetailsFragmentDoc = gql`
    fragment TokenDetails on EthTokenInfo {
        name
        symbol
        decimals
        totalSupply
        contract
        tokenId
    }
`
export const Erc20TokenOwnerDetailsFragmentDoc = gql`
    fragment ERC20TokenOwnerDetails on ERC20TokenBalance {
        tokenInfo {
            ...TokenDetails
        }
        owner
        balance
    }
    ${TokenDetailsFragmentDoc}
`
export const GetTokenInfoByContractDocument = gql`
    query getTokenInfoByContract($contract: String!) {
        getTokenInfoByContract(contract: $contract) {
            ...TokenDetails
        }
    }
    ${TokenDetailsFragmentDoc}
`

/**
 * __useGetTokenInfoByContractQuery__
 *
 * To run a query within a Vue component, call `useGetTokenInfoByContractQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTokenInfoByContractQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetTokenInfoByContractQuery({
 *   contract: // value for 'contract'
 * });
 */
export function useGetTokenInfoByContractQuery(
    variables:
        | GetTokenInfoByContractQueryVariables
        | VueCompositionApi.Ref<GetTokenInfoByContractQueryVariables>
        | ReactiveFunction<GetTokenInfoByContractQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetTokenInfoByContractQuery, GetTokenInfoByContractQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetTokenInfoByContractQuery, GetTokenInfoByContractQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetTokenInfoByContractQuery, GetTokenInfoByContractQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetTokenInfoByContractQuery, GetTokenInfoByContractQueryVariables>(GetTokenInfoByContractDocument, variables, options)
}
export function useGetTokenInfoByContractLazyQuery(
    variables:
        | GetTokenInfoByContractQueryVariables
        | VueCompositionApi.Ref<GetTokenInfoByContractQueryVariables>
        | ReactiveFunction<GetTokenInfoByContractQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetTokenInfoByContractQuery, GetTokenInfoByContractQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetTokenInfoByContractQuery, GetTokenInfoByContractQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetTokenInfoByContractQuery, GetTokenInfoByContractQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetTokenInfoByContractQuery, GetTokenInfoByContractQueryVariables>(
        GetTokenInfoByContractDocument,
        variables,
        options
    )
}
export type GetTokenInfoByContractQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<
    GetTokenInfoByContractQuery,
    GetTokenInfoByContractQueryVariables
>
export const GetErc20TokenBalanceDocument = gql`
    query getERC20TokenBalance($contract: String!, $owner: String!) {
        getERC20TokenBalance(contract: $contract, owner: $owner) {
            ...ERC20TokenOwnerDetails
        }
    }
    ${Erc20TokenOwnerDetailsFragmentDoc}
`

/**
 * __useGetErc20TokenBalanceQuery__
 *
 * To run a query within a Vue component, call `useGetErc20TokenBalanceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetErc20TokenBalanceQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetErc20TokenBalanceQuery({
 *   contract: // value for 'contract'
 *   owner: // value for 'owner'
 * });
 */
export function useGetErc20TokenBalanceQuery(
    variables:
        | GetErc20TokenBalanceQueryVariables
        | VueCompositionApi.Ref<GetErc20TokenBalanceQueryVariables>
        | ReactiveFunction<GetErc20TokenBalanceQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetErc20TokenBalanceQuery, GetErc20TokenBalanceQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetErc20TokenBalanceQuery, GetErc20TokenBalanceQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetErc20TokenBalanceQuery, GetErc20TokenBalanceQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetErc20TokenBalanceQuery, GetErc20TokenBalanceQueryVariables>(GetErc20TokenBalanceDocument, variables, options)
}
export function useGetErc20TokenBalanceLazyQuery(
    variables:
        | GetErc20TokenBalanceQueryVariables
        | VueCompositionApi.Ref<GetErc20TokenBalanceQueryVariables>
        | ReactiveFunction<GetErc20TokenBalanceQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetErc20TokenBalanceQuery, GetErc20TokenBalanceQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetErc20TokenBalanceQuery, GetErc20TokenBalanceQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetErc20TokenBalanceQuery, GetErc20TokenBalanceQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetErc20TokenBalanceQuery, GetErc20TokenBalanceQueryVariables>(GetErc20TokenBalanceDocument, variables, options)
}
export type GetErc20TokenBalanceQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<
    GetErc20TokenBalanceQuery,
    GetErc20TokenBalanceQueryVariables
>
export const GetNftContractMetaDocument = gql`
    query getNFTContractMeta($input: String!) {
        getNFTContractMeta(input: $input) @rest(type: "RespCollections", path: "/collections/ethereum/{args.input}", method: "GET") {
            nextKey
            collections @type(name: "RespCollection") {
                name
                description
                image_url
                external_url
                twitter_username
                discord_url
                distinct_owner_count
                distinct_nft_count
                floor_prices @type(name: "RespNftFloorPrice") {
                    value
                    payment_token {
                        name
                        address
                    }
                }
            }
        }
    }
`

/**
 * __useGetNftContractMetaQuery__
 *
 * To run a query within a Vue component, call `useGetNftContractMetaQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNftContractMetaQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetNftContractMetaQuery({
 *   input: // value for 'input'
 * });
 */
export function useGetNftContractMetaQuery(
    variables: GetNftContractMetaQueryVariables | VueCompositionApi.Ref<GetNftContractMetaQueryVariables> | ReactiveFunction<GetNftContractMetaQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetNftContractMetaQuery, GetNftContractMetaQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetNftContractMetaQuery, GetNftContractMetaQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetNftContractMetaQuery, GetNftContractMetaQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetNftContractMetaQuery, GetNftContractMetaQueryVariables>(GetNftContractMetaDocument, variables, options)
}
export function useGetNftContractMetaLazyQuery(
    variables: GetNftContractMetaQueryVariables | VueCompositionApi.Ref<GetNftContractMetaQueryVariables> | ReactiveFunction<GetNftContractMetaQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetNftContractMetaQuery, GetNftContractMetaQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetNftContractMetaQuery, GetNftContractMetaQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetNftContractMetaQuery, GetNftContractMetaQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetNftContractMetaQuery, GetNftContractMetaQueryVariables>(GetNftContractMetaDocument, variables, options)
}
export type GetNftContractMetaQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetNftContractMetaQuery, GetNftContractMetaQueryVariables>
