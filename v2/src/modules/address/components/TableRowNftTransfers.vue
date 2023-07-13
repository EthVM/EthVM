<template>
    <!--
    ========================
        Desktop View
    =========================
    -->
    <app-table-row v-if="!smAndDown" row-align="center">
        <v-col :cols="props.isOverview ? 4 : 3" class="d-flex align-center">
            <token-nft-img
                v-if="!props.metaIsLoading"
                :loading="props.metaIsLoading"
                :nft="tokenMeta"
                height="40"
                width="40"
                class="rounded-md"
            ></token-nft-img>
            <p class="text-truncate pl-4">
                {{ tokenName }}
                <span v-if="props.isOverview" class="text-info text-truncate d-block">{{
                    timeAgo(new Date(props.transfer.transfer.timestamp * 1e3), true)
                }}</span>
            </p>
        </v-col>
        <v-col :cols="props.isOverview ? 2 : 1" class="text-info text-truncate">
            {{ totalTokens }}
        </v-col>
        <v-col :cols="props.isOverview ? 2 : 1">
            <app-chip :bg="transferType === 'in' ? 'success' : 'warning'" :text="transferType === 'in' ? $t('common.from') : $t('common.to')" />
        </v-col>
        <v-col :cols="props.isOverview ? 4 : 3" class="text-secondary">
            <div class="d-flex align-center">
                <app-address-blockie :address="transferTypeAddress || ''" :size="6" class="mr-4" />
                <app-transform-hash is-blue is-short :hash="eth.toCheckSum(transferTypeAddress)" :link="`/address/${transferTypeAddress}`" />
            </div>
        </v-col>
        <v-col v-if="!props.isOverview" cols="2" class="text-secondary">
            <app-transform-hash
                is-blue
                is-short
                :hash="eth.toCheckSum(props.transfer.transfer.transactionHash)"
                :link="`/tx/${props.transfer.transfer.transactionHash}`"
            />
        </v-col>
        <v-col v-if="!props.isOverview" cols="2" class="text-info">
            {{ timeAgo(new Date(props.transfer.transfer.timestamp * 1e3)) }}
        </v-col>
    </app-table-row>
    <!--
    ========================
        Mobile/Tablet View
    =========================
    -->
    <template v-else>
        <app-table-row row-align="start" row-justify="space-between" @click="toggleMoreDetails" :color="state.showMoreDetails ? 'pillGrey' : 'transparent'">
            <v-col class="flex-shrink-0">
                <div class="d-flex align-center flex-nowrap mb-2">
                    <div class="mobile-chip rounded-circle mr-2" :class="transferType === 'in' ? 'bg-success' : 'bg-warning'">
                        <v-icon size="12">
                            {{ transferType === 'in' ? 'south_east' : 'north_west' }}
                        </v-icon>
                    </div>
                    <span>
                        {{ transferType === 'in' ? $t('txs.status.recieve') : $t('txs.status.sent') }}
                    </span>
                </div>
                <p class="text-info">{{ timeAgo(new Date(props.transfer.transfer.timestamp * 1e3)) }}</p>
            </v-col>
            <v-col v-if="!state.showMoreDetails" cols="6">
                <p v-if="!props.metaIsLoading" class="text-center text-truncate">{{ tokenName }}</p>
                <div v-else class="skeleton-box rounded-md" style="height: 20px"></div>
            </v-col>
            <v-col class="d-flex align-center justify-end">
                <token-nft-img v-if="!props.metaIsLoading" :loading="props.metaIsLoading" :nft="tokenMeta" height="40" width="40"></token-nft-img>
                <div v-else class="skeleton-box rounded-md" style="height: 40px; min-width: 40px; max-width: 40px"></div>
            </v-col>
            <template #expandable>
                <v-col cols="12" v-if="state.showMoreDetails">
                    <v-row class="mx-0 justify-space-between mb-2">
                        <p v-if="props.transfer.tokenInfo.name" class="text-center">{{ props.transfer.tokenInfo.name }}</p>
                        <p>{{ totalTokens }} Copies</p>
                    </v-row>
                    <v-row class="ma-0 justify-space-between pb-5">
                        <div>
                            <p class="text-info mb-2">{{ $t('common.address') }}</p>
                            <div class="d-flex">
                                <app-address-blockie :address="transferTypeAddress || ''" :size="6" class="mr-2" />
                                <app-transform-hash is-blue is-short :hash="eth.toCheckSum(transferTypeAddress)" :link="`/address/${transferTypeAddress}`" />
                            </div>
                        </div>
                        <div>
                            <p class="text-info mb-2">{{ $t('common.hash') }}</p>
                            <app-transform-hash
                                is-blue
                                is-short
                                :hash="eth.toCheckSum(props.transfer.transfer.transactionHash)"
                                :link="`/tx/${props.transfer.transfer.transactionHash}`"
                            />
                        </div>
                    </v-row>
                </v-col>
            </template>
        </app-table-row>
    </template>
</template>

<script setup lang="ts">
import AppTransformHash from '@core/components/AppTransformHash.vue'
import AppTableRow from '@core/components/AppTableRow.vue'
import AppChip from '@core/components/AppChip.vue'
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import { useDisplay } from 'vuetify'
import { NftTransferFragmentFragment as Transfer } from '../apollo/AddressTransfers/transfers.generated'
import BN from 'bignumber.js'
import { formatNumber } from '@core/helper/number-format-helper'
import { computed, reactive } from 'vue'
import { timeAgo, eth } from '@core/helper'
import { NftMetaFragment } from '@core/composables/NftMeta/nftMeta.generated'
import TokenNftImg from '@module/tokens/components/TokenNFT/TokenNftImg.vue'
import { NFTDetails } from '@module/tokens/components/TokenNFT/propModel'
import Web3Utils from 'web3-utils'

const { mdAndDown, smAndDown } = useDisplay()

interface ComponentProps {
    isOverview: boolean
    transfer: Transfer
    addressHash: string
    nftMeta?: NftMetaFragment
    metaIsLoading: boolean
}

const props = defineProps<ComponentProps>()

interface ComponentState {
    showMoreDetails: boolean
}

const state: ComponentState = reactive({
    showMoreDetails: false
})

const tokenMeta = computed<NFTDetails>(() => {
    return {
        type: props.transfer.transfer.type,
        contract: props.transfer.contract,
        id: Web3Utils.hexToNumberString(props.transfer.tokenId),
        meta: props.nftMeta
    }
})

const tokenName = computed<string>(() => {
    return props.nftMeta && props.nftMeta.name
        ? props.nftMeta.name
        : props.transfer.tokenInfo.name
        ? props.transfer.tokenInfo.name
        : `Unknown-${props.transfer.transfer.type}`
})

const totalTokens = computed<string>(() => {
    if (props.transfer.value && props.transfer.value !== '0x0') {
        return formatNumber(new BN(props.transfer.value).toNumber())
    }
    return '1'
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
