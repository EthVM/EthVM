<template>
    <div>
        <app-table-row
            row-align="center"
            row-justify="start"
            :color="state.showMoreDetails && mdAndDown ? 'pillGrey' : 'transparent'"
            v-on="{ click: smAndDown ? toggleMoreDetails : null }"
        >
            <!--
                 =====================================================================================
                   Mobile (XS-SM)
                 =====================================================================================
            -->
            <template v-if="smAndDown">
                <v-col cols="6">
                    <div class="d-flex align-center">
                        <div class="mr-3">
                            <v-icon v-if="transaction.status" small class="text-success">check_circle</v-icon>
                            <v-icon v-else small class="text-error">highlight_off</v-icon>
                        </div>
                        <div>
                            <template v-if="!props.isPending">
                                <app-transform-hash is-short is-blue :hash="transaction.hash" :link="`/tx/${transaction.hash}`" />
                                <p v-if="!props.isBlock" class="text-info mb-0">
                                    {{ transaction.timestamp }}
                                </p>
                            </template>
                            <p v-if="props.isPending && transaction.isMined" class="text-info">Mined</p>
                        </div>
                    </div>
                </v-col>
                <v-col cols="6" sm="3" class="text-right text-sm-left">
                    <div>
                        {{ transaction.value.value }}
                        <span class="text-uppercase">{{ transaction.value.unit }}</span>
                    </div>
                </v-col>
                <v-col sm="3" class="d-none d-sm-flex text-right text-sm-left">
                    <div>
                        {{ transaction.fee.value }}
                        <span class="text-uppercase">{{ transaction.fee.unit }}</span>
                    </div>
                </v-col>
            </template>
            <!--
                  =====================================================================================
                    Tablet/ Desktop (SM - XL)
                  =====================================================================================
            -->
            <template v-else>
                <!--
                    Hash/Block/Timestamp
                    Block:
                -->
                <v-col md="3" :lg="props.isBlock ? 2 : 3">
                    <div class="d-flex justify-space-between align-center">
                        <div v-if="!props.isBlock && !mdAndDown">
                            <router-link :to="`/block/number/${transaction.block}`" class="text-secondary pb-1">{{ transaction.block }}</router-link>
                            <p class="text-info mb-0">
                                {{ transaction.timestamp }}
                            </p>
                        </div>
                        <div>
                            <app-transform-hash is-short is-blue :hash="transaction.hash" :link="`/tx/${transaction.hash}`" />
                            <p v-if="!props.isBlock && mdAndDown" class="text-info mb-0">
                                {{ transaction.timestamp }}
                            </p>
                        </div>
                    </div>
                </v-col>
                <v-spacer v-if="!mdAndDown && !props.isBlock" />
                <!--
                    FROM/TO
                -->
                <v-col md="6" :lg="props.isBlock ? 5 : 4">
                    <div class="d-flex align-center justify-space-between">
                        <div class="d-flex align-center justify-start" style="min-width: 158px">
                            <app-address-blockie :address="transaction.from || ''" :size="8" class="mr-1 mr-sm-2" />
                            <app-transform-hash is-short is-blue :hash="eth.toCheckSum(transaction.from)" :link="`/address/${transaction.from}`" />
                        </div>
                        <v-icon color="success" class="mx-5">east</v-icon>
                        <div class="d-flex align-center justify-start" style="min-width: 158px">
                            <app-address-blockie :address="transaction.to || ''" :size="8" class="mr-1 mr-sm-2" />
                            <app-transform-hash
                                v-if="transaction.to && transaction.to !== ''"
                                is-short
                                is-blue
                                :hash="eth.toCheckSum(transaction.to)"
                                :link="`/address/${transaction.to}`"
                            />
                        </div>
                    </div>
                </v-col>
                <!--
                    Amount
                -->
                <v-spacer v-if="!mdAndDown" />
                <v-col md="3" lg="2">
                    <p class="text-right text-lg-left">
                        {{ transaction.value.value }}
                        <span class="text-uppercase">{{ transaction.value.unit }}</span>
                        <span v-if="mdAndDown" class="pl-3">
                            <v-icon v-if="transaction.status" small class="text-success">check_circle</v-icon>
                            <v-icon v-else small class="text-error">highlight_off</v-icon>
                        </span>
                    </p>
                </v-col>
                <!--
                    Fee
                -->
                <v-col lg="2" class="d-none d-lg-flex justify-space-between">
                    <p>
                        {{ transaction.fee.value }}
                    </p>
                    <div class="pl-3">
                        <v-icon v-if="transaction.status" small class="text-success">check_circle</v-icon>
                        <v-icon v-else small class="text-error">highlight_off</v-icon>
                    </div>
                </v-col>
            </template>
            <v-row v-if="state.showMoreDetails && smAndDown" align="center" class="mt-2 pb-5 px-1 px-sm-1 justify-space-between justify-sm-start" :dense="xs">
                <v-col cols="5" sm="4" class="d-flex align-center text-ellipses">
                    <app-address-blockie :address="transaction.from || ''" :size="xs ? 5 : 6" class="mr-2" />
                    <app-transform-hash is-short is-blue :hash="eth.toCheckSum(transaction.from)" :link="`/address/${transaction.from}`" />
                </v-col>
                <v-icon color="success" size="20">east</v-icon>
                <v-col cols="5" sm="4" class="d-flex align-center justify-end text-ellipses">
                    <app-address-blockie :address="transaction.to || ''" :size="xs ? 5 : 6" class="mr-2" />
                    <app-transform-hash
                        v-if="transaction.to && transaction.to !== ''"
                        is-short
                        is-blue
                        :hash="eth.toCheckSum(transaction.to)"
                        :link="`/address/${transaction.to}`"
                    />
                </v-col>
            </v-row>
        </app-table-row>
    </div>
</template>

<script setup lang="ts">
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import AppTransformHash from '@core/components/AppTransformHash.vue'
import AppTableRow from '@core/components/AppTableRow.vue'
import BN from 'bignumber.js'
import { computed, reactive, PropType } from 'vue'
import { eth, timeAgo } from '@core/helper'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { formatNumber, formatNonVariableEthValue, FormattedNumber } from '@core/helper/number-format-helper'
import { TransferFragment, BlockTransactionFragment } from '../apollo/transfersQuery.generated'

const { xs, smAndDown, mdAndDown } = useDisplay()

const props = defineProps({
    tx: {
        type: Object as PropType<TransferFragment | BlockTransactionFragment>,
        defualt: {},
        required: true
    },
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

interface Tx {
    isMined: boolean
    hash: string
    block: string
    from: string
    to: string
    timestamp: string
    fee: FormattedNumber
    value: FormattedNumber
    status: boolean
}
const transaction = computed<Tx>(() => {
    const tx = props.tx
    return {
        isMined: props.isPending,
        hash: tx.transfer.transactionHash,
        block: formatNumber(tx.transfer.block),
        from: tx.transfer.from,
        to: tx.transfer.to,
        timestamp: timeAgo(new Date(tx.transfer.timestamp * 1e3)),
        fee: formatNonVariableEthValue(new BN(tx.transfer.txFee)),
        value: formatNonVariableEthValue(new BN(tx.value)),
        status: tx.transfer.status ? true : false
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
