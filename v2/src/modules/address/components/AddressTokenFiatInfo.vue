<template>
    <v-col cols="6" md="4" lg="3" class="mt-4">
        <p :class="[xs || sm ? 'text-caption mb-1' : 'text-h6', 'text-info ']">{{ text }}</p>
        <v-progress-linear v-if="props.loading" height="28px" rounded="xl" indeterminate color="#ECF2F7" bg-color="info" width="100px"></v-progress-linear>
        <p v-else :class="xs || sm ? 'text-body-1' : 'text-h4'">{{ valueFiatFormatted }}</p>
    </v-col>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BN from 'bignumber.js'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { formatUsdValue } from '@/core/helper/number-format-helper'

const { xs, sm } = useDisplay()

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
