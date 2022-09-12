<template>
    <div class="position-relative" :class="state.showMoreDetails && props.index > 0 ? 'mt-10' : null">
        <!--
          ========================
            Desktop View
          =========================
       -->
        <template v-if="!mdAndDown">
            <v-row class="my-5 px-0 text-body-1 font-weight-regular" align="center">
                <v-col :cols="props.isOverview ? 3 : 2" class="py-0">
                    <v-row class="ma-0 flex-nowrap" align="center">
                        <img :src="tokenImg" alt="" height="32" width="32" class="mr-2 rounded-circle" />
                        <div style="display: grid">
                            <router-link
                                v-if="props.transfer.tokenInfo.name !== '' || props.transfer.tokenInfo.symbol"
                                :to="`/token/${props.transfer.contract}`"
                                class="text-textPrimary text-ellipses"
                            >
                                <p v-if="props.transfer.tokenInfo.name" class="text-ellipses">{{ props.transfer.tokenInfo.name }}</p>
                                <p v-else class="text-uppercase caption text-ellipses">{{ props.transfer.tokenInfo.symbol }}</p>
                            </router-link>
                            <p v-if="props.isOverview" class="text-info pt-1 text-ellipses">
                                {{ props.transfer.tokenInfo.symbol }}
                            </p>
                        </div>
                    </v-row>
                </v-col>
                <v-col v-if="!props.isOverview" cols="1" class="text-info py-0 text-ellipses">
                    {{ props.transfer.tokenInfo.symbol }}
                </v-col>
                <v-col :cols="props.isOverview ? 3 : 2" class="py-0">
                    <v-row class="ma-0" align="center">
                        <p>
                            {{ tokenAmount.value }}
                        </p>
                    </v-row>
                    <p v-if="props.isOverview" class="text-info">
                        {{ timeAgo(new Date(props.transfer.transfer.timestamp * 1e3)) }}
                    </p>
                </v-col>
                <v-col :cols="props.isOverview ? 2 : 1" class="py-0">
                    <app-chip :bg="transferType === 'in' ? 'success' : 'orange'" :text="transferType === 'in' ? 'From' : 'To'" />
                </v-col>
                <v-col :cols="props.isOverview ? 4 : 2" class="text-secondary py-0">
                    <div class="d-flex align-center">
                        <app-address-blockie :address="transferTypeAddress || ''" :size="6" class="mr-5" />
                        <app-transform-hash is-blue is-short :hash="eth.toCheckSum(transferTypeAddress)" :link="`/address/${transferTypeAddress}`" />
                    </div>
                </v-col>
                <v-col v-if="!props.isOverview" cols="2" class="text-secondary py-0">
                    <app-transform-hash
                        is-blue
                        is-short
                        :hash="eth.toCheckSum(props.transfer.transfer.transactionHash)"
                        :link="`/tx/${eth.toCheckSum(props.transfer.transfer.transactionHash)}`"
                    />
                </v-col>
                <v-col v-if="!props.isOverview" cols="1" class="text-info py-0">
                    {{ timeAgo(new Date(props.transfer.transfer.timestamp * 1e3)) }}
                </v-col>
                <v-col v-if="!props.isOverview" cols="1" class="py-0 text-right">
                    <app-btn-icon :icon="dropdownIcon" @click="toggleMoreDetails"></app-btn-icon>
                </v-col>
            </v-row>
            <v-row v-if="state.showMoreDetails" class="pb-5">
                <v-col md="3" class="text-right text-body-1 font-weight-bold text-info">Balance Before</v-col>
                <v-col md="9" class="text-subtitle-2">{{ getTransferBalanceBefore.value }} {{ props.transfer.tokenInfo.symbol }}</v-col>
                <v-col md="3" class="text-right text-body-1 font-weight-bold text-info">Balance After</v-col>
                <v-col md="9" class="text-subtitle-2">{{ getTransferBalanceAfter.value }} {{ props.transfer.tokenInfo.symbol }}</v-col>
            </v-row>
        </template>
        <!--
           ========================
             Mobile/Tablet View
           =========================
        -->
        <template v-else>
            <v-row class="my-5 text-subtitle-2 font-weight-regular" @click="toggleMoreDetails">
                <v-col cols="6" class="pb-2">
                    <div class="d-flex align-center flex-nowrap">
                        <div class="mobile-chip rounded-circle mr-2" :class="transferType ? 'bg-success' : 'bg-orange'">
                            <v-icon size="18">
                                {{ transferType === 'in' ? 'south_east' : 'north_west' }}
                            </v-icon>
                        </div>
                        <span>
                            {{ transferType === 'in' ? 'Received' : 'Sent' }}
                        </span>
                    </div>
                </v-col>
                <v-col cols="6" class="pb-2">
                    <div class="d-flex align-center">
                        <img :src="tokenImg" alt="" height="24" width="24" class="mr-2 rounded-circle" />
                        <span> {{ tokenAmount.value }} {{ props.transfer.tokenInfo.symbol }} </span>
                    </div>
                </v-col>
                <v-col cols="6" class="py-0 text-info">
                    {{ timeAgo(new Date(props.transfer.transfer.timestamp * 1e3)) }} {{ transferType === 'in' ? 'from' : 'to' }}
                </v-col>
                <v-col cols="6" class="py-0 text-secondary">
                    <div class="d-flex align-center">
                        <app-address-blockie :address="transferTypeAddress || ''" :size="6" class="mr-2" />
                        <app-transform-hash is-blue is-short :hash="eth.toCheckSum(transferTypeAddress)" :link="`/address/${transferTypeAddress}`" />
                    </div>
                </v-col>
            </v-row>
            <div v-if="state.showMoreDetails" class="pb-5 text-subtitle-2 font-weight-regular">
                <div>
                    <p class="text-info mb-1">Hash</p>
                    <app-transform-hash
                        is-blue
                        is-short
                        :hash="eth.toCheckSum(props.transfer.transfer.transactionHash)"
                        :link="`/tx/${props.transfer.transfer.transactionHash}`"
                    />
                </div>
                <v-divider class="my-5 mx-n4 mx-sm-n6" />
                <v-row justify="space-between" class="my-5 mx-0">
                    <p class="text-info">Balance Before</p>
                    <p>{{ getTransferBalanceBefore.value }} {{ props.transfer.tokenInfo.symbol }}</p>
                </v-row>
                <v-row justify="space-between" class="my-5 mx-0">
                    <p class="text-info">Tx Fee Paid</p>
                    <p class="text-error">-{{ txFee.value }} {{ txFee.unit.toUpperCase() }}</p>
                </v-row>
                <v-row justify="space-between" class="my-5 mx-0">
                    <p class="text-info">Balance After</p>
                    <p>{{ getTransferBalanceAfter.value }} {{ props.transfer.tokenInfo.symbol }}</p>
                </v-row>
            </div>
        </template>
        <div v-if="state.showMoreDetails" class="row-bg bg-tableGrey"></div>
    </div>
