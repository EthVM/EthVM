import { EthBlock, Query } from './schema.graphql'
import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { RestLink } from 'apollo-link-rest'
import configs from '../../configs'

enum TypeNames {
    EthBlock = 'EthBlock'
}

const EthBlocksTypeDef = `${EthBlock} ${Query}`

const transformMeta = (data: any) => {
    if (data && data.metadata) {
        const meta = data.metadata
        return {
            img: meta.image,
            description: meta.description
        }
    }
    return null
}
const osRestLink = new RestLink({
    uri: 'https://ethblocksapi.mewapi.io',
    responseTransformer: async (response, typeName) => {
        const data = await response.json()
        if (typeName === TypeNames.EthBlock) {
            return transformMeta(data)
        }
    }
})

//  client
export const EthBlocksClient = new ApolloClient({
    link: osRestLink,
    cache: new InMemoryCache(),
    typeDefs: EthBlocksTypeDef
})
