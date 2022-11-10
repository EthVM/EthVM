<template>
    <div class="position-relative">
        <!-- For tablet devices and below -->
        <v-row v-if="smAndDown" align="center" class="my-5" @click="showMoreDetails = !showMoreDetails">
            <!-- For mobile devices -->
            <template v-if="xs">
                <v-col cols="6">
                    <v-icon v-if="props.tab === routes[2]" color="success">check_circle</v-icon>
                    Pending
                </v-col>
                <v-col cols="6">
                    <p>{{ txValue.value }} {{ txValue.unit.toUpperCase() }}</p>
                </v-col>
                <v-col cols="6">
                    <p class="text-info">{{ timestamp }}</p>
                </v-col>
                <v-col cols="6">
                    <div class="d-flex align-center">
                        <app-address-blockie :address="txAddress || ''" :size="8" class="mr-2 mr-sm-2" />
                        <app-transform-hash is-short is-blue :hash="eth.toCheckSum(props.tx.hash)" :link="`/address/${props.tx.hash}`" />
                    </div>
                </v-col>
                <v-col cols="12" v-if="showMoreDetails">
                    <v-row>
                        <v-col cols="6"> Estimated fee </v-col>
                        <v-col cols="6"> {{ estimatedFee.value }} {{ estimatedFee.unit.toUpperCase() }} </v-col>
                    </v-row>
                </v-col>
            </template>
            <!-- For tablet devices / landscaped -->
            <template v-else>
                <v-col sm="4">
                    <div class="d-flex">
                        <span class="mr-3">
                            <v-icon v-if="props.tab === routes[2]" color="success">check_circle</v-icon>
                            <v-icon v-else>update</v-icon>
                        </span>
                        <div>
                            <p>{{ txValue.value }} {{ txValue.unit.toUpperCase() }}</p>
                            <p class="text-info">{{ timestamp }} {{ transferDirection.text }}</p>
                        </div>
                    </div>
                </v-col>
                <v-col sm="3">
                    <div class="d-flex align-center">
                        <app-address-blockie :address="txAddress || ''" :size="8" class="mr-2 mr-sm-2" />
                        <app-transform-hash is-short is-blue :hash="eth.toCheckSum(props.tx.hash)" :link="`/address/${props.tx.hash}`" />
                    </div>
                </v-col>
                <v-col sm="3">
                    <app-transform-hash is-short is-blue :hash="eth.toCheckSum(props.tx.hash)" :link="`/tx/${props.tx.hash}`" />
                </v-col>
                <template v-if="props.tab === routes[2]">
                    <v-col sm="2">
                        <div class="d-flex justify-space-between">
                            <span>0.0259500 ETH</span>
                            <span>
                                <app-btn-icon icon="expand_more" />
                            </span>
                        </div>
                    </v-col>
                </template>
                <template v-else>
                    <v-col sm="2">{{ estimatedFee.value }} {{ estimatedFee.unit.toUpperCase() }}</v-col>
                </template>
            </template>
        </v-row>
        <!-- For desktop screens -->
        <v-row v-else class="my-5">
            <v-col sm="3">
                <div class="d-flex">
                    <span class="mr-6">
                        <v-icon v-if="props.tab === routes[2]" color="success">sync</v-icon>
                        <v-icon v-else>update</v-icon>
                    </span>
                    <div>
                        <p>{{ txValue.value }} {{ txValue.unit.toUpperCase() }}</p>
                        <p class="text-info">{{ timestamp }}</p>
                    </div>
                </div>
            </v-col>
            <v-col sm="2">
                <app-chip :bg="transferDirection.color" :text="transferDirection.text" />
            </v-col>
            <v-col sm="3">
                <div class="d-flex align-center">
                    <app-address-blockie :address="txAddress || ''" :size="8" class="mr-2 mr-sm-2" />
                    <app-transform-hash is-short is-blue :hash="eth.toCheckSum(props.tx.hash)" :link="`/address/${props.tx.hash}`" />
                </div>
            </v-col>
            <v-col sm="2">
                <app-transform-hash is-short is-blue :hash="eth.toCheckSum(props.tx.hash)" :link="`/tx/${props.tx.hash}`" />
            </v-col>
            <template v-if="props.tab === routes[2]">
                <v-col sm="2">
                    <div class="d-flex justify-space-between">
                        <span>0.0259500 ETH</span>
                        <span>
                            <app-btn-icon icon="expand_more" />
                        </span>
                    </div>
                </v-col>
            </template>
            <template v-else>
                <v-col sm="2">{{ estimatedFee.value }} {{ estimatedFee.unit.toUpperCase() }}</v-col>
            </template>
        </v-row>
        <div v-if="showMoreDetails && smAndDown" class="row-bg bg-tableGrey"></div>
    </div>
</template>

<script setup lang="ts">
import AppBtnIcon from '@core/components/AppBtnIcon.vue'
import AppAddressBlockie from '@/core/components/AppAddressBlockie.vue'
import AppTransformHash from '@/core/components/AppTransformHash.vue'
import AppChip from '@core/components/AppChip.vue'
import { Q_ADDRESS_TRANSFERS } from '@core/router/routesNames'
import { eth, timeAgo } from '@core/helper'
import { PendingTxsFragmentFragment } from '@module/address/apollo/EthTransfers/pendingTransfers.generated'
import { computed, ref } from 'vue'
import { formatVariableUnitEthValue, FormattedNumber } from '@core/helper/number-format-helper'
import BN from 'bignumber.js'
import { useDisplay } from 'vuetify'

const routes = Q_ADDRESS_TRANSFERS
const { smAndDown, xs } = useDisplay()

interface PropType {
    addressRef: string
    tx: PendingTxsFragmentFragment
}

const props = defineProps<PropType>()

const showMoreDetails = ref(false)

const txValue = computed<FormattedNumber>(() => {
    return formatVariableUnitEthValue(new BN(props.tx.value | 0))
})

const timestamp = computed<string>(() => {
    return timeAgo(new Date(props.tx.timestamp * 1e3), smAndDown.value)
})

const transferDirection = computed<{ [key: string]: string }>(() => {
    if (props.tx.to === props.addressRef) {
        return {
            text: 'From',
            color: 'success'
        }
    } else if (props.tx.from === props.addressRef) {
        return {
            text: 'To',
            color: 'warning'
        }
    }
    return {
        text: 'Self',
        color: 'orange'
    }
})

const txAddress = computed<string>(() => {
    if (props.tx.to === props.addressRef) {
        // Use the address of the destination address
        return props.tx.from
    }
    // use from address
    return props.tx.to
})

const estimatedFee = computed<FormattedNumber>(() => {
    const fee = new BN(props.tx.gas).multipliedBy(props.tx.gasPrice)
    return formatVariableUnitEthValue(fee)
})
</script>

<style scoped lang="scss">
.row-bg {
    top: 0;
    bottom: 0;
}
</style>
