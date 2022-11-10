<template>
    <div class="position-relative">
        <v-row class="my-5 px-0" align="center" @click="toggleMoreDetails">
            <v-col lg="2">
                <div class="d-flex align-center">
                    <app-address-blockie :address="props.diff.owner || ''" :size="8" class="mr-2" />
                    <app-transform-hash is-blue is-short :hash="eth.toCheckSum(props.diff.owner)" :link="`/address/${props.diff.owner}`" />
                </div>
            </v-col>
            <v-spacer />
            <v-col v-if="!mdAndDown" md="3" class="text-uppercase"> {{ balanceBefore.tooltipText || balanceBefore.value }} {{ balanceBefore.unit }} </v-col>
            <v-col v-if="!mdAndDown" md="3" class="text-uppercase"> {{ balanceAfter.tooltipText || balanceAfter.value }} {{ balanceAfter.unit }} </v-col>
            <v-col lg="2" :class="`text-${balanceDiffTextColor}`"> {{ balanceDiff.tooltipText || balanceDiff.value }} </v-col>
            <div v-if="mdAndDown && state.showMoreDetails" class="row-bg bg-tableGrey"></div>
        </v-row>
        <div v-if="mdAndDown && state.showMoreDetails" class="d-sm-flex justify-sm-space-between">
            <div class="d-flex d-sm-block v-col-sm-6 align-center py-2">
                <p class="text-info mr-3">Before</p>
                <p class="text-uppercase">{{ balanceBefore.tooltipText || balanceBefore.value }} {{ balanceBefore.unit }}</p>
            </div>
            <div class="d-flex d-sm-block v-col-sm-6 align-center py-2">
                <p class="text-info mr-3">After</p>
                <p class="text-uppercase">{{ balanceAfter.tooltipText || balanceAfter.value }} {{ balanceAfter.unit }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import AppTransformHash from '@core/components/AppTransformHash.vue'
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import { computed, reactive } from 'vue'
import BN from 'bignumber.js'
import { StateDiffFragmentFragment as StateDiffType } from '@module/address/apollo/AddressTransfers/transfers.generated'
import { eth } from '@core/helper'
import { formatNonVariableEthValue, FormattedNumber } from '@core/helper/number-format-helper'
import { useDisplay } from 'vuetify'

const { mdAndDown } = useDisplay()

interface ComponentState {
    showMoreDetails: boolean
}

const state = reactive<ComponentState>({
    showMoreDetails: false
})

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

const toggleMoreDetails = (): void => {
    if (mdAndDown.value) {
        state.showMoreDetails = !state.showMoreDetails
    }
}
</script>
