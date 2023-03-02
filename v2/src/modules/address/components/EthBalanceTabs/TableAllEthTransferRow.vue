<template>
    <div>
        <app-table-row v-if="smAndDown" @click="showMoreDetails = !showMoreDetails" :color="showMoreDetails ? 'pillGrey' : 'transparent'">
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
            <template #expandable>
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
                            <router-link v-if="isBlockReward" :to="`/block/number/${props.transfer.transfer.block}`" class="text-secondary">
                                {{ formatNumber(props.transfer.transfer.block) }}
                            </router-link>
                            <app-transform-hash
                                v-else
                                is-short
                                is-blue
                                :hash="eth.toCheckSum(transfer.transfer.transactionHash)"
                                :link="`/tx/${transfer.transfer.transactionHash}`"
                            />
                        </span>
                    </div>
                </v-col>
            </template>
        </app-table-row>
        <app-table-row v-else row-align="center">
            <v-col sm="3" lg="2">
                <div class="d-flex">
                    <span style="width: 30px" class="d-inline-block">
                        <v-icon :color="statusIcon.color">{{ statusIcon.icon }}</v-icon>
                    </span>
                    <div class="ml-4">
                        {{ txValue.value }} ETH
                        <div class="text-lowercase text-info">
                            {{ timestamp }}
                        </div>
                    </div>
                </div>
            </v-col>
            <v-col v-if="!mdAndDown" sm="2">
                <app-chip :bg="transferType.color" :text="transferType.text.toUpperCase()" size="x-small" class="tiny-text" style="min-width: 131px" />
            </v-col>
            <v-col sm="2">
                <app-chip v-if="mdAndDown" :bg="transferType.color" :text="transferType.text.toUpperCase()" class="tiny-text mb-1" style="min-width: 120px" />
                <router-link v-if="isBlockReward" :to="`/block/number/${props.transfer.transfer.block}`" class="text-secondary">
                    {{ formatNumber(props.transfer.transfer.block) }}
                </router-link>
                <app-transform-hash
                    v-else
                    is-short
                    is-blue
                    :hash="eth.toCheckSum(props.transfer.transfer.transactionHash)"
                    :link="`/tx/${props.transfer.transfer.transactionHash}`"
                />
            </v-col>
            <v-col sm="2" class="d-flex justify-sm-center justify-lg-start">
                <app-chip
                    v-if="!isBlockReward"
                    :bg="transferDirection.color"
                    :text="transferDirection.direction"
                    size="x-small"
                    class="tiny-text text-uppercase"
                />
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
        </app-table-row>
    </div>
</template>

<script setup lang="ts">
import AppAddressBlockie from '@/core/components/AppAddressBlockie.vue'
import AppTransformHash from '@/core/components/AppTransformHash.vue'
import AppChip from '@core/components/AppChip.vue'
import AppTableRow from '@core/components/AppTableRow.vue'
import { eth, timeAgo } from '@core/helper'
import { EthInternalTransactionTransfersFragment } from '@module/address/apollo/EthTransfers/internalTransfers.generated'
import { computed, ref } from 'vue'
import { formatNonVariableEthValue, FormattedNumber, formatNumber } from '@core/helper/number-format-helper'
import BN from 'bignumber.js'
import { useDisplay } from 'vuetify'
import { TransferSubtype } from '@/apollo/types'

const { smAndDown, mdAndDown } = useDisplay()

interface ComponentProps {
    transfer: EthInternalTransactionTransfersFragment
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
    // If to and from address is the same, then transfer is self
    if (props.transfer.transfer.to === props.addressRef.toLowerCase() && props.transfer.transfer.from === props.addressRef.toLowerCase()) {
        return {
            direction: TRANSFER_DIRECTION.SELF,
            text: 'Self',
            color: 'info',
            icon: 'refresh'
        }
    }
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
        color: 'info',
        icon: 'refresh'
    }
})

const isBlockReward = computed<boolean>(() => {
    return props.transfer.transfer.subtype === TransferSubtype.BlockReward
})

const isIncoming = computed<boolean>(() => {
    return transferDirection.value.direction === TRANSFER_DIRECTION.FROM
})

const transferType = computed<{ [key: string]: string }>(() => {
    switch (props.transfer.transfer.subtype) {
        case TransferSubtype.BlockReward:
            return {
                text: 'block reward',
                color: 'success'
            }
        case TransferSubtype.UncleReward:
            return {
                text: 'uncle reward',
                color: 'success'
            }
        case TransferSubtype.Genesis:
            return {
                text: 'genesis reward',
                color: 'success'
            }
        case TransferSubtype.InternalTransaction:
            return {
                text: 'internal',
                color: 'purple'
            }
        case TransferSubtype.DaoHardFork:
            return {
                text: 'dao hard fork',
                color: 'purple'
            }
        default:
            return {
                text: 'transaction',
                color: 'purple'
            }
    }
})

const txAddress = computed<string>(() => {
    if (props.transfer.transfer.to === props.addressRef.toLowerCase()) {
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
