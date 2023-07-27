<template>
    <!-- For tablet devices and below -->
    <app-table-row v-if="smAndDown" row-align="center" @click="showMoreDetails = !showMoreDetails" :color="showMoreDetails ? 'lightGrey' : 'transparent'">
        <!-- For mobile devices -->
        <template v-if="xs">
            <v-col cols="6">
                <v-avatar color="info" size="22">
                    <v-icon size="13" color="white">refresh</v-icon>
                </v-avatar>
                <span class="ml-2"> Pending </span>
            </v-col>
            <v-col cols="6">
                <p>{{ txValue.value }} {{ txValue.unit.toUpperCase() }}</p>
            </v-col>
            <v-col cols="6">
                <p class="text-info">{{ timestamp }}</p>
            </v-col>
            <v-col cols="6">
                <div class="d-flex align-center">
                    <app-address-blockie :address="txAddress || ''" :size="6" class="mr-2 mr-sm-2" />
                    <app-transform-hash is-short is-blue :hash="eth.toCheckSum(props.tx.hash)" :link="`/address/${props.tx.hash}`" />
                </div>
            </v-col>
        </template>
        <template #expandable>
            <v-col cols="12" v-if="showMoreDetails && xs">
                <v-row>
                    <v-col cols="6" class="text-info"> Estimated fee </v-col>
                    <v-col cols="6"> {{ estimatedFee.value }} {{ estimatedFee.unit.toUpperCase() }} </v-col>
                </v-row>
            </v-col>
        </template>
        <!-- For tablet devices / landscaped -->
        <template v-if="!xs">
            <v-col sm="4">
                <div class="d-flex">
                    <span class="mr-4">
                        <v-icon>refresh</v-icon>
                    </span>
                    <div>
                        <p>{{ txValue.value }} {{ txValue.unit.toUpperCase() }}</p>
                        <p class="text-info">{{ timestamp }} {{ transferDirection.text }}</p>
                    </div>
                </div>
            </v-col>
            <v-col sm="3">
                <div class="d-flex align-center">
                    <app-address-blockie :address="txAddress || ''" :size="6" class="mr-2 mr-sm-2" />
                    <app-transform-hash is-short is-blue :hash="eth.toCheckSum(props.tx.hash)" :link="`/address/${props.tx.hash}`" />
                </div>
            </v-col>
            <v-col sm="3">
                <app-transform-hash is-short is-blue :hash="eth.toCheckSum(props.tx.hash)" :link="`/tx/${props.tx.hash}`" />
            </v-col>
            <template>
                <v-col sm="2">{{ estimatedFee.value }} {{ estimatedFee.unit.toUpperCase() }}</v-col>
            </template>
        </template>
    </app-table-row>
    <!-- For desktop screens -->
    <app-table-row v-else>
        <v-col sm="3">
            <div class="d-flex">
                <span class="mr-4">
                    <v-icon v-if="props.tab === routes[2]" color="success">sync</v-icon>
                    <v-icon v-else>refresh</v-icon>
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
        <v-col sm="2">{{ estimatedFee.value }} {{ estimatedFee.unit.toUpperCase() }}</v-col>
    </app-table-row>
</template>

<script setup lang="ts">
import AppAddressBlockie from '@/core/components/AppAddressBlockie.vue'
import AppTransformHash from '@/core/components/AppTransformHash.vue'
import AppChip from '@core/components/AppChip.vue'
import AppTableRow from '@core/components/AppTableRow.vue'
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
    return formatVariableUnitEthValue(new BN(props.tx?.value || 0))
})

const timestamp = computed<string>(() => {
    const date = props.tx?.timestamp ? new Date(props.tx?.timestamp * 1e3) : new Date()
    return timeAgo(date, smAndDown.value)
})

enum TRANSFER_DIRECTION {
    FROM = 'From',
    TO = 'To',
    SELF = 'Self'
}

const transferDirection = computed<{ [key: string]: string }>(() => {
    // If to and from address is the same, then transfer is self
    if (props.tx.to === props.addressRef.toLowerCase() && props.tx.from === props.addressRef.toLowerCase()) {
        return {
            color: 'info',
            text: TRANSFER_DIRECTION.SELF
        }
    }
    if (props.tx.to === props.addressRef.toLowerCase()) {
        return {
            text: TRANSFER_DIRECTION.FROM,
            color: 'success'
        }
    } else if (props.tx.from === props.addressRef.toLowerCase()) {
        return {
            text: TRANSFER_DIRECTION.TO,
            color: 'warning'
        }
    }
    return {
        text: 'Self',
        color: 'warning'
    }
})

const txAddress = computed<string>(() => {
    if (props.tx.to === props.addressRef.toLowerCase()) {
        // Use the address of the destination address
        return props.tx.from
    }
    // use from address
    return props.tx.to || ''
})

const estimatedFee = computed<FormattedNumber>(() => {
    const fee = new BN(props.tx.gas).multipliedBy(props.tx.gasPrice)
    return formatVariableUnitEthValue(fee)
})
</script>
