/* eslint-disable */
/**
 * NOTE: THIS IS AN AUTO-GENERATED FILE. DO NOT MODIFY IT DIRECTLY.
 */

import * as Types from '../../../apollo/types'

import gql from 'graphql-tag'
import * as VueApolloComposable from '@vue/apollo-composable'
import * as VueCompositionApi from 'vue'
export type ReactiveFunction<TParam> = () => TParam
export type NewBlockFeedSubscriptionVariables = Types.Exact<{ [key: string]: never }>

export type NewBlockFeedSubscription = {
    __typename?: 'Subscription'
    newBlockFeed: { __typename?: 'BlockSummary'; number: number; miner: string; txCount: number; timestamp: number }
}

export const NewBlockFeedDocument = gql`
    subscription newBlockFeed {
        newBlockFeed {
            number
            miner
            txCount
            timestamp
        }
    }
`

/**
 * __useNewBlockFeedSubscription__
 *
 * To run a query within a Vue component, call `useNewBlockFeedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewBlockFeedSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useNewBlockFeedSubscription();
 */
export function useNewBlockFeedSubscription(
    options:
        | VueApolloComposable.UseSubscriptionOptions<NewBlockFeedSubscription, NewBlockFeedSubscriptionVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<NewBlockFeedSubscription, NewBlockFeedSubscriptionVariables>>
        | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<NewBlockFeedSubscription, NewBlockFeedSubscriptionVariables>> = {}
) {
    return VueApolloComposable.useSubscription<NewBlockFeedSubscription, NewBlockFeedSubscriptionVariables>(NewBlockFeedDocument, {}, options)
}
export type NewBlockFeedSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<
    NewBlockFeedSubscription,
    NewBlockFeedSubscriptionVariables
>