</template>

<script setup lang="ts">
import AppChip from '@core/components/AppChip.vue'
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import AppTransformHash from '@core/components/AppTransformHash.vue'
import AppBtnIcon from '@core/components/AppBtnIcon.vue'
import { useDisplay } from 'vuetify'
import { computed, reactive } from 'vue'
import { TransferFragmentFragment as Transfer } from '../../apollo/AddressTransfers/transfers.generated'
import { MarketDataFragment as TokenMarketData } from '@core/composables/CoinData/getLatestPrices.generated'
import BN from 'bignumber.js'
import { formatFloatingPointValue, formatNonVariableEthValue, FormattedNumber } from '@core/helper/number-format-helper'
import { timeAgo, eth } from '@core/helper'

interface ComponentProps {
    isOverview: boolean
    transfer: Transfer
    tokenImg: Map<string, TokenMarketData> | false
    addressHash: string
    index: string
}

const props = defineProps<ComponentProps>()

interface ComponentState {
    showMoreDetails: boolean
}

const state: ComponentState = reactive({
    showMoreDetails: false
})

const { mdAndDown } = useDisplay()

/**
 * Fetches image for the contract
 */
const tokenImg = computed<string>(() => {
    const contract = props.transfer.contract
    if (props.tokenImg && props.tokenImg.has(contract)) {
        const token = props.tokenImg.get(contract)
        return token?.image
    }
    return require('@/assets/icon-token.png')
})

const getValue = (transfer: Transfer): BN => {
    let n = new BN(transfer.value)
    if (transfer.tokenInfo.decimals) {
        n = n.div(new BN(10).pow(transfer.tokenInfo.decimals))
    }
    return n
}

const tokenAmount = computed<FormattedNumber>(() => {
    return formatFloatingPointValue(getValue(props.transfer))
})

const txFee = computed<FormattedNumber>(() => {
    return formatNonVariableEthValue(new BN(props.transfer.transfer.txFee))
})

const dropdownIcon = computed<string>(() => {
    return state.showMoreDetails ? 'expand_less' : 'expand_more'
})

const TYPES = ['in', 'out', 'self']
const transferType = computed<string>(() => {
    const from = props.transfer.transfer.from.toLowerCase()
    const to = props.transfer.transfer.to.toLowerCase()
    const addr = props.addressHash.toLowerCase()

    if (addr === from && addr === to) {
        return TYPES[2]
    } else if (addr === from) {
        return TYPES[1]
    }
    return TYPES[0]
})

const transferTypeAddress = computed<string>(() => {
    switch (transferType.value) {
        case TYPES[0]:
            return props.transfer.transfer.from
        case TYPES[1]:
            return props.transfer.transfer.to
        default:
            return props.addressHash
    }
})

const getTransferBalanceBefore = computed<FormattedNumber>(() => {
    const type = transferTypeAddress.value
    if (!props.transfer.stateDiff) {
        return { value: '0' }
    }
    if (type === TYPES[0] && props.transfer.stateDiff.to) {
        return formatNonVariableEthValue(new BN(props.transfer.stateDiff.to.before))
    }
    return formatNonVariableEthValue(new BN(props.transfer.stateDiff.to.before))
})

const getTransferBalanceAfter = computed<FormattedNumber>(() => {
    const type = transferTypeAddress.value
    if (!props.transfer.stateDiff) {
        return { value: '0' }
    }
    if (type === TYPES[0] && props.transfer.stateDiff.to) {
        return formatNonVariableEthValue(new BN(props.transfer.stateDiff.to.after))
    }
    return formatNonVariableEthValue(new BN(props.transfer.stateDiff.to.after))
})

const toggleMoreDetails = (): void => {
    state.showMoreDetails = !state.showMoreDetails
}
</script>

<style scoped></style>
