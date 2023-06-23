<template>
    <app-table-row :row-align="xs ? 'start' : 'center'" row-justify="start">
        <v-col cols="6" sm="3" lg="2">
            <div class="d-flex align-center flex-nowrap mb-2">
                <div class="mobile-chip rounded-circle mr-2 bg-success">
                    <v-icon size="12"> south_east </v-icon>
                </div>
                <span> {{ $t('txs.status.recieve') }}</span>
            </div>
            <p class="text-info">{{ timeAgo(new Date(props.withdrawal.transfer.timestamp * 1e3)) }} from</p></v-col
        >
        <v-col sm="2" md="3" lg="3" class="d-none d-sm-flex">{{ validatorFormatted }}</v-col>
        <v-col sm="4" md="3" lg="5" class="d-none d-sm-flex">{{ valueFormatted.value }} {{ valueFormatted.unit }} </v-col>
        <v-col cols="6" sm="3" lg="2" class="d-flex justify-end flex-column justify-sm-start">
            <p v-if="xs" class="text-right mb-2">+ {{ valueFormatted.value }} {{ valueFormatted.unit }}</p>
            <p v-if="xs" class="text-right mb-1">{{ validatorFormatted }}</p>

            <router-link :to="`/block/number/${props.withdrawal.transfer.block}`" class="text-secondary text-right text-sm-left">
                {{ formatNumber(props.withdrawal.transfer.block) }}
            </router-link></v-col
        >
    </app-table-row>
</template>

<script setup lang="ts">
import AppTableRow from '@core/components/AppTableRow.vue'
import { useDisplay } from 'vuetify'
import { AdrWithdrawalFragment } from '@module/address/apollo/AddressWithdrawals/withdrawals.generated'
import BN from 'bignumber.js'
import { formatNumber, formatNonVariableEthValue, FormattedNumber } from '@core/helper/number-format-helper'
import { computed } from 'vue'
import { timeAgo } from '@core/helper'

const { xs } = useDisplay()

interface ComponentProps {
    withdrawal: AdrWithdrawalFragment
}

const props = defineProps<ComponentProps>()

/**--------------------
 * Formatted Values
 ---------------------*/
const valueFormatted = computed<FormattedNumber>(() => {
    return formatNonVariableEthValue(new BN(props.withdrawal.value))
})

const validatorFormatted = computed<string>(() => {
    return `#${formatNumber(new BN(props.withdrawal.validatorIndex).toNumber())}`
})
</script>
