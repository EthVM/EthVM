<template>
    <div>
        <v-btn class="text-subtitle-1 font-weight-light text-body-1" rounded="pill" variant="outlined" height="24" id="network-dropdown">
            {{ networkName }}
            <v-icon class="ml-1" size="16">expand_more</v-icon>
        </v-btn>
        <app-menu min-width="180" activator="#network-dropdown">
            <v-list-item
                title="Ethereum Mainnet"
                class="py-2 network-item"
                :href="getIsCurrNetwork(ETH_NAME) ? undefined : 'https://www.ethvm.com/'"
                :target="getIsCurrNetwork(ETH_NAME) ? '_self' : '_blank'"
            >
            </v-list-item>
            <v-list-item
                title="Sepolia Testnet"
                class="py-2 network-item"
                :href="getIsCurrNetwork(SEP_NAME) ? undefined : 'https://sepolia.ethvm.com/'"
                :target="getIsCurrNetwork(SEP_NAME) ? '_self' : '_blank'"
            ></v-list-item>
        </app-menu>
    </div>
</template>

<script setup lang="ts">
import AppMenu from './AppMenu.vue'
import { useNetwork } from '../composables/Network/useNetwork'
import { NETWORKS, DEFAULT_NETWORK } from '@core/helper/networks'
const { networkName } = useNetwork()

const ETH_NAME = NETWORKS[DEFAULT_NETWORK].name
const SEP_NAME = NETWORKS.SEPOLIA.name

const getIsCurrNetwork = (_name: string): boolean => {
    return networkName.value === _name
}
</script>
<style>
.network-item {
    cursor: pointer;
}
</style>
