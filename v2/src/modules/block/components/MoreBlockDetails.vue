<template>
    <v-card variant="flat" class="pa-4 pa-sm-6">
        <template v-if="props.isLoading || !props.blockDetails">
            <v-row class="my-2">
                <v-col cols="12" md="6">
                    <div class="skeleton-box rounded-xl mt-1" style="height: 24px"></div>
                </v-col>
            </v-row>
            <div v-for="i in 5" :key="i" class="skeleton-box rounded-xl my-5" style="height: 24px"></div>
        </template>
        <template v-else>
            <v-row>
                <v-col cols="12">
                    <div class="block-info mb-5">
                        <p class="text-button mb-1">Size</p>
                        <p class="text-info">
                            {{ props.blockDetails.blockSize.detail }}
                        </p>
                    </div>
                </v-col>
                <v-col cols="12">
                    <div class="block-info mb-5">
                        <p class="text-button mb-1">Nonce</p>
                        <p class="text-info">
                            {{ props.blockDetails.nonce.detail }}
                        </p>
                    </div>
                </v-col>
                <v-col cols="12">
                    <div class="block-info mb-5">
                        <p class="text-button mb-1">Difficulty</p>
                        <p class="text-info">
                            {{ props.blockDetails.difficulty.detail }}
                        </p>
                    </div>
                </v-col>
                <v-col cols="12">
                    <div class="block-info mb-5">
                        <p class="text-button mb-1">Total Difficulty</p>
                        <p class="text-info">
                            {{ props.blockDetails.totalDifficulty.detail }}
                        </p>
                    </div>
                </v-col>
            </v-row>
            <div class="block-info mb-5">
                <p class="text-button mb-1">State Root</p>
                <app-transform-hash :hash="props.blockDetails.stateRoot.detail" class="w-100" />
            </div>
            <div class="block-info mb-5">
                <p class="text-button mb-1">Receipt Root</p>
                <app-transform-hash :hash="props.blockDetails.receiptsRoot.detail" class="w-100" />
            </div>
            <div class="block-info mb-5">
                <p class="text-button mb-1">Transaction Root</p>
                <app-transform-hash :hash="props.blockDetails.transactionsRoot.detail" class="w-100" />
            </div>
            <div class="block-info mb-5">
                <p class="text-button mb-1">Logs Bloom</p>
                <p>
                    {{ props.blockDetails.logs.detail }}
                </p>
            </div>
            <div class="block-info mb-5">
                <p class="text-button mb-1">Extra Data</p>
                <p>
                    {{ props.blockDetails.extraData.detail }}
                </p>
            </div>
            <div v-if="props.uncleHashes && props.uncleHashes.length > 0" class="block-info mb-5">
                <p class="text-button mb-1">Uncles</p>
                <app-transform-hash v-for="uncle in props.uncleHashes" :key="uncle" :hash="eth.toCheckSum(uncle)" :link="`/uncle/${uncle}`" class="w-100" />
            </div>
            <div class="block-info mb-5">
                <p class="text-button mb-1">SHA3 Uncles</p>
                <app-transform-hash :hash="props.blockDetails.unclesSHA3.detail" class="w-100" />
            </div>
        </template>
    </v-card>
</template>

<script setup lang="ts">
import AppTransformHash from '@core/components/AppTransformHash.vue'
import { timeAgo, eth } from '@core/helper'
import { Detail } from '@core/components/props'

interface ComponentProps {
    blockDetails: { [key: string]: Detail } | null
    uncleHashes: string[]
    isLoading: boolean
}

const props = defineProps<ComponentProps>()
</script>

<style scoped></style>
