import { AddressNFTcontracts, NFTContract, Query, rest, type } from './schema.graphql'
import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { RestLink } from 'apollo-link-rest'
import configs from '../../configs'

enum TypeNames {
    AddressNFTcontracts = 'AddressNFTcontracts'
}

const OpenSeaTypeDef = `${AddressNFTcontracts} ${NFTContract} ${Query} ${rest} ${type}`

const transformAddressNFTcontracts = (data: any) => {
    if (data.tokenContracts && data.address && data.tokenContracts.length > 0) {
        const contracts = data.tokenContracts.map(contract => {
            const primaryAssetContracts: any[] = []
            if (contract.contracts && contract.contracts.length > 0) {
                contract.contracts.forEach(hash => {
                    if (contract.primary_asset_contracts && contract.primary_asset_contracts[hash]) {
                        const meta = contract.primary_asset_contracts[hash]
                        primaryAssetContracts.push({
                            address: meta.address || null,
                            symbol: meta.symbol || null,
                            total_supply: meta.total_supply || null,
                            description: meta.description || null,
                            external_link: meta.external_link || null,
                            image_url: meta.image_url || null,
                            name: meta.name || null
                        })
                    }
                })
            }
            return {
                contractIdAddress: contract.contractIdAddress,
                owned_asset_count: contract.owned_asset_count || 0,
                name: contract.name || null,
                description: contract.description || null,
                contractImage: contract.contractImage || null,
                primary_asset_contracts: primaryAssetContracts
            }
        })

        return {
            adddress: data.address,
            tokenContracts: contracts
        }
    }
    return {
        adddress: data.address
    }
}
const osRestLink = new RestLink({
    uri: configs.OPENSEA,
    responseTransformer: async (response, typeName) => {
        const data = await response.json()
        if (typeName === TypeNames.AddressNFTcontracts) {
            return transformAddressNFTcontracts(data)
        }
    }
})

//  client
export const OpenSeaClient = new ApolloClient({
    link: osRestLink,
    cache: new InMemoryCache(),
    typeDefs: OpenSeaTypeDef
})
