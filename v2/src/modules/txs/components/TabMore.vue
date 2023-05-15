<template>
    <app-no-result v-if="!props.txData && !props.loading" text="No data available for this transaction" />
    <v-card v-else variant="flat" rounded="xl" class="px-4 px-sm-6 pb-4 pb-sm-6">
        <v-row class="mt-5">
            <v-col lg="2">
                <div class="tx-info">
                    <p class="text-button mb-1">Gas limit</p>
                    <div v-if="props.loading" class="skeleton-box rounded-xl" style="height: 24px"></div>
                    <p v-else class="text-no-wrap">{{ gasLimit }}</p>
                </div>
            </v-col>
            <v-col lg="2">
                <div class="tx-info">
                    <p class="text-button mb-1">Gas used</p>
                    <div v-if="props.loading" class="skeleton-box rounded-xl" style="height: 24px"></div>
                    <p v-else class="text-no-wrap">{{ gasUsed }} ({{ percentageOfGasUsed }})</p>
                </div>
            </v-col>
        </v-row>
        <v-row class="mt-5">
            <v-col lg="2">
                <div class="tx-info">
                    <p class="text-button mb-1">Base fee</p>
                    <div v-if="props.loading" class="skeleton-box rounded-xl" style="height: 24px"></div>
                    <p v-else class="text-no-wrap">{{ baseFeePerGas.value }} {{ baseFeePerGas.unit }}</p>
                </div>
            </v-col>
            <v-col lg="2">
                <div class="tx-info">
                    <p class="text-button mb-1">Max fee per gas</p>
                    <div v-if="props.loading" class="skeleton-box rounded-xl" style="height: 24px"></div>
                    <p v-else class="text-no-wrap">{{ maxFeePerGas.value }} {{ maxFeePerGas.unit }}</p>
                </div>
            </v-col>
        </v-row>
        <div class="rounded-lg bg-tableGrey pa-5 mt-5 border-sm">
            <p class="text-button mb-1">Input</p>
            <div v-if="props.loading" class="skeleton-box rounded-xl" style="height: 80px"></div>
            <p v-else class="">{{ props.txData.input }}</p>
        </div>
        <v-row class="mt-5">
            <v-col lg="2">
                <div class="tx-info">
                    <p class="text-button mb-1">Nonce</p>
                    <div v-if="props.loading" class="skeleton-box rounded-xl" style="height: 24px"></div>
                    <p v-else class="text-no-wrap">{{ props.txData.nonce }}</p>
                </div>
            </v-col>
            <v-col lg="2">
                <div class="tx-info">
                    <p class="text-button mb-1">TX Index</p>
                    <div v-if="props.loading" class="skeleton-box rounded-xl" style="height: 24px"></div>
                    <p v-else class="text-no-wrap">{{ props.txData.transactionIndex }}</p>
                </div>
            </v-col>
        </v-row>
        <v-row class="mt-5">
            <v-col v-if="!hideR" cols="12">
                <div class="tx-info">
                    <p class="text-button mb-1">R</p>
                    <div v-if="props.loading" class="skeleton-box rounded-xl" style="height: 24px"></div>
                    <app-transform-hash v-else :hash="eth.toCheckSum(props.txData.r)" />
                </div>
            </v-col>
            <v-col v-if="!hideS" cols="12">
                <div class="tx-info">
                    <p class="text-button mb-1">S</p>
                    <div v-if="props.loading" class="skeleton-box rounded-xl" style="height: 24px"></div>
                    <app-transform-hash v-else :hash="eth.toCheckSum(props.txData.s)" />
                </div>
            </v-col>
            <v-col v-if="!hideV" cols="12">
                <div class="tx-info">
                    <p class="text-button mb-1">V</p>
                    <div v-if="props.loading" class="skeleton-box rounded-xl" style="height: 24px"></div>
                    <app-transform-hash v-else :hash="eth.toCheckSum(props.txData.v)" />
                </div>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup lang="ts">
import AppNoResult from '@core/components/AppNoResult.vue'
import AppTransformHash from '@core/components/AppTransformHash.vue'
import { TxDetailsFragment as TxDetailsType } from '../apollo/TxDetails/TxDetails.generated'
import { computed } from 'vue'
import { formatNonVariableGWeiValue, formatNumber, FormattedNumber } from '@core/helper/number-format-helper'
import BN from 'bignumber.js'
import { eth } from '@core/helper'

interface ComponentProps {
    txData: TxDetailsType | undefined
    loading: boolean
}
const props = defineProps<ComponentProps>()

const gasUsed = computed<string>(() => {
    if (props.txData) {
        return formatNumber(new BN(props.txData.gasUsed || 0).toNumber())
    }
    return '0'
})

const gasLimit = computed<string>(() => {
    if (props.txData) {
        return formatNumber(new BN(props.txData.gas || 0).toNumber())
    }
    return '0'
})

const percentageOfGasUsed = computed<string>(() => {
    if (props.txData) {
        const percentageUsed = new BN(props.txData.gasUsed || 0).div(new BN(props.txData.gas || 0)).toNumber()
        return `${(percentageUsed * 100).toFixed(2)}%`
    }
    return '0%'
})

const baseFeePerGas = computed<FormattedNumber>(() => {
    if (props.txData) {
        return formatNonVariableGWeiValue(new BN(props.txData.baseFeePerGas || 0))
    }
    return {
        value: '0'
    }
})

const maxFeePerGas = computed<FormattedNumber>(() => {
    if (props.txData) {
        return formatNonVariableGWeiValue(new BN(props.txData.maxFeePerGas || 0))
    }
    return {
        value: '0'
    }
})

// Hide R, S or V if the data is done loading and r, s, or v don't exist in the txData
const hideR = computed<boolean>(() => {
    return !props.loading && !props.txData?.r
})

const hideS = computed<boolean>(() => {
    return !props.loading && !props.txData?.s
})

const hideV = computed<boolean>(() => {
    return !props.loading && !props.txData?.v
})
</script>
