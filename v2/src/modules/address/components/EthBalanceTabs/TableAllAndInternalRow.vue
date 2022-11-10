<template>
    <div class="position-relative">
        <v-row v-if="smAndDown" class="my-5" justify="space-between" @click="showMoreDetails = !showMoreDetails">
            <v-col cols="6">
                {{ transferDirection.text }}
            </v-col>
            <v-col cols="6">{{ txFee.value }} ETH</v-col>
            <v-col cols="6" class="text-info text-lowercase"> {{ timestamp }} {{ transferDirection.direction }} </v-col>
            <v-col cols="6">
                <div class="d-flex align-center">
                    <app-address-blockie :address="txAddress || ''" :size="6" class="mr-2 mr-sm-2" />
                    <app-transform-hash is-short is-blue :hash="eth.toCheckSum(txAddress)" :link="`/address/${txAddress}`" />
                </div>
            </v-col>
            <v-col cols="12" v-if="showMoreDetails">
                <div class="mb-3">
                    <span class="text-info font-weight-medium mr-2">Balance Before:</span>
                    <span>{{ balanceBefore.value }} ETH</span>
                </div>
                <div>
                    <span class="text-info font-weight-medium mr-2">Balance After:</span>
                    <span>{{ balanceAfter.value }} ETH</span>
                </div>
            </v-col>
        </v-row>
        <v-row v-else class="my-5" align="center">
            <v-col :sm="mdAndDown ? 3 : 2">
                <div class="d-flex">
                    <span style="width: 30px" class="d-inline-block">
                        <v-icon :color="statusIcon.color">{{ statusIcon.icon }}</v-icon>
                    </span>
                    <div class="ml-6">
                        {{ txFee.value }} ETH
                        <div v-if="mdAndDown" class="text-lowercase">{{ timestamp }} {{ transferDirection.direction }}</div>
                    </div>
                </div>
            </v-col>
            <v-col v-if="!mdAndDown" :sm="props.tab === routes[0] ? 2 : 1"> {{ timestamp }} </v-col>
            <template v-if="props.tab === routes[1]">
                <v-col v-if="!mdAndDown" cols="1" class="text-center">
                    <app-chip :bg="transferDirection.color" :text="transferDirection.direction" />
                </v-col>
                <v-col md="3" lg="2">
                    <div class="d-flex align-center">
                        <app-address-blockie :address="txAddress || ''" :size="8" class="mr-2 mr-sm-2" />
                        <app-transform-hash is-short is-blue :hash="eth.toCheckSum(txAddress)" :link="`/address/${txAddress}`" />
                    </div>
                </v-col>
                <v-col sm="2">
                    <app-transform-hash
                        is-short
                        is-blue
                        :hash="eth.toCheckSum(transfer.transfer.transactionHash)"
                        :link="`/tx/${transfer.transfer.transactionHash}`"
                    />
                </v-col>
            </template>
            <v-col sm="2"> {{ balanceBefore.value }} ETH </v-col>
            <v-col sm="2"> {{ balanceAfter.value }} ETH </v-col>
            <template v-if="props.tab === routes[0]">
                <v-col sm="2">
                    <app-chip bg="purple" text="transaction" />
                </v-col>
                <v-col sm="2">
                    <div class="d-flex align-center">
                        <span class="text-info mr-2">Hash:</span>
                        <app-transform-hash
                            is-short
                            is-blue
                            :hash="eth.toCheckSum('0x09d9591442b213fe4ac9d0634023b37cc818e51c')"
                            :link="`/address/${'0x09d9591442b213fe4ac9d0634023b37cc818e51c'}`"
                        />
                    </div>
                </v-col>
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
import { EthItxTransfersFragment } from '@module/address/apollo/EthTransfers/internalTransfers.generated'
import { computed, ref } from 'vue'
import { formatNonVariableEthValue, FormattedNumber } from '@core/helper/number-format-helper'
import BN from 'bignumber.js'
import { useDisplay } from 'vuetify'

const routes = Q_ADDRESS_TRANSFERS
const { smAndDown, mdAndDown } = useDisplay()

interface ComponentProps {
    transfer: EthItxTransfersFragment
    tab: string
    addressRef: string
}

const props = defineProps<ComponentProps>()

const showMoreDetails = ref(false)

const statusIcon = computed<{ [key: string]: string }>(() => {
    if (props.transfer.transfer.status) {
        return {
            icon: 'check_circle',
            color: 'success'
        }
    }
    return {
        icon: 'highlight_off',
        color: 'danger'
    }
})

const transferDirection = computed<{ [key: string]: string }>(() => {
    if (props.transfer.transfer.to === props.addressRef) {
        return {
            direction: 'From',
            text: 'Received',
            color: 'success'
        }
    } else if (props.transfer.transfer.from === props.addressRef) {
        return {
            direction: 'To',
            text: 'Sent',
            color: 'orange'
        }
    }
    return {
        text: 'Self',
        color: 'orange'
    }
})

const balanceBefore = computed<FormattedNumber>(() => {
    if (props.transfer.transfer.to === props.addressRef) {
        // Use the stateDiff of the destination address
        return formatNonVariableEthValue(new BN(props.transfer.stateDiff.to.before))
    }
    // use from address
    return formatNonVariableEthValue(new BN(props.transfer.stateDiff.from.before))
})

const balanceAfter = computed<FormattedNumber>(() => {
    if (props.transfer.transfer.to === props.addressRef) {
        // use to address
        return formatNonVariableEthValue(new BN(props.transfer.stateDiff.to.after))
    }
    // use from address
    return formatNonVariableEthValue(new BN(props.transfer.stateDiff.from.after))
})

const txAddress = computed<string>(() => {
    if (props.transfer.transfer.to === props.addressRef) {
        // Use the address of the destination address
        return props.transfer.transfer.from
    }
    // use from address
    return props.transfer.transfer.to
})

const timestamp = computed<string>(() => {
    const date = new Date(props.transfer.transfer.timestamp * 1e3)
    return timeAgo(date, false)
})

const txFee = computed<FormattedNumber>(() => {
    return formatNonVariableEthValue(new BN(props.transfer.transfer.txFee))
})
</script>

<style scoped lang="scss">
.row-bg {
    top: 0;
    bottom: 0;
}
</style>
