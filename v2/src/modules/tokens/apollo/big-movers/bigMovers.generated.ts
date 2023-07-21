/* eslint-disable */
/**
 * NOTE: THIS IS AN AUTO-GENERATED FILE. DO NOT MODIFY IT DIRECTLY.
 */

import * as Types from '../../../../apollo/types'

import gql from 'graphql-tag'
import * as VueApolloComposable from '@vue/apollo-composable'
import * as VueCompositionApi from 'vue'
export type ReactiveFunction<TParam> = () => TParam
export type BigMoverFragment = {
    __typename?: 'TokenMarketMoversItem'
    contractAddress?: string | null
    name: string
    symbol: string
    type: Types.TokenMarketMoverType
    eventTimestampUnixSec: number
    price?: number | null
    iconPng?: string | null
    priceChangePercentage?: number | null
    coingeckoCoinId: string
}

export type GetBigMoversQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetBigMoversQuery = {
    __typename?: 'Query'
    getTokenMarketMovers: {
        __typename?: 'GetTokenMarketMoversResult'
        items: Array<{
            __typename?: 'TokenMarketMoversItem'
            contractAddress?: string | null
            name: string
            symbol: string
            type: Types.TokenMarketMoverType
            eventTimestampUnixSec: number
            price?: number | null
            iconPng?: string | null
            priceChangePercentage?: number | null
            coingeckoCoinId: string
        }>
    }
}

export const BigMoverFragmentDoc = gql`
    fragment BigMover on TokenMarketMoversItem {
        contractAddress
        name
        symbol
        type
        eventTimestampUnixSec
        price
        iconPng
        priceChangePercentage
        coingeckoCoinId
    }
`
export const GetBigMoversDocument = gql`
    query getBigMovers {
        getTokenMarketMovers {
            items {
                ...BigMover
            }
        }
    }
    ${BigMoverFragmentDoc}
`

/**
 * __useGetBigMoversQuery__
 *
 * To run a query within a Vue component, call `useGetBigMoversQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBigMoversQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetBigMoversQuery();
 */
export function useGetBigMoversQuery(
    options:
        | VueApolloComposable.UseQueryOptions<GetBigMoversQuery, GetBigMoversQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetBigMoversQuery, GetBigMoversQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetBigMoversQuery, GetBigMoversQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetBigMoversQuery, GetBigMoversQueryVariables>(GetBigMoversDocument, {}, options)
}
export function useGetBigMoversLazyQuery(
    options:
        | VueApolloComposable.UseQueryOptions<GetBigMoversQuery, GetBigMoversQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetBigMoversQuery, GetBigMoversQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetBigMoversQuery, GetBigMoversQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetBigMoversQuery, GetBigMoversQueryVariables>(GetBigMoversDocument, {}, options)
}
export type GetBigMoversQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetBigMoversQuery, GetBigMoversQueryVariables>
