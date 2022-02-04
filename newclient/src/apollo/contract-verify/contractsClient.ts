import { PayloadContract, ContractConfigs, ContractInput, SourceContent, Query } from './schema.graphql'
import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { RestLink } from 'apollo-link-rest'
import configs from '../../configs'

enum TypeNames {
    INPUT = 'ContractInput',
    CONFIGS = 'ContractConfigs',
    SOURCE = 'SourceContent'
}

const ContractsTypeDef = `${PayloadContract} ${ContractConfigs} ${Query} ${ContractInput} ${SourceContent}`

const transformContractInput = (data: any) => {
    if (data) {
        const keys = Object.keys(data.sources)
        const _sources = keys.map(i => {
            return {
                __typename: TypeNames.SOURCE,
                name: i,
                content: data.sources[i].content
            }
        })
        return {
            language: data.language || '',
            sources: _sources
        }
    }
    return undefined
}

const transformContractConfigs = (data: any) => {
    if (data) {
        const configs = data
        return {
            compiler: configs.compiler,
            constructorBytes: configs.constructorBytes,
            evmVersion: configs.evmVersion,
            name: configs.name,
            optimization: configs.optimization,
            runs: configs.runs
        }
    }
    return undefined
}

const contractsRestLink = new RestLink({
    uri: 'https://raw.githubusercontent.com/EthVM/evm-source-verification/main/contracts/',
    responseTransformer: async (response, typeName) => {
        const data = await response.json()
        if (typeName === TypeNames.INPUT) {
            return transformContractInput(data)
        }
        return transformContractConfigs(data)
    }
})

//  client
export const ContractsClient = new ApolloClient({
    link: contractsRestLink,
    cache: new InMemoryCache(),
    typeDefs: ContractsTypeDef
})
