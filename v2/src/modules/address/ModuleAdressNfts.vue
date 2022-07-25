<template>
    <div>NFT Collections</div>
</template>

<script setup lang="ts">
import {
    PrimaryAssetContractFragment,
    TokenContractFragment,
    useGetNfTcontractsMetaQuery,
    useGetOwnersErc721BalancesQuery
} from '@module/address/apollo/tokens.generated'
import { computed } from 'vue'

const props = defineProps({
    addressHash: { type: String, required: true }
})

// Load NFT Contracts
const { result: nftContracts } = useGetNfTcontractsMetaQuery(
    () => ({
        address: props.addressHash
    }),
    {
        clientId: 'openSeaClient'
    }
)

const nftContractsMeta = computed<TokenContractFragment[] | undefined>(() => {
    return nftContracts.value?.getNFTcontractsMeta.tokenContracts
})
const nftContractMetaMap = computed<Map<string, PrimaryAssetContractFragment> | null>(() => {
    if (nftContractsMeta.value) {
        const map = new Map()
        nftContractsMeta.value.forEach(contract => {
            if (contract && contract.primary_asset_contracts) {
                contract.primary_asset_contracts.forEach(asset => {
                    map.set(asset.address, asset)
                })
            }
        })
        return map
    }
    return null
})

// Load ERC721 tokens
const { result: ercOwner721Balances } = useGetOwnersErc721BalancesQuery(() => ({
    hash: props.addressHash
}))
</script>
