<template>
    <v-container fluid class="pa-0 text-body-2">
        <v-row class="my-0">
            <!--
      =====================================================================================
        Mobile (XS-SM)
      =====================================================================================
      -->
            <v-col xs="12" v-if="!mdAndUp">
                <div :class="props.isPending ? 'table-row-mobile' : txStatusClass">
                    <v-row grid-list-xs row wrap align="center" justify="start" fill-height class="pt-3 pb-3 pr-4 pl-4">
                        <v-col cols="6" class="pa-1">
                            <router-link :to="`/block/number/${transferObj.block}`" class="black--text font-weight-medium pb-1">
                                Block # {{ transaction.block }}
                            </router-link>
                            <p v-if="props.isPending && transaction.isMined" class="caption primary--text blinking">Mined</p>
                        </v-col>
                        <v-col cols="6">
                            <v-row justify="end">
                                <p class="black--text align-center pl-2">
                                    {{ transaction.timestamp }}
                                </p>
                            </v-row>
                        </v-col>
                        <v-col cols="2" class="pa-1">
                            <p class="info--text psmall">Tx #</p>
                        </v-col>
                        <v-col cols="10" class="pa-1 pl-6">
                            <app-transform-hash :hash="transaction.hash" :link="`/tx/${transaction.hash}`" />
                        </v-col>
                        <v-col cols="12" class="pa-1">
                            <v-row align="center" class="pa-2">
                                <p class="info--text psmall pr-1">Addresses:</p>
                                <app-transform-hash :hash="eth.toCheckSum(transaction.from)" :italic="true" :link="`/address/${transaction.from}`" />
                                <v-icon class="fas fa-arrow-right primary--text pl-2 pr-2" small>east</v-icon>
                                <app-transform-hash
                                    v-if="transaction.to && transaction.to !== ''"
                                    :hash="eth.toCheckSum(transaction.to)"
                                    :italic="true"
                                    :link="`/address/${transaction.to}`"
                                />
                                <p v-else class="info--text">Contract Creation</p>
                            </v-row>
                        </v-col>
                        <v-col class="flex-shrink-1">
                            <p class="info--text psmall">Amount:</p>
                        </v-col>
                        <v-col class="flex-shrink-1">
                            <p class="black--text align-center">
                                {{ transaction.value.value }}
                                {{ transaction.value.unit }}
                                <app-tooltip v-if="transaction.value.tooltipText" :text="`${transaction.value.tooltipText} ETH`" />
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
            <v-col v-else sm="12" class="py-2">
                <!--
        =====================================================================================
          Block Info
        =====================================================================================
        -->
                <v-row grid-list-xs row wrap align="center" justify-start fill-height pl-3 pr-2 pt-2 pb-1>
                    <v-col v-if="!props.isPending" sm="2" lg="1">
                        <router-link :to="`/block/number/${transferObj.block}`" class="black--text pb-1">{{ transaction.block }}</router-link>
                    </v-col>
                    <v-col sm="7" md="5">
                        <v-row align="center" class="pr-3 pl-2">
                            <v-col sm="12">
                                <v-row align="center" justify="start" class="pa-2 flex-nowrap">
                                    <p class="info--text pr-1 flex-shrink-0">Tx #:</p>
                                    <app-transform-hash :hash="transaction.hash" :link="`/tx/${transaction.hash}`" />
                                </v-row>
                            </v-col>
                            <v-col row sm="12">
                                <v-row align="center" class="flex-nowrap mx-0">
                                    <p class="info--text mr-1">From:</p>
                                    <app-transform-hash :hash="eth.toCheckSum(transaction.from)" :link="`/address/${transaction.from}`" :italic="true" />
                                    <v-icon class="fas fa-arrow-right primary--text pl-2 pr-2" small>east</v-icon>
                                    <p v-if="transaction.to && transaction.to !== ''" class="info--text mr-1">To:</p>
                                    <p v-else class="info--text">Contract Creation</p>
                                    <!-- <app-transform-hash v-if="tx.isContractCreation" :hash="tx.creates" :link="`/address/${tx.creates}`" :italic="true" /> -->
                                    <app-transform-hash
                                        v-if="transaction.to && transaction.to !== ''"
                                        :hash="eth.toCheckSum(transaction.to)"
                                        :link="`/address/${transaction.to}`"
                                        :italic="true"
                                    />
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col sm="3" lg="2" class="pr-3 pl-2">
                        <p :class="props.isPending ? 'pl-4' : ''">
                            {{ transaction.value.value }}
                            {{ transaction.value.unit }}
                            <app-tooltip v-if="transaction.value.tooltipText" :text="`${transaction.value.tooltipText} ETH`" />
                        </p>
                    </v-col>
                    <v-col v-if="!smAndDown" md="2">
                        {{ transaction.timestamp }}
                        <!--                        <app-time-ago :timestamp="transaction.timestamp" :class="props.isPending ? 'pl-2' : ''" />-->
                    </v-col>
                    <v-col v-if="!mdAndDown" lg="1">
                        <p :class="['black--text', 'text-truncate', 'mb-0', props.isPending ? 'pl-3' : '']">
                            {{ transaction.fee.value }}
                        </p>
                    </v-col>
                    <v-col v-if="!props.isPending" lg="1">
                        <v-icon v-if="transaction.status" small class="txSuccess--text tx-status text-xs-center text-green">check_circle</v-icon>
                        <v-icon v-else small class="txFail--text tx-status text-xs-center text-red">highlight_off</v-icon>
                    </v-col>
                    <p v-if="props.isPending && transaction.isMined" class="caption primary--text blinking">Mined</p>
                </v-row>
            </v-col>
            <v-col sm="12">
                <v-divider class="mb-2 mt-2" />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import AppTransformHash from '@core/components/AppTransformHash.vue'

import BN from 'bignumber.js'
import { Tx } from '../types'
import AppTooltip from '@/core/components/AppTooltip.vue'
import { computed } from 'vue'
import { eth, timeAgo } from '@core/helper'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { formatNumber, formatNonVariableEthValue } from '@core/helper/number-format-helper'
import { SummaryFragment as TransferObj } from '@module/txs/apollo/transfersQuery.generated'

const { mdAndDown, mdAndUp, smAndDown } = useDisplay()

const props = defineProps({
    tx: Object,
    isPending: {
        type: Boolean,
        default: false
    }
})

const txStatusClass = computed<string>(() => {
    return transferObj.value.status ? 'tx-status-sucess table-row-mobile' : 'tx-status-fail table-row-mobile'
})

const transferObj = computed<TransferObj>(() => {
    return props.tx ? props.tx.transfer : { transactionHash: '', block: 0, from: '', to: '', timestamp: 0, txFee: '', status: false, __typename: 'Transfer' }
})

const transaction = computed<Tx>(() => {
    const tx = props.isPending ? props.tx : transferObj.value
    return {
        isMined: props.isPending ? tx['isMined'] : false,
        hash: tx['transactionHash'],
        block: formatNumber(new BN(tx['block'])),
        from: tx['from'],
        to: tx['to'],
        timestamp: timeAgo(new Date(tx['timestamp'] * 1e3)),
        fee: formatNonVariableEthValue(new BN(tx['txFee'])),
        value: formatNonVariableEthValue(new BN(props.tx ? props.tx.value : '')),
        status: tx['status'] != null ? tx['status'] : false
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
