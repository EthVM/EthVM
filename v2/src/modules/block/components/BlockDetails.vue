<template>
    <v-card variant="elevated" elevation="1" rounded="xl" class="pa-4 pa-sm-6">
        <template v-if="isLoading">
            <div class="skeleton-box rounded-xl mt-1" style="height: 300px"></div>
        </template>
        <template v-else>
            <div class="d-flex align-center mx-n3">
                <template v-if="props.previousBlock">
                    <app-btn-icon icon="chevron_left" color="secondary" :disabled="!props.previousBlock" :link="props.previousBlock" />
                </template>
                <h1 class="text-h6 font-weight-bold">Block #{{ formatNumber(props.currBlockNumber) }}</h1>
                <template v-if="props.nextBlock">
                    <app-btn-icon icon="chevron_right" color="secondary" :disabled="!props.nextBlock" :link="props.nextBlock" />
                </template>
            </div>
            <span class="text-info text-subtitle-2 font-weight-regular">
                {{ props.timestamp }}
            </span>
            <v-row class="my-7">
                <v-col md="12" lg="6" class="text-textPrimary">
                    <div class="block-info mb-5">
                        <p class="text-button mb-1">Miner</p>
                        <div class="d-flex align-center">
                            <app-address-blockie :address="props.blockDetails.miner.detail || ''" :size="8" class="mr-1 mr-sm-2" />
                            <app-transform-hash is-blue :hash="props.blockDetails.miner.detail" :link="props.blockDetails.miner.link" class="w-100" />
                        </div>
                    </div>
                    <div class="block-info mb-5">
                        <p class="text-button mb-1">Hash</p>
                        <app-transform-hash is-blue :hash="props.blockDetails.hash.detail" class="w-100" />
                    </div>
                    <div class="block-info mb-5">
                        <p class="text-button mb-1">Parent Hash</p>
                        <app-transform-hash is-blue :hash="props.blockDetails.parentHash.detail" :link="props.blockDetails.parentHash.link" class="w-100" />
                    </div>
                </v-col>
                <v-col md="12" lg="5">
                    <div class="rounded-xl bg-tableGrey pa-5 text-textPrimary">
                        <v-row>
                            <v-col cols="6" sm="4">
                                <div class="block-info mb-5">
                                    <p class="text-button mb-1">Block Reward</p>
                                    <p class="text-body-1">{{ props.blockDetails.totalRewards.detail }}</p>
                                </div>
                            </v-col>
                            <v-col cols="6" sm="4">
                                <div class="block-info mb-5">
                                    <p class="text-button mb-1">Uncle Reward</p>
                                    <p class="text-body-1">{{ props.blockDetails.uncleReward.detail }}</p>
                                </div>
                            </v-col>
                            <v-col cols="6" sm="4">
                                <div class="block-info mb-5">
                                    <p class="text-button mb-1">Total Txs</p>
                                    <p class="text-body-1">{{ props.blockDetails.transactions.detail }}</p>
                                </div>
                            </v-col>
                            <v-col cols="6" sm="4">
                                <div class="block-info mb-5">
                                    <p class="text-button mb-1">Gas Limit</p>
                                    <p class="text-body-1">{{ props.blockDetails.gasLimit.detail }}</p>
                                </div>
                            </v-col>
                            <v-col cols="6" sm="4">
                                <div class="block-info mb-5">
                                    <p class="text-button mb-1">Gas Used</p>
                                    <p class="text-body-1">{{ props.blockDetails.gasUsed.detail }}</p>
                                </div>
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
            </v-row>
        </template>
    </v-card>
</template>

<script setup lang="ts">
import AppTransformHash from '@core/components/AppTransformHash.vue'
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import AppBtnIcon from '@core/components/AppBtnIcon.vue'
import { formatNumber } from '@core/helper/number-format-helper'

const props = defineProps({
    nextBlock: String,
    previousBlock: String,
    currBlockNumber: String,
    timestamp: String,
    blockDetails: Object,
    isLoading: {
        type: Boolean,
        default: false
    }
})
</script>
