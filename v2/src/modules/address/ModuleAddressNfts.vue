<template>
    <div class="pa-4 pa-sm-6">
        <div v-if="initialLoad && initialLoadMeta" class="skeleton-box rounded-xl" :style="xs ? 'height: 66px' : 'height: 112px'"></div>
        <template v-else>
            <div v-if="erc721Tokens && erc721Tokens.length > 0" class="ma-n4 ma-sm-n6">
                <div v-for="token in erc721Tokens" :key="token?.tokenInfo.contract">
                    <v-lazy v-if="token" @update:modelValue="tokenVisible($event, token.tokenInfo.contract)" min-height="250" :options="{ threshold: 0.5 }">
                        <div>
                            <template v-if="visibleTokens.has(token.tokenInfo.contract)">
                                <address-contract-nfts
                                    :name="getContractName(token)"
                                    :img="getContractImg(token)"
                                    :contract="token.tokenInfo.contract"
                                    :address-hash="props.addressHash"
                                />
                            </template>
                        </div>
                    </v-lazy>
                </div>
            </div>
            <app-no-result v-else :text="$t('address.tagline.noNFTAtAddress')"></app-no-result>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from 'vue'
import { Erc721BalanceFragment, useGetOwnersErc721BalancesQuery, useGetNfTcontractsMetaQuery } from '@module/address/apollo/AddressTokens/tokens.generated'
import AddressContractNfts from '@module/address/components/AddressContractNfts.vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import AppNoResult from '@/core/components/AppNoResult.vue'

const { xs } = useDisplay()
const props = defineProps({
    addressHash: { type: String, required: true }
})

const initialLoad = ref(true)

const visibleTokens = ref(new Set())

const tokenVisible = (isVisible: boolean, contract: string) => {
    if (isVisible && contract) {
        visibleTokens.value.add(contract)
    }
}

// Load ERC721 tokens
const { result: ercOwner721Balances, onResult: onNftLoaded } = useGetOwnersErc721BalancesQuery(
    () => ({
        hash: props.addressHash
    }),
    () => ({
        fetchPolicy: 'cache-and-network'
    })
)

onNftLoaded(() => {
    initialLoad.value = false
})

const erc721Tokens = computed<Array<Erc721BalanceFragment | null> | undefined>(() => {
    return ercOwner721Balances.value?.getOwnersERC721Balances
})

/**
 * Handle load NFT contract's meta
 */
interface ContractMeta {
    img: string | null
    name: string | null
}
interface ContractImageMap {
    [key: string]: ContractMeta
}

const contractMap = reactive<ContractImageMap>({})

const { result: ercOwner721Contracts, onResult: onNftMetaLoaded } = useGetNfTcontractsMetaQuery(
    () => ({
        address: props.addressHash
    }),
    () => ({
        clientId: 'openSeaClient',
        fetchPolicy: 'cache-and-network'
    })
)
const initialLoadMeta = ref(true)

onNftMetaLoaded(() => {
    if (ercOwner721Contracts.value) {
        ercOwner721Contracts.value?.getNFTcontractsMeta.tokenContracts?.forEach(i => {
            if (i && i.contractIdAddress) {
                contractMap[i.contractIdAddress] = {
                    img: i.contractImage || null,
                    name: i.name || null
                }
            }
        })
    }
    initialLoadMeta.value = false
})

const getContractName = (token: Erc721BalanceFragment): string => {
    const contract = token.tokenInfo.contract
    if (contractMap[contract]) {
        const name = contractMap[contract].name
        if (name) {
            return name
        }
    }
    return token.tokenInfo.name || 'Unknown'
}

const getContractImg = (token: Erc721BalanceFragment): string => {
    const contract = token.tokenInfo.contract
    if (contractMap[contract]) {
        const img = contractMap[contract].img
        if (img) {
            return img
        }
    }
    return ''
}
</script>
