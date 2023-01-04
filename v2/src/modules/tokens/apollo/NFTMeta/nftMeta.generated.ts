/* eslint-disable */
/**
 * NOTE: THIS IS AN AUTO-GENERATED FILE. DO NOT MODIFY IT DIRECTLY.
 */

import * as Types from '../../../../apollo/types'

import gql from 'graphql-tag'
import * as VueApolloComposable from '@vue/apollo-composable'
import * as VueCompositionApi from 'vue'
export type ReactiveFunction<TParam> = () => TParam
export type GetNftTokensMetaQueryVariables = Types.Exact<{
    input: Types.Scalars['String']
}>

export type GetNftTokensMetaQuery = {
    __typename?: 'Query'
    getNFTTokensMeta?: {
        __typename?: 'RespTokens'
        nfts?: Array<{
            __typename?: 'RespNFT'
            nft_id: string
            chain: string
            contract_address: string
            token_id?: string | null
            name?: string | null
            description?: string | null
            image_url?: string | null
            video_url?: string | null
            audio_url?: string | null
            model_url?: string | null
            previews: { __typename?: 'RespNftPreviews'; image_small_url?: string | null; image_large_url?: string | null }
            extra_metadata?: { __typename?: 'RespNftMeta'; attributes: Array<{ __typename?: 'RespNftTrait'; trait_type: string; value: string }> } | null
        }> | null
    } | null
}

export type NftMetaFragment = {
    __typename?: 'RespNFT'
    nft_id: string
    chain: string
    contract_address: string
    token_id?: string | null
    name?: string | null
    description?: string | null
    image_url?: string | null
    video_url?: string | null
    audio_url?: string | null
    model_url?: string | null
    previews: { __typename?: 'RespNftPreviews'; image_small_url?: string | null; image_large_url?: string | null }
    extra_metadata?: { __typename?: 'RespNftMeta'; attributes: Array<{ __typename?: 'RespNftTrait'; trait_type: string; value: string }> } | null
}

export const NftMetaFragmentDoc = gql`
    fragment NFTMeta on RespNFT {
        nft_id
        chain
        contract_address
        token_id
        name
        description
        image_url
        video_url
        audio_url
        model_url
        previews {
            image_small_url
            image_large_url
        }
        extra_metadata {
            attributes {
                trait_type
                value
            }
        }
    }
`
export const GetNftTokensMetaDocument = gql`
    query getNFTTokensMeta($input: String!) {
        getNFTTokensMeta(input: $input) @rest(type: "RespTokens", path: "/assets?nft_ids={args.input}", method: "GET") {
            nfts @type(name: "RespNFT") {
                ...NFTMeta
            }
        }
    }
    ${NftMetaFragmentDoc}
`

/**
 * __useGetNftTokensMetaQuery__
 *
 * To run a query within a Vue component, call `useGetNftTokensMetaQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNftTokensMetaQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetNftTokensMetaQuery({
 *   input: // value for 'input'
 * });
 */
export function useGetNftTokensMetaQuery(
    variables: GetNftTokensMetaQueryVariables | VueCompositionApi.Ref<GetNftTokensMetaQueryVariables> | ReactiveFunction<GetNftTokensMetaQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetNftTokensMetaQuery, GetNftTokensMetaQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetNftTokensMetaQuery, GetNftTokensMetaQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetNftTokensMetaQuery, GetNftTokensMetaQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetNftTokensMetaQuery, GetNftTokensMetaQueryVariables>(GetNftTokensMetaDocument, variables, options)
}
export function useGetNftTokensMetaLazyQuery(
    variables: GetNftTokensMetaQueryVariables | VueCompositionApi.Ref<GetNftTokensMetaQueryVariables> | ReactiveFunction<GetNftTokensMetaQueryVariables>,
    options:
        | VueApolloComposable.UseQueryOptions<GetNftTokensMetaQuery, GetNftTokensMetaQueryVariables>
        | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetNftTokensMetaQuery, GetNftTokensMetaQueryVariables>>
        | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetNftTokensMetaQuery, GetNftTokensMetaQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetNftTokensMetaQuery, GetNftTokensMetaQueryVariables>(GetNftTokensMetaDocument, variables, options)
}
export type GetNftTokensMetaQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetNftTokensMetaQuery, GetNftTokensMetaQueryVariables>
