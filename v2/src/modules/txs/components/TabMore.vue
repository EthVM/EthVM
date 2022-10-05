<template>
    <v-card v-if="props.txData" variant="flat" rounded="xl" class="pa-4 pa-sm-6">
        <v-row class="mt-5">
            <v-col lg="2">
                <div class="tx-info">
                    <p class="text-button mb-1">Gas limit</p>
                    <p class="text-no-wrap">{{ gasLimit }}</p>
                </div>
            </v-col>
            <v-col lg="2">
                <div class="tx-info">
                    <p class="text-button mb-1">Gas used</p>
                    <p class="text-no-wrap">{{ gasUsed }} ({{ percentageOfGasUsed }})</p>
                </div>
            </v-col>
        </v-row>
        <v-row class="mt-5">
            <v-col lg="2">
                <div class="tx-info">
                    <p class="text-button mb-1">Base fee</p>
                    <p class="text-no-wrap">{{ baseFeePerGas.value }} {{ baseFeePerGas.unit }}</p>
                </div>
            </v-col>
            <v-col lg="2">
                <div class="tx-info">
                    <p class="text-button mb-1">Max fee per gas</p>
                    <p class="text-no-wrap">{{ maxFeePerGas.value }} {{ maxFeePerGas.unit }}</p>
                </div>
            </v-col>
        </v-row>
        <div class="rounded-lg bg-tableGrey pa-5 mt-5 border-sm">
            <p class="text-button mb-1">Input</p>
            <p class="">{{ props.txData.input }}</p>
        </div>
        <v-row class="mt-5">
            <v-col lg="2">
                <div class="tx-info">
                    <p class="text-button mb-1">Nonce</p>
                    <p class="text-no-wrap">{{ props.txData.nonce }}</p>
                </div>
            </v-col>
            <v-col lg="2">
                <div class="tx-info">
                    <p class="text-button mb-1">TX Index</p>
                    <p class="text-no-wrap">{{ props.txData.transactionIndex }}</p>
                </div>
            </v-col>
        </v-row>
        <v-row class="mt-5">
            <v-col cols="12">
                <div class="tx-info">
                    <p class="text-button mb-1">R</p>
                    <p class="text-no-wrap text-secondary">{{ props.txData.r }}</p>
                </div>
            </v-col>
            <v-col cols="12">
                <div class="tx-info">
                    <p class="text-button mb-1">S</p>
                    <p class="text-no-wrap text-secondary">{{ props.txData.s }}</p>
                </div>
            </v-col>
            <v-col cols="12">
                <div class="tx-info">
                    <p class="text-button mb-1">V</p>
                    <p class="text-no-wrap text-secondary">{{ props.txData.v }}</p>
                </div>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup lang="ts">
import { TxDetailsFragment as TxDetailsType } from '../apollo/TxDetails.generated'
import { computed } from 'vue'
import { formatNonVariableGWeiValue, formatNumber, FormattedNumber } from '@core/helper/number-format-helper'
import BN from 'bignumber.js'

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
</script>
