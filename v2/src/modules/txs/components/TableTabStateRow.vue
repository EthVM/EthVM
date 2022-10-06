<template>
    <v-row class="my-5 px-0 text-subtitle-2 font-weight-regular d-none d-sm-flex" align="center">
        <v-col md="2">
            <div class="d-flex align-center">
                <app-address-blockie :address="props.diff.owner || ''" :size="8" class="mr-2" />
                <app-transform-hash is-blue is-short :hash="eth.toCheckSum(props.diff.owner)" :link="`/address/${props.diff.owner}`" />
            </div>
        </v-col>
        <v-spacer />
        <v-col md="3" class="text-uppercase"> {{ balanceBefore.tooltipText }} {{ balanceBefore.unit }} </v-col>
        <v-col md="3" class="text-uppercase"> {{ balanceAfter.tooltipText }} {{ balanceAfter.unit }} </v-col>
        <v-col md="2" :class="`text-${balanceDiffTextColor}`"> {{ balanceDiff.tooltipText }} </v-col>
    </v-row>
</template>

<script setup lang="ts">
import AppTransformHash from '@core/components/AppTransformHash.vue'
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import { computed } from 'vue'
import BN from 'bignumber.js'
import { StateDiffFragmentFragment as StateDiffType } from '@module/address/apollo/AddressTransfers/transfers.generated'
import { eth } from '@core/helper'
import { formatNonVariableEthValue, FormattedNumber } from '@core/helper/number-format-helper'

interface ComponentProps {
    diff: StateDiffType
}

const props = defineProps<ComponentProps>()

const balanceBefore = computed<FormattedNumber>(() => {
    if (props.diff) {
        return formatNonVariableEthValue(new BN(props.diff.from || 0))
    }
    return {
        value: '0'
    }
})

const balanceAfter = computed<FormattedNumber>(() => {
    if (props.diff) {
        return formatNonVariableEthValue(new BN(props.diff.to || 0))
    }
    return {
        value: '0'
    }
})

const balanceDiff = computed<FormattedNumber>(() => {
    if (props.diff) {
        const diff = new BN(props.diff.to || 0).minus(new BN(props.diff.from || 0))
        return formatNonVariableEthValue(diff)
    }
    return {
        value: '0'
    }
})

const balanceDiffTextColor = computed<string>(() => {
    const isNegative = new BN(balanceDiff.value.tooltipText || 0).isNegative()
    return isNegative ? 'error' : 'success'
})
</script>
