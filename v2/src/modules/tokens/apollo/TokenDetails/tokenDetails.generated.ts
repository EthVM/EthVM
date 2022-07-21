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
        }
    }
}

export const TokenDetailsFragmentDoc = gql`
    fragment TokenDetails on EthTokenInfo {
        name
        symbol
        decimals
        totalSupply
        contract
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
