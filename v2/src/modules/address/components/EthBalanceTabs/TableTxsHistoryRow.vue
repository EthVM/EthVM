<template>
    <app-table-row
        v-if="smAndDown"
        row-justify="space-between"
        @click="showMoreDetails = !showMoreDetails"
        :color="showMoreDetails ? 'pillGrey' : 'transparent'"
    >
        <v-col cols="6">
            <v-avatar :color="transferDirection.color" size="22">
                <v-icon size="13" color="white"> {{ transferDirection.icon }} </v-icon>
            </v-avatar>
            <span class="ml-2">
                {{ transferDirection.text }}
            </span>
        </v-col>
        <v-col cols="6" class="text-right">{{ txValue.value }} {{ currencyName }}</v-col>
        <v-col cols="6" class="text-info text-lowercase"> {{ timestamp }} {{ transferDirection.direction }} </v-col>
        <v-col cols="6">
            <div class="d-flex align-center justify-end">
                <app-address-blockie :address="txAddress || ''" :size="6" class="mr-2 mr-sm-2" />
                <app-transform-hash is-short is-blue :hash="eth.toCheckSum(txAddress)" :link="`/address/${txAddress}`" />
            </div>
        </v-col>
    </app-table-row>
    <app-table-row v-else row-align="center" @click="showMoreDetails = !showMoreDetails" :color="showMoreDetails ? 'pillGrey' : 'transparent'">
        <v-col :sm="mdAndDown ? 3 : 2">
            <div class="d-flex">
                <span style="width: 30px" class="d-inline-block">
                    <v-icon :color="statusIcon.color">{{ statusIcon.icon }}</v-icon>
                </span>
                <div class="ml-4">
                    {{ txValue.value }} {{ currencyName }}
                    <div class="text-lowercase text-info">
                        {{ timestamp }}
                        <span v-if="mdAndDown">{{ transferDirection.direction }}</span>
                    </div>
                </div>
            </div>
        </v-col>
        <v-col cols="1" lg="2">
            <app-chip :bg="transferDirection.color" :text="transferDirection.direction" />
        </v-col>
        <v-col md="3">
            <div class="d-flex align-center">
                <app-address-blockie :address="txAddress || ''" :size="8" class="mr-2 mr-sm-2" />
                <app-transform-hash is-short is-blue :hash="eth.toCheckSum(txAddress)" :link="`/address/${txAddress}`" />
            </div>
        </v-col>
        <v-col sm="2">
            <app-transform-hash is-short is-blue :hash="eth.toCheckSum(transfer.transfer.transactionHash)" :link="`/tx/${transfer.transfer.transactionHash}`" />
        </v-col>
        <v-col sm="3"> {{ totalBalanceChange.value }} {{ currencyName }} </v-col>
        <template #expandable>
            <v-row v-if="showMoreDetails" justify="space-between" class="my-4 flex-column-reverse flex-sm-row">
                <v-col cols="2" class="d-none d-md-block"></v-col>
                <v-col cols="12" sm="5" md="4">
                    <p class="font-weight-bold">Events</p>
                    <p class="my-5 text-info">
                        {{ txEvents }}
                    </p>
                </v-col>
                <v-spacer />
                <v-col cols="12" sm="7" md="4">
                    <p class="font-weight-bold">Balance Change Breakdown</p>
                    <v-row class="my-5" align="center">
                        <v-col cols="6" class="text-info">Transaction Value</v-col>
                        <span>{{ txValue.value }} {{ currencyName }}</span>
                    </v-row>
                    <v-row v-if="!isIncoming" class="my-5" align="center">
                        <v-col cols="6" class="text-info">TX Fee Paid</v-col>
                        <span class="text-error">{{ txFee.value }} {{ currencyName }}</span>
                    </v-row>
                    <v-row v-if="internalTransferValue" class="my-5" align="center">
                        <v-col cols="6" class="text-info">Internal Transfer Value</v-col>
                        <span class="text-success">{{ internalTransferValue.value }} {{ currencyName }}</span>
                    </v-row>
                    <v-divider class="mx-n5 mx-sm-0" />
                    <v-row class="my-5" align="center">
                        <v-col cols="6" class="text-info">Total Balance Change</v-col>
                        <span :class="totalBalanceChange.color">{{ totalBalanceChange.value }} {{ currencyName }}</span>
                    </v-row>
                    <v-row class="my-5" align="center">
                        <v-col cols="6" class="text-info">Balance Before</v-col>
                        <span>{{ balanceBeforeFormatted.value }} {{ currencyName }}</span>
                    </v-row>
                    <v-row class="my-5" align="center">
                        <v-col cols="6" class="text-info">Balance After</v-col>
                        <span>{{ balanceAfterFormatted.value }} {{ currencyName }}</span>
                    </v-row>
                </v-col>
                <v-col cols="1" class="d-none d-md-block"></v-col>
            </v-row>
        </template>
    </app-table-row>
