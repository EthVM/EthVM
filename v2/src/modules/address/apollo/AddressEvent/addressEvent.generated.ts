/* eslint-disable */
/**
 * NOTE: THIS IS AN AUTO-GENERATED FILE. DO NOT MODIFY IT DIRECTLY.
 */

import * as Types from '../../../../apollo/types'

import gql from 'graphql-tag'
import * as VueApolloComposable from '@vue/apollo-composable'
import * as VueCompositionApi from 'vue'
export type ReactiveFunction<TParam> = () => TParam
export type AddressEventSubscriptionVariables = Types.Exact<{
    owner: Types.Scalars['String']
    event?: Types.InputMaybe<Types.AddressEventType>
}>

export type AddressEventSubscription = {
    __typename?: 'Subscription'
    addressEvent: { __typename?: 'AddressEvent'; blockNumber: number; event: Types.AddressEventType; timestamp: number; owner: string }
}

export const AddressEventDocument = gql`
    subscription addressEvent($owner: String!, $event: AddressEventType) {
        addressEvent(owner: $owner, event: $event) {
            blockNumber
            event
            timestamp
            owner
        }
    }
`

/**
 * __useAddressEventSubscription__
 *
 * To run a query within a Vue component, call `useAddressEventSubscription` and pass it any options that fit your needs.
 * When your component renders, `useAddressEventSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the subscription
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useAddressEventSubscription({
 *   owner: // value for 'owner'
 *   event: // value for 'event'
 * });
 */
export function useAddressEventSubscription(
    variables:
        | AddressEventSubscriptionVariables
        | VueCompositionApi.Ref<AddressEventSubscriptionVariables>
        | ReactiveFunction<AddressEventSubscriptionVariables>,
    options:
        | VueApolloComposable.UseSubscriptionOptions<AddressEventSubscription, AddressEventSubscriptionVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<AddressEventSubscription, AddressEventSubscriptionVariables>>
        | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<AddressEventSubscription, AddressEventSubscriptionVariables>> = {}
) {
    return VueApolloComposable.useSubscription<AddressEventSubscription, AddressEventSubscriptionVariables>(AddressEventDocument, variables, options)
}
export type AddressEventSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<
    AddressEventSubscription,
    AddressEventSubscriptionVariables
>
