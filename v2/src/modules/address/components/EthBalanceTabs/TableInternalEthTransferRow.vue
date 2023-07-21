<template>
    <div>
        <app-table-row v-if="smAndDown" @click="toggleMoreDetails" :color="showMoreDetails ? 'pillGrey' : 'transparent'">
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
            <template #expandable>
                <v-col cols="12" v-if="showMoreDetails">
                    <v-divider class="mx-n6 mb-3" />
                    <div class="mb-4 d-flex justify-space-between">
                        <span class="text-info mr-2">{{ $t('txs.balanceBefore') }}:</span>
                        <span>{{ balanceBefore.value }} {{ currencyName }}</span>
                    </div>
                    <div class="mb-4 d-flex justify-space-between">
                        <span class="text-info mr-2">{{ $t('txs.balanceAfter') }}:</span>
                        <span>{{ balanceAfter.value }} {{ currencyName }}</span>
                    </div>
                    <div class="d-flex justify-space-between">
                        <span class="text-info mr-2">{{ $t('common.hash') }}:</span>
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
        </app-table-row>
        <app-table-row v-else row-align="center">
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
            <v-col sm="2"> {{ balanceBefore.value }} {{ currencyName }} </v-col>
            <v-col sm="2" lg="3"> {{ balanceAfter.value }} {{ currencyName }} </v-col>
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
import { formatNonVariableEthValue, FormattedNumber } from '@core/helper/number-format-helper'
import BN from 'bignumber.js'
import { useDisplay } from 'vuetify'
import { useNetwork } from '@core/composables/Network/useNetwork'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { currencyName } = useNetwork()
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

const transferDirection = computed<{ [key: string]: string }>(() => {
    // If to and from address is the same, then transfer is self
    if (props.transfer.transfer.to === props.addressRef.toLowerCase() && props.transfer.transfer.from === props.addressRef.toLowerCase()) {
        return {
            direction: t('txs.status.self'),
            text: t('txs.status.selfSent'),
            color: 'info',
            icon: 'refresh'
        }
    }
    if (props.transfer.transfer.to === props.addressRef.toLowerCase()) {
        return {
            direction: t('common.from'),
            text: t('txs.status.recieve'),
            color: 'success',
            icon: 'south_east'
        }
    } else if (props.transfer.transfer.from === props.addressRef.toLowerCase()) {
        return {
            direction: t('common.to'),
            text: t('txs.status.sent'),
            color: 'warning',
            icon: 'north_west'
        }
    }
    return {
        direction: t('txs.status.self'),
        text: t('txs.status.selfSent'),
        color: 'info',
        icon: 'refresh'
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
    if (props.transfer.transfer.to === props.addressRef.toLowerCase()) {
        // Use the address of the destination address
        return props.transfer.transfer.from
    }
    // use from address
    return props.transfer.transfer.to
})

const timestamp = computed<string>(() => {
    const date = new Date(props.transfer.transfer.timestamp * 1e3)
    return timeAgo(date)
})

const txValue = computed<FormattedNumber>(() => {
    return formatNonVariableEthValue(new BN(props.transfer.value))
})

const toggleMoreDetails = (): void => {
    showMoreDetails.value = !showMoreDetails.value
}
</script>
