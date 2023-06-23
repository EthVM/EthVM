<template>
    <app-table-row row-align="center" :link="mdAndDown" @click="openMoreInfo" :color="showMoreDetails && mdAndDown ? 'pillGrey' : 'transparent'">
        <!--
            Status
        -->
        <v-col cols="6" sm="4" md="3" lg="2" order="1">
            <v-avatar :color="transferStatus.color" size="22">
                <v-icon size="13" color="white"> {{ transferStatus.icon }} </v-icon>
            </v-avatar>
            <span class="ml-2">
                {{ transferStatus.text }}
            </span>
            <p class="text-info text-lowercase mt-1">
                {{ timestamp }}
                <span
                    v-if="
                        transferType.type === TransferSubtype.Withdrawl ||
                        transferType.type === TransferSubtype.Transaction ||
                        transferType.type === TransferSubtype.InternalTransaction
                    "
                    >{{ transferStatus.direction }}</span
                >
            </p>
        </v-col>
        <!--
            Address/ Validator
            Value on XS ONLY
            Hidden on XS
        -->
        <v-col cols="6" sm="5" md="3" lg="2" order="2" :class="{ 'mobile-value': xs }">
            <p v-if="xs" class="text-right text-sm-left">{{ valueSign }} {{ txValue.value }} {{ txValue.unit }}</p>
            <p v-if="transferType.type === TransferSubtype.Withdrawl" class="text-right text-sm-left mt-2 mt-sm-0">#{{ getValidator() }}</p>
            <div
                v-if="transferType.type === TransferSubtype.Transaction || transferType.type === TransferSubtype.InternalTransaction"
                class="d-flex align-center justify-end justify-sm-start"
            >
                <app-address-blockie :address="txAddress || ''" :size="6" class="mr-2 mr-sm-2" />
                <app-transform-hash is-short is-blue :hash="eth.toCheckSum(txAddress)" :link="`/address/${txAddress}`" />
            </div>
        </v-col>
        <!--
           Value
        -->
        <v-col v-if="!xs" sm="3" lg="2" order-sm="last" order-lg="3">
            <p class="text-right text-sm-left">{{ valueSign }} {{ txValue.value }} {{ txValue.unit }}</p>
        </v-col>
        <!--
           Fee
        -->
        <v-col v-if="!mdAndDown" cols="6" sm="3" lg="2" order="4">
            <p v-if="isOutgoing && transferType.type === TransferSubtype.Transaction">- {{ txFee.value }} {{ txFee.unit }}</p>
        </v-col>
        <!--
          Type
        -->
        <v-col v-if="!mdAndDown" cols="6" sm="3" lg="2" order="5">
            <app-chip bg="switchTrack" :text="transferType.text.toUpperCase()" size="x-small" class="tiny-text" style="min-width: 131px" />
        </v-col>
        <!--
          Block / Hash
        -->
        <v-col v-if="!smAndDown" cols="6" md="3" lg="2" order-md="3" order-lg="6">
            <router-link v-if="showBlock" :to="`/block/number/${props.transfer.transfer.block}`" class="text-secondary">
                {{ formatNumber(props.transfer.transfer.block) }}
            </router-link>
            <app-transform-hash
                v-else
                is-short
                is-blue
                :hash="eth.toCheckSum(transfer.transfer.transactionHash)"
                :link="`/tx/${transfer.transfer.transactionHash}`"
            />
        </v-col>
        <template #expandable>
            <v-col cols="12" v-if="showMoreDetails && mdAndDown" order="last">
                <v-row>
                    <v-spacer />
                    <!--
                        Type
                    -->
                    <v-col cols="6" sm="4" md="3">
                        <p v-if="!xs" class="text-info mb-2">Type</p>
                        <app-chip bg="switchTrack" :text="transferType.text.toUpperCase()" size="x-small" class="tiny-text" style="min-width: 131px" />
                    </v-col>
                    <!--
                        Block/Hash
                    -->
                    <v-col cols="6" sm="5" md="3" class="d-flex justify-end justify-sm-start flex-sm-column d-md-none">
                        <p v-if="!xs && showBlock" class="text-info mb-2">Block</p>
                        <p v-if="!xs && !showBlock" class="text-info mb-2">Hash</p>
                        <router-link v-if="showBlock" :to="`/block/number/${props.transfer.transfer.block}`" class="text-secondary">
                            {{ formatNumber(props.transfer.transfer.block) }}
                        </router-link>
                        <app-transform-hash
                            v-else
                            is-short
                            is-blue
                            :hash="eth.toCheckSum(transfer.transfer.transactionHash)"
                            :link="`/tx/${transfer.transfer.transactionHash}`"
                        />
                    </v-col>
                    <!--
                        Fee
                    -->
                    <v-col cols="12" sm="3">
                        <div v-if="isOutgoing && transferType.type === TransferSubtype.Transaction" class="d-flex justify-space-between flex-sm-column">
                            <p class="text-info mb-sm-2">Fee Paid</p>
                            <p class="text-right text-sm-left">- {{ txFee.value }} {{ txFee.unit }}</p>
                        </div>
                    </v-col>
                </v-row>
            </v-col>
        </template>
    </app-table-row>
</template>

