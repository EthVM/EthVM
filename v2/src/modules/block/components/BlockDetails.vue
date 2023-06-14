<template>
    <v-card variant="elevated" elevation="1" rounded="xl" class="pa-4 pa-sm-6">
        <template v-if="!props.isMined && isLoading">
            <p class="text-h6 font-weight-bold">
                This block has not been mined yet
                <v-progress-circular :size="20" color="secondary" indeterminate></v-progress-circular>
            </p>
        </template>
        <template v-if="isLoading || !props.blockDetails">
            <div class="skeleton-box rounded-xl mt-1" :style="skeletonLoaderStyle"></div>
        </template>
        <template v-else>
            <v-row no-gutters>
                <v-col cols="12" md="auto" lg="4" order="last" order-md="first">
                    <div class="d-flex align-center mx-n3">
                        <template v-if="props.previousBlock">
                            <app-btn-icon icon="chevron_left" color="secondary" :disabled="!props.previousBlock" :link="props.previousBlock" />
                        </template>
                        <h1 class="text-h6 font-weight-bold">Block #{{ formatNumber(props.currBlockNumber) }}</h1>
                        <template v-if="props.nextBlock">
                            <app-btn-icon icon="chevron_right" color="secondary" :disabled="!props.nextBlock" :link="props.nextBlock" />
                        </template>
                    </div>
                    <span class="text-info text-body-1">
                        {{ props.timestamp }}
                    </span>
                </v-col>
                <v-spacer />
                <v-col cols="12" md="auto" lg="8" order="first" order-md="last" class="mb-6 mb-md-0 pa-0">
                    <app-ad-buttons-small />
                </v-col>
            </v-row>
            <v-row class="my-7">
                <v-col cols="12" lg="6" class="text-textPrimary">
                    <div class="block-info mb-5">
                        <p class="text-button mb-1">Miner</p>
                        <div class="d-flex align-center">
                            <app-address-blockie :address="props.blockDetails.miner.detail || ''" :size="8" class="mr-1 mr-sm-2" />
                            <app-transform-hash is-blue :hash="props.blockDetails.miner.detail" :link="props.blockDetails.miner.link" class="w-100" />
                        </div>
                    </div>
                    <div class="block-info mb-5">
                        <p class="text-button mb-1">Hash</p>
                        <app-transform-hash :hash="props.blockDetails.hash.detail" class="w-100" />
                    </div>
                    <div class="block-info mb-5">
                        <p class="text-button mb-1">Parent Hash</p>
                        <app-transform-hash is-blue :hash="props.blockDetails.parentHash.detail" :link="props.blockDetails.parentHash.link" class="w-100" />
                    </div>
                </v-col>
                <v-col cols="12" lg="5">
                    <div class="rounded-xl bg-tableGrey pa-5 text-textPrimary">
                        <v-row>
                            <v-col cols="6" sm="4">
                                <div class="block-info mb-5">
                                    <p class="text-button mb-1">Block Reward</p>
                                    <p class="text-body-1 text-uppercase">{{ props.blockDetails.totalRewards.detail }}</p>
                                </div>
                            </v-col>
                            <v-col cols="6" sm="4">
                                <div class="block-info mb-5">
                                    <p class="text-button mb-1">Uncle Reward</p>
                                    <p class="text-body-1 text-uppercase">{{ props.blockDetails.uncleReward.detail }}</p>
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
                            <v-col cols="6" sm="8">
                                <div class="block-info mb-5">
                                    <p class="text-button mb-1">Gas Used</p>
                                    <p class="text-body-1">{{ props.blockDetails.gasUsed.detail }}</p>
                                </div>
                            </v-col>
                            <v-col v-if="props.blockDetails.baseFee" cols="6" sm="4">
                                <div class="block-info mb-5">
                                    <p class="text-button mb-1">Base Fee per Gas</p>
                                    <p class="text-body-1">{{ props.blockDetails.baseFee.detail }}</p>
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
import AppAdButtonsSmall from '@/core/components/AppAdButtonsSmall.vue'
import AppTransformHash from '@core/components/AppTransformHash.vue'
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import AppBtnIcon from '@core/components/AppBtnIcon.vue'
import { formatNumber } from '@core/helper/number-format-helper'
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { Detail } from '@core/components/props'

interface ComponentProps {
    nextBlock: string
    previousBlock: string
    currBlockNumber: string | null
    timestamp: string
    blockDetails: { [key: string]: Detail } | null
    isLoading: boolean
    isMined: boolean
}

const props = defineProps<ComponentProps>()

const { mdAndDown } = useDisplay()

const skeletonLoaderStyle = computed<string>(() => {
    if (!mdAndDown.value) {
        return 'height: 300px'
    }
    return 'height: 500px'
})
</script>
