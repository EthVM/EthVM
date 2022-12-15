<template>
    <div>
        <!--
          =====================================================================================
            Mobile (XS-SM)
          =====================================================================================
        -->
        <!--        <app-table-row v-if="xs" row-align="center" row-justify="start" @click="toggleMoreDetails"> </app-table-row>-->
        <!--
          =====================================================================================
            Tablet/ Desktop (SM - XL)
          =====================================================================================
        -->
        <app-table-row
            row-align="center"
            row-justify="start"
            :color="state.showMoreDetails ? 'pillGrey' : 'transparent'"
            v-on="{ click: mdAndDown ? toggleMoreDetails : null }"
        >
            <template v-if="xs">
                <v-col cols="6">
                    <div class="d-flex align-start">
                        <div class="mr-3">
                            <v-icon v-if="transaction.status" small class="text-success">check_circle</v-icon>
                            <v-icon v-else small class="text-error">highlight_off</v-icon>
                        </div>
                        <div>
                            <template v-if="!props.isPending">
                                <router-link :to="`/block/number/${transferObj.block}`" class="text-secondary pb-1">{{ transaction.block }}</router-link>
                                <p class="text-info mb-0">
                                    {{ transaction.timestamp }}
                                </p>
                            </template>
                            <p v-if="props.isPending && transaction.isMined" class="text-info">Mined</p>
                        </div>
                    </div>
                </v-col>
                <v-col cols="6" class="text-right">
                    <app-transform-hash is-short is-blue :hash="transaction.hash" :link="`/tx/${transaction.hash}`" />
                    <div>
                        {{ transaction.value.value }}
                        <span class="text-uppercase">{{ transaction.value.unit }}</span>
                    </div>
                </v-col>
            </template>
            <template v-else>
                <v-col v-if="!props.isPending && !props.isBlock" sm="3" lg="2">
                    <router-link :to="`/block/number/${transferObj.block}`" class="text-secondary pb-1">{{ transaction.block }}</router-link>
                    <p class="text-info mb-0">
                        {{ transaction.timestamp }}
                    </p>
                </v-col>
                <v-col sm="3" md="2">
                    <app-transform-hash is-short is-blue :hash="transaction.hash" :link="`/tx/${transaction.hash}`" />
                </v-col>
                <v-col v-if="!mdAndDown" lg="2">
                    <div class="d-flex align-center">
                        <app-address-blockie :address="transaction.from || ''" :size="8" class="mr-1 mr-sm-2" />
                        <app-transform-hash is-short is-blue :hash="eth.toCheckSum(transaction.from)" :link="`/address/${transaction.from}`" />
                        <v-icon v-if="!props.isBlock" color="success" class="ml-5">east</v-icon>
                    </div>
                </v-col>
                <v-col v-if="!mdAndDown && props.isBlock">
                    <v-icon color="success" class="ml-5">east</v-icon>
                </v-col>
                <v-col v-if="!mdAndDown" lg="2">
                    <div class="d-flex align-center">
                        <app-address-blockie :address="transaction.to || ''" :size="8" class="mr-1 mr-sm-2" />
                        <app-transform-hash
                            v-if="transaction.to && transaction.to !== ''"
                            is-short
                            is-blue
                            :hash="eth.toCheckSum(transaction.to)"
                            :link="`/address/${transaction.to}`"
                        />
                    </div>
                </v-col>
                <v-col lg="2">
                    <span>
                        {{ transaction.value.value }}
                        <span class="text-uppercase">{{ transaction.value.unit }}</span>
                    </span>
                </v-col>
                <v-col :lg="props.isBlock ? 2 : 1">
                    <span>
                        {{ transaction.fee.value }}
                    </span>
                </v-col>
                <v-col v-if="!props.isPending" lg="1">
                    <div class="d-flex align-center">
                        <v-icon v-if="transaction.status" small class="text-success">check_circle</v-icon>
                        <v-icon v-else small class="text-error">highlight_off</v-icon>
                        <p v-if="props.isPending && transaction.isMined" class="caption primary--text blinking">Mined</p>
                    </div>
                </v-col>
            </template>
            <v-row v-if="state.showMoreDetails && mdAndDown" justify="space-between" align="center" class="mt-2 pb-5">
                <v-col cols="5">
                    <div class="d-flex align-center">
                        <app-address-blockie :address="transaction.from || ''" :size="6" class="mr-1 mr-sm-2" />
                        <app-transform-hash is-short is-blue :hash="eth.toCheckSum(transaction.from)" :link="`/address/${transaction.from}`" />
                    </div>
                </v-col>
                <v-icon color="success">east</v-icon>
                <v-col cols="5">
                    <div class="d-flex align-center justify-end">
                        <app-address-blockie :address="transaction.to || ''" :size="6" class="mr-1 mr-sm-2" />
                        <app-transform-hash
                            v-if="transaction.to && transaction.to !== ''"
                            is-short
                            is-blue
                            :hash="eth.toCheckSum(transaction.to)"
                            :link="`/address/${transaction.to}`"
                        />
                    </div>
                </v-col>
            </v-row>
        </app-table-row>
        <!--        <div v-if="state.showMoreDetails && mdAndDown" class="row-bg bg-tableGrey"></div>-->
    </div>
</template>

<script setup lang="ts">
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import AppTransformHash from '@core/components/AppTransformHash.vue'
import AppTableRow from '@core/components/AppTableRow.vue'
import BN from 'bignumber.js'
import { Tx } from '../types'
import { computed, reactive } from 'vue'
import { eth, timeAgo } from '@core/helper'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { formatNumber, formatNonVariableEthValue } from '@core/helper/number-format-helper'
import { SummaryFragment as TransferObj } from '@module/txs/apollo/transfersQuery.generated'

const { xs, mdAndDown } = useDisplay()

const props = defineProps({
    tx: Object,
    isPending: {
        type: Boolean,
        default: false
    },
    isBlock: {
        type: Boolean,
        default: false
    }
})

interface ComponentState {
    showMoreDetails: boolean
}

const state: ComponentState = reactive({
    showMoreDetails: false
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

const toggleMoreDetails = (): void => {
    if (mdAndDown.value) {
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