<script setup lang="ts">
import AppAddressBlockie from '@/core/components/AppAddressBlockie.vue'
import AppTransformHash from '@/core/components/AppTransformHash.vue'
import AppChip from '@core/components/AppChip.vue'
import AppTableRow from '@core/components/AppTableRow.vue'
import { eth, timeAgo } from '@core/helper'
import { AllEthTransfersFragment } from '@module/address/apollo/EthTransfers/allTransfers.generated'
import { computed, ref } from 'vue'
import { formatNonVariableEthValue, FormattedNumber, formatNumber } from '@core/helper/number-format-helper'
import BN from 'bignumber.js'
import { useDisplay } from 'vuetify'
import { TransferSubtype } from '@/apollo/types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { smAndDown, xs, mdAndDown } = useDisplay()

interface ComponentProps {
    transfer: AllEthTransfersFragment
    addressRef: string
}
const props = defineProps<ComponentProps>()

const showMoreDetails = ref(false)

enum TRANSFER_DIRECTION {
    FROM = 'From',
    TO = 'To',
    SELF = 'To'
}

interface Status {
    direction: TRANSFER_DIRECTION
    text: string
    color: string
    icon: string
}

const transferStatus = computed<Status>(() => {
    const isFailed = props.transfer.transfer.status !== true
    // If to and from address is the same, then transfer is self
    if (props.transfer.transfer.to === props.addressRef.toLowerCase() && props.transfer.transfer.from === props.addressRef.toLowerCase()) {
        return {
            direction: TRANSFER_DIRECTION.SELF,
            text: isFailed ? t('txs.status.failSend') : t('txs.status.selfSent'),
            color: isFailed ? 'error' : 'warning',
            icon: isFailed ? 'close' : 'north_west'
        }
    }
    if (props.transfer.transfer.to === props.addressRef.toLowerCase()) {
        return {
            direction: TRANSFER_DIRECTION.FROM,
            text: isFailed ? t('txs.status.failRecieve') : t('txs.status.recieve'),
            color: isFailed ? 'error' : 'success',
            icon: isFailed ? 'close' : 'south_east'
        }
    } else if (props.transfer.transfer.from === props.addressRef.toLowerCase()) {
        return {
            direction: TRANSFER_DIRECTION.TO,
            text: isFailed ? t('txs.status.failSend') : t('txs.status.sent'),
            color: isFailed ? 'error' : 'warning',
            icon: isFailed ? 'close' : 'north_west'
        }
    }
    return {
        direction: TRANSFER_DIRECTION.SELF,
        text: t('txs.status.selfSent'),
        color: 'info',
        icon: 'refresh'
    }
})

const openMoreInfo = () => {
    if (mdAndDown.value) {
        showMoreDetails.value = !showMoreDetails.value
    }
}

const timestamp = computed<string>(() => {
    const date = new Date(props.transfer.transfer.timestamp * 1e3)
    return timeAgo(date)
})

interface Type {
    text: string
    type: TransferSubtype
}

const transferType = computed<Type>(() => {
    switch (props.transfer.transfer.subtype) {
        case TransferSubtype.BlockReward:
            return {
                text: t('block.blockReward'),
                type: TransferSubtype.BlockReward
            }
        case TransferSubtype.UncleReward:
            return {
                text: t('block. uncleReward'),
                type: TransferSubtype.UncleReward
            }
        case TransferSubtype.Genesis:
            return {
                text: t('txs.type.genesis'),
                type: TransferSubtype.Genesis
            }
        case TransferSubtype.InternalTransaction:
            return {
                text: t('txs.type.internal'),
                type: TransferSubtype.InternalTransaction
            }
        case TransferSubtype.DaoHardFork:
            return {
                text: t('txs.type.dao'),
                type: TransferSubtype.DaoHardFork
            }
        case TransferSubtype.Withdrawl:
            return {
                text: t('txs.type.withdrawal'),
                type: TransferSubtype.Withdrawl
            }
        default:
            return {
                text: t('txs.name', 1),
                type: TransferSubtype.Transaction
            }
    }
})

const getValidator = (): string => {
    return formatNumber(new BN(props.transfer.transfer.validatorIndex || 0).toNumber())
}

const txAddress = computed<string>(() => {
    if (props.transfer.transfer.to === props.addressRef.toLowerCase()) {
        // Use the address of the destination address
        return props.transfer.transfer.from
    }
    // use from address
    return props.transfer.transfer.to
})

const showBlock = computed<boolean>(() => {
    return (
        props.transfer.transfer.subtype === TransferSubtype.Withdrawl ||
        props.transfer.transfer.subtype === TransferSubtype.BlockReward ||
        props.transfer.transfer.subtype === TransferSubtype.UncleReward ||
        props.transfer.transfer.subtype === TransferSubtype.DaoHardFork ||
        props.transfer.transfer.subtype === TransferSubtype.Genesis
    )
})
const transferDirection = computed<TRANSFER_DIRECTION>(() => {
    // If to and from address is the same, then transfer is self
    if (props.transfer.transfer.from === props.addressRef.toLowerCase()) {
        return TRANSFER_DIRECTION.TO
    }
    return TRANSFER_DIRECTION.FROM
})

const valueSign = computed<string>(() => {
    return isOutgoing.value ? '-' : '+'
})
const txValue = computed<FormattedNumber>(() => {
    return formatNonVariableEthValue(new BN(props.transfer.value))
})

const txFee = computed<FormattedNumber>(() => {
    return formatNonVariableEthValue(new BN(props.transfer.transfer.txFee))
})
const isOutgoing = computed<boolean>(() => {
    return transferDirection.value === TRANSFER_DIRECTION.TO
})
</script>

<style lang="scss">
.mobile-value {
    min-height: 56px;
}
</style>
