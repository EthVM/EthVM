import {
    PayloadContract,
    ContractConfigs,
    ContractInput,
    SourceContent,
    ContractMetaVerified,
    AbiItem,
    AbiInput,
    AbiOutput,
    StateMutabilityType,
    AbiType,
    encodedMetadataType,
    Query
} from './schema.graphql'
import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { RestLink } from 'apollo-link-rest'

enum TypeNames {
    INPUT = 'ContractInput',
    CONFIGS = 'ContractConfigs',
    SOURCE = 'SourceContent',
    META = 'ContractMetaVerified'
}

const ContractsTypeDef = `${PayloadContract} ${ContractConfigs} ${Query} ${ContractInput} ${SourceContent} ${ContractMetaVerified} ${AbiItem} ${AbiInput} ${AbiOutput} ${StateMutabilityType} ${AbiType} ${encodedMetadataType}`

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
    return null
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
    return null
}
const transformContractMeta = (data: any) => {
    if (data) {
        return {
            opcodeHash: data.opcodeHash,
            metalessHash: data.metalessHash,
            runtimeHash: data.runtimeHash,
            encodedMetadata: data.encodedMetadata,
            abi: data.abi,
            deployedByteCode: data.deployedBytecode.object,
            byteCode: data.bytecode.object,
            abiStringify: JSON.stringify(data.abi, null, 2)
        }
    }
    return null
}

const contractsRestLink = new RestLink({
    uri: 'https://raw.githubusercontent.com/EthVM/evm-source-verification/main/contracts/',
    responseTransformer: async (response, typeName) => {
        try {
            const data = await response.json()
            if (typeName === TypeNames.INPUT) {
                return transformContractInput(data)
            }
            if (typeName === TypeNames.META) {
                return transformContractMeta(data)
            }
            return transformContractConfigs(data)
        } catch (err) {
            return null
        }
    }
})

//  client
export const ContractsClient = new ApolloClient({
    link: contractsRestLink,
    cache: new InMemoryCache(),
    typeDefs: ContractsTypeDef
})
