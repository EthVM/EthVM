/* eslint-disable */
/**
 * NOTE: THIS IS AN AUTO-GENERATED FILE. DO NOT MODIFY IT DIRECTLY.
 */

import * as Types from '../../../../apollo/types'

import gql from 'graphql-tag'
import * as VueApolloComposable from '@vue/apollo-composable'
import * as VueCompositionApi from 'vue'
export type ReactiveFunction<TParam> = () => TParam
export type GetBlocksArrayByNumberQueryVariables = Types.Exact<{
    fromBlock?: Types.InputMaybe<Types.Scalars['Int']>
    limit?: Types.InputMaybe<Types.Scalars['Int']>
}>

export type GetBlocksArrayByNumberQuery = {
    __typename?: 'Query'
    getBlocksArrayByNumber: Array<{
        __typename?: 'BlockSummary'
        number: number
        miner: string
        txCount: number
        timestamp: number
        txFail: number
        rewards: { __typename?: 'BlockRewards'; total: string }
    } | null>
}

export type NewBlockTableSubscriptionVariables = Types.Exact<{ [key: string]: never }>

export type NewBlockTableSubscription = {
    __typename?: 'Subscription'
    newBlockFeed: {
        __typename?: 'BlockSummary'
        number: number
        miner: string
        txCount: number
        timestamp: number
        rewards: { __typename?: 'BlockRewards'; total: string }
    }
}

export const GetBlocksArrayByNumberDocument = gql`
    query getBlocksArrayByNumber($fromBlock: Int, $limit: Int) {
        getBlocksArrayByNumber(fromBlock: $fromBlock, limit: $limit) {
            number
            miner
            txCount
            timestamp
            rewards {
                total
            }
            txFail
        }
    }
`

/**
 * __useGetBlocksArrayByNumberQuery__
 *
 * To run a query within a Vue component, call `useGetBlocksArrayByNumberQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBlocksArrayByNumberQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetBlocksArrayByNumberQuery({
 *   fromBlock: // value for 'fromBlock'
 *   limit: // value for 'limit'
 * });
 */
export function useGetBlocksArrayByNumberQuery(
    variables:
        | GetBlocksArrayByNumberQueryVariables
        | VueCompositionApi.Ref<GetBlocksArrayByNumberQueryVariables>
        | ReactiveFunction<GetBlocksArrayByNumberQueryVariables> = {},
    options:
        | VueApolloComposable.UseQueryOptions<GetBlocksArrayByNumberQuery, GetBlocksArrayByNumberQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetBlocksArrayByNumberQuery, GetBlocksArrayByNumberQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetBlocksArrayByNumberQuery, GetBlocksArrayByNumberQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetBlocksArrayByNumberQuery, GetBlocksArrayByNumberQueryVariables>(GetBlocksArrayByNumberDocument, variables, options)
}
export function useGetBlocksArrayByNumberLazyQuery(
    variables:
        | GetBlocksArrayByNumberQueryVariables
        | VueCompositionApi.Ref<GetBlocksArrayByNumberQueryVariables>
        | ReactiveFunction<GetBlocksArrayByNumberQueryVariables> = {},
    options:
        | VueApolloComposable.UseQueryOptions<GetBlocksArrayByNumberQuery, GetBlocksArrayByNumberQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetBlocksArrayByNumberQuery, GetBlocksArrayByNumberQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetBlocksArrayByNumberQuery, GetBlocksArrayByNumberQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetBlocksArrayByNumberQuery, GetBlocksArrayByNumberQueryVariables>(
        GetBlocksArrayByNumberDocument,
        variables,
        options
    )
}
export type GetBlocksArrayByNumberQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<
    GetBlocksArrayByNumberQuery,
    GetBlocksArrayByNumberQueryVariables
>
export const NewBlockTableDocument = gql`
    subscription newBlockTable {
        newBlockFeed {
            number
            miner
            txCount
            timestamp
            rewards {
                total
            }
        }
    }
`

/**
 * __useNewBlockTableSubscription__
 *
 * To run a query within a Vue component, call `useNewBlockTableSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewBlockTableSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useNewBlockTableSubscription();
 */
export function useNewBlockTableSubscription(
    options:
        | VueApolloComposable.UseSubscriptionOptions<NewBlockTableSubscription, NewBlockTableSubscriptionVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<NewBlockTableSubscription, NewBlockTableSubscriptionVariables>>
        | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<NewBlockTableSubscription, NewBlockTableSubscriptionVariables>> = {}
) {
    return VueApolloComposable.useSubscription<NewBlockTableSubscription, NewBlockTableSubscriptionVariables>(NewBlockTableDocument, {}, options)
}
export type NewBlockTableSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<
    NewBlockTableSubscription,
    NewBlockTableSubscriptionVariables
>
