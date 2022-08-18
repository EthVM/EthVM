<template>
    <div>
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
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Erc721BalanceFragment, useGetOwnersErc721BalancesQuery } from '@module/address/apollo/AddressTokens/tokens.generated'
import AddressContractNfts from '@module/address/components/AddressContractNfts.vue'
const props = defineProps({
    addressHash: { type: String, required: true }
})

const visibleTokens = ref(new Set())

const tokenVisible = (isVisible: boolean, contract: string) => {
    if (isVisible && contract) {
        visibleTokens.value.add(contract)
    }
}

// Load ERC721 tokens
const { result: ercOwner721Balances } = useGetOwnersErc721BalancesQuery(() => ({
    hash: props.addressHash
}))

const erc721Tokens = computed<Array<Erc721BalanceFragment | null> | undefined>(() => {
    return ercOwner721Balances.value?.getOwnersERC721Balances
})
</script>
