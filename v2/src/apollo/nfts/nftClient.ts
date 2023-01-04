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
import { ResponceTokens } from './models'
import configs from '../../configs'

enum TypeNames {
    NftTokenMeta = 'NftTokenMeta'
}

const nftTypeDef = `${RespContract} ${RespNftOwner} ${RespNftPreviews} ${RespNftFloorPrice}  ${RespPaymentToken} ${RespMarketplace} ${RespCollection} ${RespNftMeta} ${RespNFT} ${RespNftTrait} ${RespTokens} ${Query}`

const transformNFTMeta = (data: ResponceTokens) => {
    return data.result
}
const nftRestLink = new RestLink({
    uri: 'https://partners.mewapi.io/nfts',
    responseTransformer: async (response, typeName) => {
        const data = await response.json()
        return transformNFTMeta(data)
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
