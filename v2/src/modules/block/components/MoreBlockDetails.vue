<template>
    <v-card variant="flat" class="px-4 px-sm-6">
        <template v-if="props.isLoading || !props.blockDetails">
            <v-row class="my-2">
                <v-col cols="12" md="6">
                    <div class="skeleton-box rounded-xl mt-1" style="height: 24px"></div>
                </v-col>
            </v-row>
            <div v-for="i in 5" :key="i" class="skeleton-box rounded-xl my-5" style="height: 24px"></div>
        </template>
        <template v-else>
            <div class="block-info mb-5">
                <p class="text-button mb-1">{{ $t('block.size') }}</p>
                <p class="text-info">
                    {{ props.blockDetails.blockSize.detail }}
                </p>
            </div>
            <div v-if="props.uncleHashes && props.uncleHashes.length > 0" class="block-info mb-5">
                <p class="text-button mb-1">{{ $t('block.uncle', 2) }}</p>
                <app-transform-hash
                    is-blue
                    v-for="uncle in props.uncleHashes"
                    :key="uncle"
                    :hash="eth.toCheckSum(uncle)"
                    :link="`/uncle/${uncle}`"
                    class="w-100"
                />
            </div>
            <div class="block-info mb-5">
                <p class="text-button mb-1">{{ $t('common.nonce') }}</p>
                <p class="text-info">
                    {{ props.blockDetails.nonce.detail }}
                </p>
            </div>
            <div class="block-info mb-5">
                <p class="text-button mb-1">{{ $t('block.difficulty') }}</p>
                <p class="text-info">
                    {{ props.blockDetails.difficulty.detail }}
                </p>
            </div>
            <div class="block-info mb-5">
                <p class="text-button mb-1">{{ $t('common.total') }} {{ $t('block.difficulty') }}</p>
                <p class="text-info">
                    {{ props.blockDetails.totalDifficulty.detail }}
                </p>
            </div>
            <div class="block-info mb-5">
                <p class="text-button mb-1">{{ $t('block.stateRoot') }}</p>
                <app-transform-hash :hash="props.blockDetails.stateRoot.detail" class="w-100" />
            </div>
            <div class="block-info mb-5">
                <p class="text-button mb-1">{{ $t('block.receiptRoot') }}</p>
                <app-transform-hash :hash="props.blockDetails.receiptsRoot.detail" class="w-100" />
            </div>
            <div class="block-info mb-5">
                <p class="text-button mb-1">{{ $t('block.transactionRoot') }}</p>
                <app-transform-hash :hash="props.blockDetails.transactionsRoot.detail" class="w-100" />
            </div>
            <div class="block-info mb-5">
                <p class="text-button mb-1">{{ $t('block.logBloom') }}</p>
                <p>
                    {{ props.blockDetails.logs.detail }}
                </p>
            </div>
            <div class="block-info mb-5">
                <p class="text-button mb-1">{{ $t('block.extraData') }}</p>
                <p>
                    {{ props.blockDetails.extraData.detail }}
                </p>
            </div>
            <div class="block-info mb-5">
                <p class="text-button mb-1">SHA3 {{ $t('block.uncle', 2) }}</p>
                <app-transform-hash :hash="props.blockDetails.unclesSHA3.detail" class="w-100" />
            </div>
        </template>
    </v-card>
</template>

<script setup lang="ts">
import AppTransformHash from '@core/components/AppTransformHash.vue'
import { eth } from '@core/helper'
import { Detail } from '@core/components/props'

interface ComponentProps {
    blockDetails: { [key: string]: Detail } | null
    uncleHashes: string[]
    isLoading: boolean
}

const props = defineProps<ComponentProps>()
</script>

<style scoped></style>
