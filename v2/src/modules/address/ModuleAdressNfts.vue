<template>
    <div>
        <div v-for="token in erc721Tokens" :key="token.tokenInfo.contract">
            <v-lazy @update:modelValue="tokenVisible($event, token.tokenInfo.contract)" min-height="250" :options="{ threshold: 0.5 }">
                <div>
                    <template v-if="visibleTokens.has(token.tokenInfo.contract)">
                        <single-address-nfts :name="token.tokenInfo.name" :contract="token.tokenInfo.contract" :address-hash="props.addressHash" />
                    </template>
                </div>
            </v-lazy>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
    Erc721BalanceFragment,
    PrimaryAssetContractFragment,
    TokenContractFragment,
    useGetNfTcontractsMetaQuery,
    useGetOwnersErc721BalancesQuery
} from '@module/address/apollo/tokens.generated'
import SingleAddressNfts from '@module/address/components/SingleAddressNft.vue'

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

const nftContractsMeta = computed<Array<TokenContractFragment | null> | undefined | null>(() => {
    return nftContracts.value?.getNFTcontractsMeta.tokenContracts
})

const nftContractMetaMap = computed<Map<string, PrimaryAssetContractFragment> | null>(() => {
    if (nftContractsMeta.value) {
        const map = new Map<string, PrimaryAssetContractFragment>()
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
const visibleTokens = ref(new Set())

const tokenVisible = (isVisible: boolean, contract: string) => {
    if (isVisible && contract) {
        visibleTokens.value.add(contract)
    }
}

// Load ERC721 tokens
const { result: ercOwner721Balances, loading: loadingNfts } = useGetOwnersErc721BalancesQuery(() => ({
    hash: props.addressHash
}))

const erc721Tokens = computed<Array<Erc721BalanceFragment | null> | undefined>(() => {
    return ercOwner721Balances.value?.getOwnersERC721Balances
})
</script>
