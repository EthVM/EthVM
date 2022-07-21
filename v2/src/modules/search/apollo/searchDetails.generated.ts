/* eslint-disable */
/**
 * NOTE: THIS IS AN AUTO-GENERATED FILE. DO NOT MODIFY IT DIRECTLY.
 */

import * as Types from '../../../apollo/types'

import gql from 'graphql-tag'
import * as VueApolloComposable from '@vue/apollo-composable'
import * as VueCompositionApi from 'vue'
export type ReactiveFunction<TParam> = () => TParam
export type GetHashTypeQueryVariables = Types.Exact<{
    hash: Types.Scalars['String']
}>

export type GetHashTypeQuery = { __typename?: 'Query'; getHashType: Types.HashType }

export type GetTokensBeginsWithQueryVariables = Types.Exact<{
    keyword: Types.Scalars['String']
}>

export type GetTokensBeginsWithQuery = {
    __typename?: 'Query'
    getTokensBeginsWith: Array<{ __typename?: 'TokenSearch'; contract: string; keyword: string } | null>
}

export const GetHashTypeDocument = gql`
    query getHashType($hash: String!) {
        getHashType(hash: $hash)
    }
`

/**
 * __useGetHashTypeQuery__
 *
 * To run a query within a Vue component, call `useGetHashTypeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetHashTypeQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetHashTypeQuery({
 *   hash: // value for 'hash'
 * });
 */
export function useGetHashTypeQuery(
    variables: GetHashTypeQueryVariables | VueCompositionApi.Ref<GetHashTypeQueryVariables> | ReactiveFunction<GetHashTypeQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetHashTypeQuery, GetHashTypeQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetHashTypeQuery, GetHashTypeQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetHashTypeQuery, GetHashTypeQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetHashTypeQuery, GetHashTypeQueryVariables>(GetHashTypeDocument, variables, options)
}
export function useGetHashTypeLazyQuery(
    variables: GetHashTypeQueryVariables | VueCompositionApi.Ref<GetHashTypeQueryVariables> | ReactiveFunction<GetHashTypeQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetHashTypeQuery, GetHashTypeQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetHashTypeQuery, GetHashTypeQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetHashTypeQuery, GetHashTypeQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetHashTypeQuery, GetHashTypeQueryVariables>(GetHashTypeDocument, variables, options)
}
export type GetHashTypeQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetHashTypeQuery, GetHashTypeQueryVariables>
export const GetTokensBeginsWithDocument = gql`
    query getTokensBeginsWith($keyword: String!) {
        getTokensBeginsWith(keyword: $keyword) {
            contract
            keyword
        }
    }
`

/**
 * __useGetTokensBeginsWithQuery__
 *
 * To run a query within a Vue component, call `useGetTokensBeginsWithQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTokensBeginsWithQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetTokensBeginsWithQuery({
 *   keyword: // value for 'keyword'
 * });
 */
export function useGetTokensBeginsWithQuery(
    variables:
        | GetTokensBeginsWithQueryVariables
        | VueCompositionApi.Ref<GetTokensBeginsWithQueryVariables>
        | ReactiveFunction<GetTokensBeginsWithQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetTokensBeginsWithQuery, GetTokensBeginsWithQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetTokensBeginsWithQuery, GetTokensBeginsWithQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetTokensBeginsWithQuery, GetTokensBeginsWithQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetTokensBeginsWithQuery, GetTokensBeginsWithQueryVariables>(GetTokensBeginsWithDocument, variables, options)
}
export function useGetTokensBeginsWithLazyQuery(
    variables:
        | GetTokensBeginsWithQueryVariables
        | VueCompositionApi.Ref<GetTokensBeginsWithQueryVariables>
        | ReactiveFunction<GetTokensBeginsWithQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetTokensBeginsWithQuery, GetTokensBeginsWithQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetTokensBeginsWithQuery, GetTokensBeginsWithQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetTokensBeginsWithQuery, GetTokensBeginsWithQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetTokensBeginsWithQuery, GetTokensBeginsWithQueryVariables>(GetTokensBeginsWithDocument, variables, options)
}
export type GetTokensBeginsWithQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetTokensBeginsWithQuery, GetTokensBeginsWithQueryVariables>
