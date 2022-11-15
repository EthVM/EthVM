<template>
    <div class="position-relative">
        <v-row v-if="smAndDown" class="my-5" justify="space-between" @click="showMoreDetails = !showMoreDetails">
            <template v-if="props.tab === routes[0]">
                <v-col cols="6">
                    <v-avatar :color="transferDirection.color" size="22">
                        <v-icon size="13" color="white"> {{ transferDirection.icon }} </v-icon>
                    </v-avatar>
                    <span class="ml-2">
                        {{ transferDirection.text }}
                    </span>
                </v-col>
                <v-col cols="6" class="text-right">{{ txValue.value }} ETH</v-col>
                <v-col cols="6" class="text-info text-lowercase"> {{ timestamp }} {{ transferDirection.direction }} </v-col>
                <v-col cols="6">
                    <div class="d-flex align-center justify-end">
                        <app-address-blockie :address="txAddress || ''" :size="6" class="mr-2 mr-sm-2" />
                        <app-transform-hash is-short is-blue :hash="eth.toCheckSum(txAddress)" :link="`/address/${txAddress}`" />
                    </div>
                </v-col>
                <v-col cols="12" v-if="showMoreDetails">
                    <div v-if="!isIncoming" class="mb-4 d-flex justify-space-between">
                        <span class="text-info mr-2">tx fee paid:</span>
                        <span>{{ txFee.value }} ETH</span>
                    </div>
                    <div class="d-flex justify-space-between">
                        <span class="text-info mr-2">
                            <app-chip :bg="transferType.color" :text="transferType.text.toUpperCase()" class="text-caption" style="min-width: 120px" />
                        </span>
                        <span>
                            <app-transform-hash
                                is-short
                                is-blue
                                :hash="eth.toCheckSum(transfer.transfer.transactionHash)"
                                :link="`/tx/${transfer.transfer.transactionHash}`"
                            />
                        </span>
                    </div>
                </v-col>
            </template>
            <template v-if="props.tab === routes[1]">
                <v-col cols="6">
                    <v-avatar :color="transferDirection.color" size="22">
                        <v-icon size="13" color="white"> {{ transferDirection.icon }} </v-icon>
                    </v-avatar>
                    <span class="ml-2">
                        {{ transferDirection.text }}
                    </span>
                </v-col>
                <v-col cols="6" class="text-right">{{ txFee.value }} ETH</v-col>
                <v-col cols="6" class="text-info text-lowercase"> {{ timestamp }} {{ transferDirection.direction }} </v-col>
                <v-col cols="6">
                    <div class="d-flex align-center justify-end">
                        <app-address-blockie :address="txAddress || ''" :size="6" class="mr-2 mr-sm-2" />
                        <app-transform-hash is-short is-blue :hash="eth.toCheckSum(txAddress)" :link="`/address/${txAddress}`" />
                    </div>
                </v-col>
                <v-col cols="12" v-if="showMoreDetails">
                    <v-divider class="mx-n6 mb-3" />
                    <div class="mb-4 d-flex justify-space-between">
                        <span class="text-info mr-2">Balance Before:</span>
                        <span>{{ balanceBefore.value }} ETH</span>
                    </div>
                    <div class="mb-4 d-flex justify-space-between">
                        <span class="text-info mr-2">Balance After:</span>
                        <span>{{ balanceAfter.value }} ETH</span>
                    </div>
                    <div class="d-flex justify-space-between">
                        <span class="text-info mr-2">Hash:</span>
                        <span>
                            <app-transform-hash
                                is-short
                                is-blue
                                :hash="eth.toCheckSum(transfer.transfer.transactionHash)"
                                :link="`/tx/${transfer.transfer.transactionHash}`"
                            />
                        </span>
                    </div>
                </v-col>
            </template>
        </v-row>
        <v-row v-else class="my-5" align="center">
            <template v-if="props.tab === routes[0]">
                <v-col sm="3" lg="2">
                    <div class="d-flex">
                        <span style="width: 30px" class="d-inline-block">
                            <v-icon :color="statusIcon.color">{{ statusIcon.icon }}</v-icon>
                        </span>
                        <div class="ml-4">
                            {{ txValue.value }} ETH
                            <div class="text-lowercase">
                                {{ timestamp }} <span v-if="mdAndDown">{{ transferDirection.direction }}</span>
                            </div>
                            <app-chip
                                v-if="mdAndDown"
                                :bg="transferType.color"
                                :text="transferType.text.toUpperCase()"
                                class="tiny-text"
                                style="min-width: 120px"
                            />
                        </div>
                    </div>
                </v-col>
                <v-col v-if="!mdAndDown" sm="2">
                    <app-chip :bg="transferType.color" :text="transferType.text.toUpperCase()" size="x-small" class="tiny-text" style="min-width: 120px" />
                </v-col>
                <v-col sm="2">
                    <p v-if="isBlockReward" class="text-secondary">
                        {{ formatNumber(props.transfer.transfer.block) }}
                    </p>
                    <app-transform-hash
                        v-else
                        is-short
                        is-blue
                        :hash="eth.toCheckSum(props.transfer.transfer.transactionHash)"
                        :link="`/address/${props.transfer.transfer.transactionHash}`"
                    />
                </v-col>
                <v-col sm="2">
                    <app-chip v-if="!isBlockReward" :bg="transferDirection.color" :text="transferDirection.direction" size="x-small" class="tiny-text" />
                </v-col>
                <v-col sm="3" lg="2">
                    <div v-if="!isBlockReward" class="d-flex align-center">
                        <app-address-blockie :address="txAddress || ''" :size="8" class="mr-2 mr-sm-2" />
                        <app-transform-hash is-short is-blue :hash="eth.toCheckSum(txAddress)" :link="`/address/${txAddress}`" />
                    </div>
                </v-col>
                <v-col sm="2">
                    <span v-if="!isIncoming"> {{ txFee.value }} ETH </span>
                </v-col>
            </template>
            <template v-if="props.tab === routes[1]">
                <v-col :sm="mdAndDown ? 3 : 2">
                    <div class="d-flex">
                        <span style="width: 30px" class="d-inline-block">
                            <v-icon :color="statusIcon.color">{{ statusIcon.icon }}</v-icon>
                        </span>
                        <div class="ml-4">
                            {{ txFee.value }} ETH
                            <div class="text-lowercase">
                                {{ timestamp }} <span v-if="mdAndDown">{{ transferDirection.direction }}</span>
                            </div>
                        </div>
                    </div>
                </v-col>
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
                <v-col sm="2"> {{ balanceBefore.value }} ETH </v-col>
                <v-col sm="2" lg="3"> {{ balanceAfter.value }} ETH </v-col>
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
import { formatNonVariableEthValue, FormattedNumber, formatNumber } from '@core/helper/number-format-helper'
import BN from 'bignumber.js'
import { useDisplay } from 'vuetify'