</template>

<script setup lang="ts">
import AppAddressBlockie from '@/core/components/AppAddressBlockie.vue'
import AppTransformHash from '@/core/components/AppTransformHash.vue'
import AppChip from '@core/components/AppChip.vue'
import AppTableRow from '@core/components/AppTableRow.vue'
import { timeAgo, eth } from '@core/helper'
import { TxsTransfersFragment, useGetEthTransfersByHashQuery } from '@module/address/apollo/EthTransfers/transfersHistory.generated'
import { computed, ref } from 'vue'
import { formatNonVariableEthValue, FormattedNumber } from '@core/helper/number-format-helper'
import BN from 'bignumber.js'
import { useDisplay } from 'vuetify'
import { TransferSubtype } from '@/apollo/types'
import { useNetwork } from '@core/composables/Network/useNetwork'

const { smAndDown, mdAndDown } = useDisplay()
const { currencyName } = useNetwork()
interface ComponentProps {
    transfer: TxsTransfersFragment
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
        color: 'error'
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
        color: 'orange',
        icon: 'refresh'
    }
})

const isIncoming = computed<boolean>(() => {
    return transferDirection.value.direction === TRANSFER_DIRECTION.FROM
})

const balanceBefore = computed<BN>(() => {
    if (props.transfer.transfer.to === props.addressRef.toLowerCase()) {
        // Use the stateDiff of the destination address
        return new BN(props.transfer?.transactionStateDiff?.to.before || 0)
    }
    // use from address
    return new BN(props.transfer?.transactionStateDiff?.from.before || 0)
})

const balanceBeforeFormatted = computed<FormattedNumber>(() => {
    if (props.transfer.transfer.to === props.addressRef.toLowerCase()) {
        // Use the stateDiff of the destination address
        return formatNonVariableEthValue(balanceBefore.value)
    }
    // use from address
    return formatNonVariableEthValue(balanceBefore.value)
})

const balanceAfter = computed<BN>(() => {
    if (props.transfer.transfer.to === props.addressRef.toLowerCase()) {
        // use to address
        return new BN(props.transfer?.transactionStateDiff?.to.after || 0)
    }
    // use from address
    return new BN(props.transfer?.transactionStateDiff?.from.after || 0)
})

const balanceAfterFormatted = computed<FormattedNumber>(() => {
    if (props.transfer.transfer.to === props.addressRef.toLowerCase()) {
        // use to address
        return formatNonVariableEthValue(balanceAfter.value)
    }
    // use from address
    return formatNonVariableEthValue(balanceAfter.value)
})

const totalBalanceChange = computed<{ [key: string]: string | number }>(() => {
    const actualBalanceChange = balanceAfter.value.minus(balanceBefore.value)
    const isBalanceNegative = actualBalanceChange.isNegative()
    const balanceChange = formatNonVariableEthValue(actualBalanceChange.absoluteValue())
    return {
        value: isBalanceNegative ? `-${balanceChange.value}` : balanceChange.value,
        color: isBalanceNegative ? 'text-error' : 'text-success'
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

const internalTransferValue = computed<FormattedNumber | false>(() => {
    const txValue = new BN(props.transfer.value)
    const txFee = new BN(props.transfer.transfer.txFee)
    const totalTxsAmount = isIncoming.value ? txValue : txValue.plus(txFee)
    const balanceChange = balanceAfter.value.minus(balanceBefore.value).absoluteValue()
    if (!totalTxsAmount.isEqualTo(balanceChange)) {
        const internalTransfer = balanceChange.minus(totalTxsAmount).absoluteValue()
        return formatNonVariableEthValue(internalTransfer)
    }
    return false
})

// Load ethTransfers by hash to see if an internal transaction exists
const { result: ethTransfers } = useGetEthTransfersByHashQuery(
    () => ({
        owner: props.addressRef,
        _limit: 1,
        hash: props.transfer.transfer.transactionHash
    }),
    () => ({
        enabled: showMoreDetails.value
    })
)

const hasInternalTransaction = computed<boolean>(() => {
    return ethTransfers.value?.getEthTransfersByHash.transfers[0]?.transfer.subtype === TransferSubtype.InternalTransaction
})

const txEvents = computed<string>(() => {
    const events = []
    events.push(`${currencyName.value} Transfers`)
    if (hasInternalTransaction.value) {
        events.push('Internal Transaction')
    }
    return events.join(', ')
})
</script>
