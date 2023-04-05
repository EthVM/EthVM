<template>
    <div>
        <app-table-row row-align="center" row-justify="start">
            <v-col cols="6" sm="2">
                <p v-if="xs">{{ getValue() }}</p>
                <p :class="{ 'text-info': xs }"><span v-if="xs"> from </span>#{{ getValidator() }}</p>
            </v-col>
            <v-col v-if="!xs" sm="2"><v-icon color="success" class="ml-5">east</v-icon> </v-col>
            <v-col cols="6" sm="5" lg="6" class="d-flex align-center justify-end justify-sm-start">
                <app-address-blockie :address="props.transfer.transfer.to" :size="8" class="mr-1 mr-sm-2" />
                <app-transform-hash is-short is-blue :hash="eth.toCheckSum(props.transfer.transfer.to)" :link="`/tx/${props.transfer.transfer.to}`" />
            </v-col>
            <v-col v-if="!xs" sm="3" lg="2"> {{ getValue() }} </v-col>
        </app-table-row>
    </div>
</template>

<script setup lang="ts">
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import AppTransformHash from '@core/components/AppTransformHash.vue'
import AppTableRow from '@core/components/AppTableRow.vue'
import BN from 'bignumber.js'
import { eth } from '@/core/helper/eth'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { formatNumber, formatNonVariableEthValue } from '@core/helper/number-format-helper'
import { BlockWithdrawalFragment } from '../apollo/BlockWithdrawals/blockWithdrawals.generated'

const { xs } = useDisplay()
interface PropType {
    transfer: BlockWithdrawalFragment
}

const props = defineProps<PropType>()

/**
 * Formats Withdrawal amount
 */
const getValue = () => {
    const formatted = formatNonVariableEthValue(new BN(props.transfer.value))
    return `${formatted.value} ${formatted.unit}`
}

/**
 * Formats Validator index
 */
const getValidator = () => {
    return formatNumber(new BN(props.transfer.validatorIndex).toNumber())
}
</script>
