<template>
    <div class="position-relative">
        <!--
              =====================================================================================
                Mobile (XS-SM)
              =====================================================================================
        -->
        <v-row v-if="xs" align="start" justify="start" class="my-5 px-0" @click="toggleMoreDetails">
            <v-col cols="6">
                <router-link :to="`/block/number/${props.block.number}`" class="text-secondary">{{ _block.number }}</router-link>
                <p class="text-info mb-0">{{ _block.timestamp }}</p>
            </v-col>
            <v-col cols="6">
                <div class="d-flex align-center justify-end">
                    <app-address-blockie :address="_block.miner || ''" :size="6" class="mr-1 mr-sm-2" />
                    <app-transform-hash is-short is-blue :hash="eth.toCheckSum(_block.miner)" :link="`/address/${_block.miner}`" />
                </div>
            </v-col>
            <v-col cols="12" v-if="state.showMoreDetails">
                <v-row>
                    <v-col cols="6">
                        <p class="text-info">Transactions</p>
                        {{ _block.totalTx }}
                    </v-col>
                    <v-col cols="6" class="text-right">
                        <p class="text-info">Reward</p>
                        {{ _block.rewards.value }}
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <!--
              =====================================================================================
                Tablet/ Desktop (SM - XL)
              =====================================================================================
        -->
        <v-row v-else align="center" justify="start" class="my-5 px-0">
            <v-col sm="2">
                <router-link :to="`/block/number/${props.block.number}`" class="text-secondary">{{ _block.number }}</router-link>
            </v-col>
            <v-col sm="2">
                {{ _block.timestamp }}
            </v-col>
            <v-col sm="2">
                {{ _block.totalTx }}
            </v-col>
            <v-col sm="3">
                <div class="d-flex align-center">
                    <app-address-blockie :address="_block.miner || ''" :size="8" class="mr-2 mr-sm-2" />
                    <app-transform-hash is-short is-blue :hash="eth.toCheckSum(_block.miner)" :link="`/address/${_block.miner}`" />
                </div>
            </v-col>
            <v-col sm="3">
                {{ _block.rewards.value }}
            </v-col>
        </v-row>
        <div v-if="state.showMoreDetails && xs" class="row-bg bg-tableGrey"></div>
    </div>
</template>

<script setup lang="ts">
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import AppTransformHash from '@core/components/AppTransformHash.vue'
import { eth, timeAgo } from '@core/helper'
import BN from 'bignumber.js'
import AppTooltip from '@core/components/AppTooltip.vue'
import { computed, reactive } from 'vue'
import { useDisplay } from 'vuetify'
import { formatNonVariableEthValue, formatNumber } from '@core/helper/number-format-helper'

const { xs } = useDisplay()

const props = defineProps({
    block: Object
})

interface ComponentState {
    showMoreDetails: boolean
}

const state: ComponentState = reactive({
    showMoreDetails: false
})

const _block = computed(() => {
    return {
        number: formatNumber(props.block.number),
        miner: props.block.miner,
        rewards: formatNonVariableEthValue(new BN(props.block.rewards.total)),
        timestamp: timeAgo(new Date(props.block.timestamp * 1e3)),
        totalTx: formatNumber(props.block.txCount),
        txFail: formatNumber(props.block.txFail),
        txSuccess: formatNumber(props.block.txCount - props.block.txFail)
    }
})

const toggleMoreDetails = (): void => {
    if (xs.value) {
        state.showMoreDetails = !state.showMoreDetails
    }
}
</script>

<style scoped lang="css">
.table-row-mobile {
    border: 1px solid #b4bfd2;
}

p {
    margin-bottom: 0px;
    padding-bottom: 0px;
}
.arrow {
    position: relative;
}

.line {
    border-left: 1px solid #b4bfd2;
    border-bottom: 1px solid #b4bfd2;
    height: 50px;
    width: 105%;
    position: absolute;
    margin-left: 2px;
    margin-bottom: 10px;
}
</style>
