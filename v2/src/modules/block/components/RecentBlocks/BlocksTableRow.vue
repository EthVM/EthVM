<template>
    <v-container fluid class="pa-0 text-body-2">
        <v-row d-block>
            <!--
      =====================================================================================
        Mobile (XS-SM)
      =====================================================================================
      -->
            <v-col xs="12" v-if="!mdAndUp">
                <div class="table-row-mobile">
                    <v-row grid-list-xs row wrap align="center" justify-start fill-height class="pt-3 pb-3 pr-4 pl-4">
                        <v-col cols="6" class="pa-1">
                            <router-link :to="`/block/number/${props.block.number}`" class="black--text font-weight-medium pb-1">
                                Block # {{ _block.number }}
                            </router-link>
                        </v-col>
                        <v-col cols="6" pr-44>
                            <v-row justify="end">
                                <p class="black--text align-center pl-2">
                                    {{ _block.totalTx }} Txs
                                    <app-tooltip v-if="_block.txFail > 0" :text="txTooltipText" />
                                </p>
                            </v-row>
                        </v-col>
                        <v-col cols="2" class="pa-1">
                            <p class="info--text psmall">Age:</p>
                        </v-col>
                        <v-col cols="10" class="pa-1 pl-6">
                            {{ _block.timestamp }}
                        </v-col>
                        <v-col cols="2" class="pa-1">
                            <p class="info--text psmall pr-1">Miner:</p>
                        </v-col>
                        <v-col cols="10" class="pa-1">
                            <app-transform-hash :hash="eth.toCheckSum(_block.miner)" :italic="true" :link="`/address/${_block.miner}`" class="pl-6" />
                        </v-col>
                        <v-col cols="2" class="pa-1">
                            <p class="info--text psmall">Reward:</p>
                        </v-col>
                        <v-col cols="10" class="pa-1">
                            <p class="black--text align-center pl-6">
                                {{ _block.rewards.value }}
                                <app-tooltip v-if="_block.rewards.tooltipText" :text="`${_block.rewards.tooltipText} ETH`" />
                            </p>
                        </v-col>
                    </v-row>
                </div>
            </v-col>
            <!--
      =====================================================================================
        Tablet/ Desktop (SM - XL)
      =====================================================================================
      -->
            <v-col v-else sm="12" class="pt-2">
                <!--
        =====================================================================================
          Block Info
        =====================================================================================
        -->
                <v-row grid-list-xs row wrap align="center" justify="start" class="fill-height">
                    <v-col sm="2">
                        <router-link :to="`/block/number/${props.block.number}`" class="black--text pb-1">{{ _block.number }}</router-link>
                    </v-col>
                    <v-col sm="5">
                        <v-row>
                            <v-col sm="12" class="pb-2">
                                <v-row align="center" class="flex-nowrap ma-0">
                                    <p class="info--text pr-1">Miner:</p>
                                    <app-transform-hash :hash="eth.toCheckSum(_block.miner)" :italic="true" :link="`/address/${_block.miner}`" />
                                </v-row>
                            </v-col>
                            <v-col sm="12" class="pt-0">
                                <v-row align="center" class="flex-nowrap ma-0">
                                    <p class="info--text psmall pr-2">Age:</p>
                                    {{ _block.timestamp }}
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-spacer v-if="!xl" />
                    <v-col sm="2">
                        <p class="pr-1">
                            {{ _block.totalTx }}
                            <app-tooltip v-if="_block.txFail > 0" :text="txTooltipText" />
                        </p>
                    </v-col>
                    <v-col sm="2">
                        <p class="black--text align-center mb-0">
                            {{ _block.rewards.value }}
                            <app-tooltip v-if="_block.rewards.tooltipText" :text="`${_block.rewards.tooltipText} ETH`" />
                        </p>
                    </v-col>
                </v-row>
                <v-col sm="12">
                    <v-divider class="mb-2 mt-2" />
                </v-col>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import AppTransformHash from '@core/components/AppTransformHash.vue'
import { eth, timeAgo } from '@core/helper'
import BN from 'bignumber.js'
import AppTooltip from '@core/components/AppTooltip.vue'
import { computed } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { formatNonVariableEthValue, formatNumber } from '@core/helper/number-format-helper'

const { mdAndUp, xl } = useDisplay()

const props = defineProps({
    block: Object
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
