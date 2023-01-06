<template>
    <div>
        <!--
              =====================================================================================
                Mobile (XS-SM)
              =====================================================================================
        -->
        <app-table-row v-if="xs" @click="toggleMoreDetails" :color="state.showMoreDetails ? 'pillGrey' : 'transparent'">
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
            <template #expandable>
                <v-col cols="12" v-if="state.showMoreDetails">
                    <v-row justify="space-between" class="my-5 mx-0">
                        <p class="text-info mr-2">Transactions:</p>
                        <p>
                            {{ _block.totalTx }}
                        </p>
                    </v-row>
                    <v-row justify="space-between" class="my-5 mx-0">
                        <p class="text-info mr-2">Reward:</p>
                        <p>
                            {{ _block.rewards.value }}
                        </p>
                    </v-row>
                </v-col>
            </template>
        </app-table-row>

        <!--
              =====================================================================================
                Tablet/ Desktop (SM - XL)
              =====================================================================================
        -->
        <app-table-row v-else row-align="center">
            <v-col sm="2">
                <router-link :to="`/block/number/${props.block.number}`" class="text-secondary">{{ _block.number }}</router-link>
                <p v-if="mdAndDown" class="text-info mb-0">
                    {{ _block.timestamp }}
                </p>
            </v-col>
            <v-col v-if="!mdAndDown" sm="2">
                {{ _block.timestamp }}
            </v-col>
            <v-col sm="3" lg="2">
                {{ _block.totalTx }}
            </v-col>
            <v-col sm="4" lg="3">
                <div class="d-flex align-center">
                    <app-address-blockie :address="_block.miner || ''" :size="8" class="mr-2 mr-sm-2" />
                    <app-transform-hash is-short is-blue :hash="eth.toCheckSum(_block.miner)" :link="`/address/${_block.miner}`" />
                </div>
            </v-col>
            <v-col sm="3">
                {{ _block.rewards.value }}
            </v-col>
        </app-table-row>
        <!--        <v-row v-else align="center" justify="start" class="my-5 px-0">-->
        <!--        </v-row>-->
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
import AppTableRow from '@core/components/AppTableRow.vue'

const { xs, mdAndDown } = useDisplay()

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
