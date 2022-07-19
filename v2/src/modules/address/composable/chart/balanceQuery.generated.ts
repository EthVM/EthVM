/**
 * NOTE: THIS IS AN AUTO-GENERATED FILE. DO NOT MODIFY IT DIRECTLY.
 */
/* eslint-disable */

import * as Types from '../../../../apollo/types'

import gql from 'graphql-tag'
import * as VueApolloComposable from '@vue/apollo-composable'
import * as VueCompositionApi from 'vue'
export type ReactiveFunction<TParam> = () => TParam
export type GetTimeseriesDataQueryVariables = Types.Exact<{
    key: Types.Scalars['String']
    scale: Types.TimeseriesScale
    fromT: Types.Scalars['Int']
    toT?: Types.InputMaybe<Types.Scalars['Int']>
    nextKey?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetTimeseriesDataQuery = {
    __typename?: 'Query'
    getTimeseriesData: {
        __typename?: 'TimeseriesResponse'
        nextKey?: string | null
        items: Array<{ __typename?: 'TimeseriesData'; value: string; timestamp: number } | null>
    }
}

export type TimeseriesEthAvgSubscriptionVariables = Types.Exact<{
    key: Types.Scalars['String']
    scale: Types.TimeseriesScale
}>

export type TimeseriesEthAvgSubscription = {
    __typename?: 'Subscription'
    timeseriesEvent: {
        __typename?: 'TimeseriesEvent'
        key: string
        scale: Types.TimeseriesScale
        item: { __typename?: 'TimeseriesData'; value: string; timestamp: number }
    }
}

export const GetTimeseriesDataDocument = gql`
    query getTimeseriesData($key: String!, $scale: TimeseriesScale!, $fromT: Int!, $toT: Int, $nextKey: String) {
        getTimeseriesData(key: $key, scale: $scale, fromT: $fromT, toT: $toT, nextKey: $nextKey) {
            items {
                value
                timestamp
            }
            nextKey
        }
    }
`

/**
 * __useGetTimeseriesDataQuery__
 *
 * To run a query within a Vue component, call `useGetTimeseriesDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTimeseriesDataQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetTimeseriesDataQuery({
 *   key: // value for 'key'
 *   scale: // value for 'scale'
 *   fromT: // value for 'fromT'
 *   toT: // value for 'toT'
 *   nextKey: // value for 'nextKey'
 * });
 */
export function useGetTimeseriesDataQuery(
    variables: GetTimeseriesDataQueryVariables | VueCompositionApi.Ref<GetTimeseriesDataQueryVariables> | ReactiveFunction<GetTimeseriesDataQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetTimeseriesDataQuery, GetTimeseriesDataQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetTimeseriesDataQuery, GetTimeseriesDataQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetTimeseriesDataQuery, GetTimeseriesDataQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetTimeseriesDataQuery, GetTimeseriesDataQueryVariables>(GetTimeseriesDataDocument, variables, options)
}
export function useGetTimeseriesDataLazyQuery(
    variables: GetTimeseriesDataQueryVariables | VueCompositionApi.Ref<GetTimeseriesDataQueryVariables> | ReactiveFunction<GetTimeseriesDataQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetTimeseriesDataQuery, GetTimeseriesDataQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetTimeseriesDataQuery, GetTimeseriesDataQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetTimeseriesDataQuery, GetTimeseriesDataQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetTimeseriesDataQuery, GetTimeseriesDataQueryVariables>(GetTimeseriesDataDocument, variables, options)
}
export type GetTimeseriesDataQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetTimeseriesDataQuery, GetTimeseriesDataQueryVariables>
export const TimeseriesEthAvgDocument = gql`
    subscription timeseriesEthAvg($key: String!, $scale: TimeseriesScale!) {
        timeseriesEvent(key: $key, scale: $scale) {
            key
            scale
            item {
                value
                timestamp
            }
        }
    }
`

/**
 * __useTimeseriesEthAvgSubscription__
 *
 * To run a query within a Vue component, call `useTimeseriesEthAvgSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTimeseriesEthAvgSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the subscription
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useTimeseriesEthAvgSubscription({
 *   key: // value for 'key'
 *   scale: // value for 'scale'
 * });
 */
export function useTimeseriesEthAvgSubscription(
    variables:
        | TimeseriesEthAvgSubscriptionVariables
        | VueCompositionApi.Ref<TimeseriesEthAvgSubscriptionVariables>
        | ReactiveFunction<TimeseriesEthAvgSubscriptionVariables>,
    options:
        | VueApolloComposable.UseSubscriptionOptions<TimeseriesEthAvgSubscription, TimeseriesEthAvgSubscriptionVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<TimeseriesEthAvgSubscription, TimeseriesEthAvgSubscriptionVariables>>
        | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<TimeseriesEthAvgSubscription, TimeseriesEthAvgSubscriptionVariables>> = {}
) {
    return VueApolloComposable.useSubscription<TimeseriesEthAvgSubscription, TimeseriesEthAvgSubscriptionVariables>(
        TimeseriesEthAvgDocument,
        variables,
        options
    )
}
export type TimeseriesEthAvgSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<
    TimeseriesEthAvgSubscription,
    TimeseriesEthAvgSubscriptionVariables
>
