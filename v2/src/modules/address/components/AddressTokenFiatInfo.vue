<template>
    <v-col cols="6" md="4" lg="3" class="mt-4">
        <p class="text-caption mb-1 text-info">{{ text }}</p>
        <div v-if="props.loading" class="skeleton-box rounded-xl" style="height: 20px"></div>
        <p v-else class="text-body-1">{{ valueFiatFormatted }}</p>
    </v-col>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BN from 'bignumber.js'
import { formatUsdValue } from '@/core/helper/number-format-helper'

interface Props {
    loading: boolean
    fiatValue?: BN
    text: string
}
const props = defineProps<Props>()

/**
 * Returns formatted FIAT value
 */
const valueFiatFormatted = computed<string>(() => {
    if (!props.loading) {
        const format = new BN(props.fiatValue || 0)
        return formatUsdValue(format).value
    }
    return '$0.00'
})
</script>
