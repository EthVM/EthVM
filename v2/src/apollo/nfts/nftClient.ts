import {
    RespContract,
    RespNftOwner,
    RespNftPreviews,
    RespPaymentToken,
    RespNftFloorPrice,
    RespMarketplace,
    RespCollection,
    RespNftMeta,
    RespNftTrait,
    RespNFT,
    RespTokens,
    Query
} from './schema.graphql'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { RestLink } from 'apollo-link-rest'
import { ResponceTokens, ResponceCollection } from './models'

const nftTypeDef = `${RespContract} ${RespNftOwner} ${RespNftPreviews} ${RespNftFloorPrice}  ${RespPaymentToken} ${RespMarketplace} ${RespCollection} ${RespNftMeta} ${RespNFT} ${RespNftTrait} ${RespTokens} ${Query}`

const transformNFTMeta = (data: ResponceTokens) => {
    if (data.result.nfts) {
        data.result.nfts.forEach(nft => {
            if (nft.extra_metadata.attributes && nft.extra_metadata.attributes.length > 0) {
                return
            }
            if (nft.extra_metadata.attributes && nft.extra_metadata.attributes instanceof Object) {
                const traits = Object.keys(nft.extra_metadata.attributes)
                const newAttr = traits.map(i => {
                    return {
                        trait_type: i,
                        value: nft.extra_metadata.attributes[i]
                    }
                })
                nft.extra_metadata.attributes = newAttr
                return
            }
            if (nft.extra_metadata.traits && nft.extra_metadata.traits instanceof Object) {
                const traits = Object.keys(nft.extra_metadata.traits)
                const newAttr = traits.map(i => {
                    return {
                        trait_type: i,
                        value: nft.extra_metadata.traits[i]
                    }
                })
                nft.extra_metadata.traits = newAttr
                return
            }
            // SEND TO SENTRY OTHERWISE TO ADD PROCCESSING METHOD
            // nft.extra_metadata is not standardized, keep adding new processing methods
            nft.extra_metadata.attributes = []
            return
        })
    }
    return data.result
}

const transformContractMeta = (data: ResponceCollection) => {
    return {
        nextKey: data.result.previous,
        collections: data.result.collections
    }
}

const nftRestLink = new RestLink({
    uri: 'https://partners.mewapi.io/nfts',
    responseTransformer: async (response, typeName) => {
        const data = await response.json()
        return typeName === 'RespTokens' ? transformNFTMeta(data) : transformContractMeta(data)
    }
})

const nftCache = new InMemoryCache({
    typePolicies: {
        RespNFT: {
            keyFields: ['nft_id', 'contract_address']
        }
    }
})

//  client
export const NftClient = new ApolloClient({
    link: nftRestLink,
    cache: nftCache,
    typeDefs: nftTypeDef
})
