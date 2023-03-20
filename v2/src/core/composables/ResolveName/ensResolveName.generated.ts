/* eslint-disable */
/**
 * NOTE: THIS IS AN AUTO-GENERATED FILE. DO NOT MODIFY IT DIRECTLY.
 */

import * as Types from '../../../apollo/types'

import gql from 'graphql-tag'
import * as VueApolloComposable from '@vue/apollo-composable'
import * as VueCompositionApi from 'vue'
export type ReactiveFunction<TParam> = () => TParam
export type EnsResolveNameQueryVariables = Types.Exact<{
    hash: Types.Scalars['ID']
}>

export type EnsResolveNameQuery = {
    __typename?: 'Query'
    domains: Array<{ __typename?: 'Domain'; name?: string | null; labelName?: string | null; resolvedAddress?: { __typename?: 'Account'; id: string } | null }>
}

export const EnsResolveNameDocument = gql`
    query ensResolveName($hash: ID!) {
        domains(where: { id: $hash }) {
            name
            labelName
            resolvedAddress {
                id
            }
        }
    }
`

/**
 * __useEnsResolveNameQuery__
 *
 * To run a query within a Vue component, call `useEnsResolveNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useEnsResolveNameQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useEnsResolveNameQuery({
 *   hash: // value for 'hash'
 * });
 */
export function useEnsResolveNameQuery(
    variables: EnsResolveNameQueryVariables | VueCompositionApi.Ref<EnsResolveNameQueryVariables> | ReactiveFunction<EnsResolveNameQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<EnsResolveNameQuery, EnsResolveNameQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<EnsResolveNameQuery, EnsResolveNameQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<EnsResolveNameQuery, EnsResolveNameQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<EnsResolveNameQuery, EnsResolveNameQueryVariables>(EnsResolveNameDocument, variables, options)
}
export function useEnsResolveNameLazyQuery(
    variables: EnsResolveNameQueryVariables | VueCompositionApi.Ref<EnsResolveNameQueryVariables> | ReactiveFunction<EnsResolveNameQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<EnsResolveNameQuery, EnsResolveNameQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<EnsResolveNameQuery, EnsResolveNameQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<EnsResolveNameQuery, EnsResolveNameQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<EnsResolveNameQuery, EnsResolveNameQueryVariables>(EnsResolveNameDocument, variables, options)
}
export type EnsResolveNameQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<EnsResolveNameQuery, EnsResolveNameQueryVariables>