const routes = Q_ADDRESS_TRANSFERS
const BLOCK_REWARD_HASH = '0xBLOCK_REWARD'
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
            icon: 'task_alt',
            color: 'success'
        }
    }
    return {
        icon: 'highlight_off',
        color: 'danger'
    }
})

enum TRANSFER_DIRECTION {
    FROM = 'From',
    TO = 'To',
    SELF = 'Self'
}

const transferDirection = computed<{ [key: string]: string }>(() => {
    if (props.transfer.transfer.to === props.addressRef.toLowerCase()) {
        return {
            direction: TRANSFER_DIRECTION.FROM,
            text: 'Received',
            color: 'success',
            icon: 'south_east'
        }
    } else if (props.transfer.transfer.from === props.addressRef.toLowerCase()) {
        return {
            direction: TRANSFER_DIRECTION.TO,
            text: 'Sent',
            color: 'warning',
            icon: 'north_west'
        }
    }
    return {
        direction: TRANSFER_DIRECTION.SELF,
        text: 'Self',
        color: 'orange',
        icon: 'refresh'
    }
})

const isBlockReward = computed<boolean>(() => {
    return props.transfer.transfer.from === BLOCK_REWARD_HASH
})

const isIncoming = computed<boolean>(() => {
    return transferDirection.value.direction === TRANSFER_DIRECTION.FROM
})

const transferType = computed<{ [key: string]: string }>(() => {
    if (isBlockReward.value) {
        return {
            text: 'block reward',
            color: 'success'
        }
    }
    return {
        text: 'transaction',
        color: 'purple'
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
    return timeAgo(date, smAndDown.value)
})

const txValue = computed<FormattedNumber>(() => {
    return formatNonVariableEthValue(new BN(props.transfer.value))
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

.tiny-text {
    font-size: 10px !important;
}
</style>
