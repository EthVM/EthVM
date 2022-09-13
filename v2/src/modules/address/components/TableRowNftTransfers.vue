<template>
    <div class="position-relative">
        <!--
               ========================
                 Desktop View
               =========================
        -->
        <v-row v-if="!mdAndDown" class="my-5 px-0 text-subtitle-2 font-weight-regular" align="center">
            <v-col :cols="props.isOverview ? 4 : 3" class="py-0">
                <v-row class="ma-0 flex-nowrap" align="center">
                    <img :src="tokenImg" alt="" height="41" width="41" class="mr-2 rounded-circle" />
                    <div style="display: grid">
                        <router-link
                            v-if="props.transfer.tokenInfo.name !== '' || props.transfer.tokenInfo.symbol"
                            :to="`/token/${props.transfer.contract}`"
                            class="text-textPrimary text-ellipses"
                        >
                            <p v-if="props.transfer.tokenInfo.name" class="text-ellipses">{{ props.transfer.tokenInfo.name }}</p>
                            <p v-else class="text-uppercase caption text-ellipses">N/A</p>
                        </router-link>
                    </div>
                </v-row>
            </v-col>
            <v-col :cols="props.isOverview ? 2 : 1" class="text-info py-0 text-ellipses">
                {{ totalTokens }}
            </v-col>
            <v-col :cols="props.isOverview ? 2 : 1" class="py-0">
                <app-chip :bg="transferType === 'in' ? 'success' : 'warning'" :text="transferType === 'in' ? 'From' : 'To'" />
            </v-col>
            <v-col :cols="props.isOverview ? 4 : 3" class="text-secondary py-0">
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
                    :link="`/tx/${props.transfer.transfer.transactionHash}`"
                />
            </v-col>
            <v-col v-if="!props.isOverview" cols="2" class="text-info py-0">
                {{ timeAgo(new Date(props.transfer.transfer.timestamp * 1e3)) }}
            </v-col>
        </v-row>
        <!--
                       ========================
                         Mobile/Tablet View
                       =========================
                -->
        <template v-else>
            <v-row
                class="mt-5 mx-0 text-subtitle-2 font-weight-regular justify-space-between align-start flex-nowrap"
                :class="state.showMoreDetails ? 'mb-3' : 'mb-5'"
                @click="toggleMoreDetails"
            >
                <div class="flex-shrink-0">
                    <div class="d-flex align-center flex-nowrap mb-2">
                        <div class="mobile-chip rounded-circle mr-2" :class="transferType === 'in' ? 'bg-success' : 'bg-warning'">
                            <v-icon size="12">
                                {{ transferType === 'in' ? 'south_east' : 'north_west' }}
                            </v-icon>
                        </div>
                        <span>
                            {{ transferType === 'in' ? 'Received' : 'Sent' }}
                        </span>
                    </div>
                    <p class="text-info">{{ timeAgo(new Date(props.transfer.transfer.timestamp * 1e3)) }}</p>
                </div>
                <v-col v-if="!state.showMoreDetails" cols="6" class="pa-0">
                    <p v-if="props.transfer.tokenInfo.name" class="text-center">{{ props.transfer.tokenInfo.name }}</p>
                </v-col>
                <div class="d-flex align-center">
                    <img :src="tokenImg" alt="" height="41" width="41" class="mr-2 rounded-circle" />
                </div>
            </v-row>
            <div v-if="state.showMoreDetails" class="row-bg bg-tableGrey"></div>
            <div v-if="state.showMoreDetails">
                <v-row class="mx-0 justify-space-between text-subtitle-2 font-weight-regular mb-2">
                    <p v-if="props.transfer.tokenInfo.name" class="text-center">{{ props.transfer.tokenInfo.name }}</p>
                    <p>{{ totalTokens }} Copies</p>
                </v-row>
                <v-row class="ma-0 justify-space-between text-subtitle-2 font-weight-regular pb-5">
                    <div>
                        <p class="text-info mb-2">From</p>
                        <div class="d-flex">
                            <app-address-blockie :address="transferTypeAddress || ''" :size="6" class="mr-2" />
                            <app-transform-hash is-blue is-short :hash="eth.toCheckSum(transferTypeAddress)" :link="`/address/${transferTypeAddress}`" />
                        </div>
                    </div>
                    <div>
                        <p class="text-info mb-2">Hash</p>
                        <app-transform-hash
                            is-blue
                            is-short
                            :hash="eth.toCheckSum(props.transfer.transfer.transactionHash)"
                            :link="`/tx/${props.transfer.transfer.transactionHash}`"
                        />
                    </div>
                </v-row>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import AppTransformHash from '@core/components/AppTransformHash.vue'
import AppChip from '@core/components/AppChip.vue'
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import { useDisplay } from 'vuetify'
import { TransferFragmentFragment as Transfer } from '../apollo/AddressTransfers/transfers.generated'
import BN from 'bignumber.js'
import configs from '@/configs'
import { formatNumber, FormattedNumber } from '@core/helper/number-format-helper'
import { computed, reactive } from 'vue'
import { timeAgo, eth } from '@core/helper'

const { mdAndDown } = useDisplay()

interface ComponentProps {
    isOverview: boolean
    transfer: Transfer
    addressHash: string
}

const props = defineProps<ComponentProps>()

interface ComponentState {
    showMoreDetails: boolean
}

const state: ComponentState = reactive({
    showMoreDetails: false
})

/**
 * Fetches image for the contract
 */
const tokenImg = computed<string>(() => {
    if (props.transfer) {
        const tokenId = new BN(props.transfer.token).toString()
        return `${configs.OPENSEA}/getImage?contract=${props.transfer.contract}&tokenId=${tokenId.toString()}`
    }
    return require('@/assets/icon-token.png')
})

const totalTokens = computed<FormattedNumber | string>(() => {
    return formatNumber(new BN(props.transfer.token).toNumber())
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

const toggleMoreDetails = (): void => {
    if (mdAndDown.value) {
        state.showMoreDetails = !state.showMoreDetails
    }
}
</script>
