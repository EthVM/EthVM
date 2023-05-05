<template>
    <app-table-row row-align="center" row-justify="start" @click="toggleMoreDetails" :link="xs" :color="xs && showMoreDetails ? 'pillGrey' : 'transparent'">
        <v-col cols="6" sm="5" md="3">
            <div class="d-flex justify-start align-center">
                <app-token-icon :token-icon="tokenImg" img-size="32px" class="mr-2" />
                <div>
                    <p class="text-ellipses">
                        <span v-if="sm" class="mr-2 text-ellipses">{{ valueFormatted.value }}</span
                        >{{ tokenSymbol }} <span v-if="sm"><app-tooltip :text="valueFormatted.tooltipText"></app-tooltip></span>
                    </p>
                    <p v-if="xs" class="text-ellipses text-info">{{ tokenName }}</p>
                </div>
            </div>
        </v-col>
        <v-col cols="6" sm="3" md="4" class="d-flex d-sm-none d-md-flex justify-end justify-md-start">
            <p class="text-right text-sm-left text-ellipses">
                {{ valueFormatted.value }} <span><app-tooltip :text="valueFormatted.tooltipText"></app-tooltip></span>
            </p>
        </v-col>
        <template #expandable>
            <v-col v-if="xs ? showMoreDetails : true" cols="12" sm="7" md="5" lg="4">
                <div class="d-flex align-center justify-space-between justify-sm-end justify-md-space-between">
                    <div class="d-flex justify-start align-center">
                        <app-address-blockie :address="props.transfer.from" :size="8" class="mr-2 mr-md-3" />
                        <app-transform-hash is-blue is-short :hash="eth.toCheckSum(props.transfer.from)" :link="`/address/${props.transfer.from}`" />
                    </div>
                    <v-icon color="success" class="mx-2 mx-md-5" :size="20">east</v-icon>
                    <div class="d-flex justify-start align-center">
                        <app-address-blockie :address="props.transfer.to" :size="8" class="mr-2 mr-md-3" />
                        <app-transform-hash is-blue is-short :hash="eth.toCheckSum(props.transfer.to)" :link="`/address/${props.transfer.from}`" />
                    </div>
                </div>
            </v-col>
        </template>
    </app-table-row>
</template>

<script setup lang="ts">
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import AppTransformHash from '@core/components/AppTransformHash.vue'
import AppTableRow from '@core/components/AppTableRow.vue'
import AppTokenIcon from '@core/components/AppTokenIcon.vue'
import AppTooltip from '@/core/components/AppTooltip.vue'
import { computed, PropType, ref } from 'vue'
import { Action } from '../types'
import { eth } from '@core/helper'
import { TransferType } from '@/apollo/types'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { useNetwork } from '@/core/composables/Network/useNetwork'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { formatNonVariableEthValue, FormattedNumber } from '@/core/helper/number-format-helper'
import BigNumber from 'bignumber.js'
const { xs, sm } = useDisplay()
const props = defineProps({
    transfer: {
        type: Object as PropType<Action>,
        required: true
    }
})

const valueFormatted = computed<FormattedNumber>(() => {
    // if (props.transfer.type === TransferType.Eth) {
    return formatNonVariableEthValue(new BigNumber(props.transfer.value))
    // }
})

const { loading: loadingMarketInfo, ethMarketInfo } = useCoinData()
const { currencyName, currencyNameLong } = useNetwork()

const tokenImg = computed<string | undefined>(() => {
    if (!loadingMarketInfo.value) {
        if (props.transfer.type === TransferType.Eth) {
            return ethMarketInfo.value?.image
        }
    }
    return undefined
})

const tokenSymbol = computed<string>(() => {
    if (props.transfer.type === TransferType.Eth) {
        return currencyName.value.toUpperCase()
    }
    return 'NO NAME'
})

const tokenName = computed<string>(() => {
    if (props.transfer.type === TransferType.Eth) {
        return currencyNameLong.value
    }
    return 'NO NAME'
})

const showMoreDetails = ref(false)

const toggleMoreDetails = (): void => {
    showMoreDetails.value = !showMoreDetails.value
}
</script>
