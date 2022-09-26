<template>
    <div class="pa-4 pa-sm-6">
        <div v-if="initialLoad" class="skeleton-box rounded-xl" :style="xs ? 'height: 66px' : 'height: 112px'"></div>
        <template v-else>
            <div v-if="erc721Tokens.length > 0" class="ma-n4 ma-sm-n6">
                <div v-for="token in erc721Tokens" :key="token.tokenInfo.contract">
                    <v-lazy @update:modelValue="tokenVisible($event, token.tokenInfo.contract)" min-height="250" :options="{ threshold: 0.5 }">
                        <div>
                            <template v-if="visibleTokens.has(token.tokenInfo.contract)">
                                <address-contract-nfts :name="token.tokenInfo.name" :contract="token.tokenInfo.contract" :address-hash="props.addressHash" />
                            </template>
                        </div>
                    </v-lazy>
                </div>
            </div>
            <app-no-result v-else text="This address does not hold any NFTs"></app-no-result>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Erc721BalanceFragment, useGetOwnersErc721BalancesQuery } from '@module/address/apollo/AddressTokens/tokens.generated'
import AddressContractNfts from '@module/address/components/AddressContractNfts.vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import AppNoResult from '@/core/components/AppNoResult.vue'
const { xs } = useDisplay()
const props = defineProps({
    addressHash: { type: String, required: true }
})

const visibleTokens = ref(new Set())

const tokenVisible = (isVisible: boolean, contract: string) => {
    if (isVisible && contract) {
        visibleTokens.value.add(contract)
    }
}

const initialLoad = ref(true)

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
</script>
