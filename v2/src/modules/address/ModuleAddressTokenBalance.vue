<template>
    <v-card fluid class="py-4 px-8 pa-md-6 h-100" elevation="1" rounded="xl">
        <p class="text-info text-h6 font-weight-regular">Token Balance</p>
        <v-col v-if="store.loadingErc20Tokens || store.loadingCoinData" cols="6" sm="4" md="6" class="pa-0">
            <v-progress-linear height="28px" rounded="xl" indeterminate color="#ECF2F7" bg-color="info" width="100px"></v-progress-linear>
        </v-col>
        <template v-else>
            <p class="text-h4">${{ store.addressTokenBalance.value }}</p>
            <p class="text-caption font-weight-regular text-info">{{ store.numOfErc20Tokens }} total tokens</p>
            <v-divider class="my-6" />
            <p class="text-info text-h6 font-weight-regular">Total NFT's</p>
            <p class="text-h4">200</p>
        </template>
    </v-card>
</template>

<script setup lang="ts">
import { useStore } from '@/store'

const store = useStore()
</script>

<style scoped></style>
