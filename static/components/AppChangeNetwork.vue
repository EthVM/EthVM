<template>
    <div>
        <v-btn id="network-dropdown" class="text-subtitle-1 font-weight-light text-body-1" rounded="pill" variant="outlined" height="24">
            Ethereum Mainnet
            <v-icon class="ml-1" size="16">expand_more</v-icon>
            <app-menu min-width="180" activator="parent">
                <v-list-item title="Ethereum Mainnet" class="py-2 network-item" href="https://www.ethvm.com/" target="_blank"> </v-list-item>
                <v-list-item title="Sepolia Testnet" class="py-2 network-item" href="https://sepolia.ethvm.com/" target="_blank"></v-list-item>
            </app-menu>
        </v-btn>
    </div>
</template>

<script setup lang="ts"></script>
<style>
.network-item {
    cursor: pointer;
}
</style>
