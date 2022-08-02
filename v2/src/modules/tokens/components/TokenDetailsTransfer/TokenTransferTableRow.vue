<template>
    <div pa-0 ma-0>
        <!--
    =====================================================================================
      Tablet/ Desktop (SM - XL)
    =====================================================================================
    -->
        <v-col v-if="!smAndDown">
            <v-row grid-list-xs row wrap align="center" justify="start" class="fill-height pl-3 pr-2 pt-2 pb-1 text-subtitle-2 font-weight-regular">
                <!-- Column 1: Tx Info -->
                <v-col :class="[sm || xs ? 'pr-3' : 'pr-5']" :md="isERC721 ? 6 : 7">
                    <v-row align="center" justify="start" class="pa-2 flex-nowrap">
                        <p class="info--text tx-hash">Tx #:</p>
                        <app-transform-hash :hash="props.transfer.transfer.transactionHash" :link="`/tx/${props.transfer.transfer.transactionHash}`" />
                    </v-row>
                    <v-row align="center" justify="space-around" class="fill-height pa-2 flex-nowrap">
                        <p class="info--text mr-1">From:</p>
                        <app-transform-hash
                            :hash="eth.toCheckSum(props.transfer.transfer.from)"
                            :link="`/address/${props.transfer.transfer.from}`"
                            :italic="true"
                        />
                        <v-icon class="primary--text pl-2 pr-2" small>east</v-icon>
                        <p v-if="props.transfer.transfer.contract" class="info--text mr-1">Contract:</p>
                        <p v-else class="info--text mr-1">To:</p>
                        <app-transform-hash
                            v-if="props.transfer.transfer.contract"
                            :hash="eth.toCheckSum(props.transfer.transfer.address)"
                            :link="`/address/${props.transfer.transfer.address}`"
                            :italic="true"
                        />
                        <app-transform-hash
                            v-else
                            :hash="eth.toCheckSum(props.transfer.transfer.to)"
                            :link="`/address/${props.transfer.transfer.to}`"
                            :italic="true"
                        />
                    </v-row>
                </v-col>
                <!-- End Column 1 -->

                <!-- Column 2: Age -->
                <v-col md="2">
                    {{ timeAgo(date) }}
                </v-col>
                <!-- End Column 2 -->

                <!-- Column 3: Quantity/ID -->
                <v-col md="2">
                    <p class="text-truncate">
                        <span v-if="isERC721">{{ getTokenID }}</span>
                        <span v-else>{{ transferValue.value }} {{ symbolFormatted }} </span>
                        <app-tooltip v-if="transferValueTooltip && !isERC721" :text="transferValueTooltip" />
                    </p>
                </v-col>
                <!-- End Column 3 -->

                <v-col v-if="isERC721" md="2">
                    <v-img :src="image" align="center" justify="end" max-height="50px" max-width="50px" contain @error="onImageLoadFail" />
                </v-col>
            </v-row>
            <v-divider class="mb-2 mt-2" />
        </v-col>
    </div>
</template>

<script setup lang="ts">
import AppTransformHash from '@core/components/AppTransformHash.vue'
import BigNumber from 'bignumber.js'
import AppTooltip from '@core/components/AppTooltip.vue'
import {
    TokenTransferFragment as Erc20TokenTransferType,
    Erc721TransferFragment as Erc721TransferType
} from '@module/tokens/apollo/TokenDetailsTransfer/tokenTransfers.generated'
import BN from 'bignumber.js'
import configs from '@/configs'
import { reactive, computed } from 'vue'
import { formatFloatingPointValue, FormattedNumber } from '@core/helper/number-format-helper'
import { useDisplay } from 'vuetify'
import { eth, timeAgo } from '@core/helper'
const TYPES = ['ERC20', 'ERC721']

const { sm, xs, smAndDown } = useDisplay()

interface PropType {
    transfer: Erc721TransferType | Erc20TokenTransferType
    decimals?: number
    symbol?: string
    transferType: string
}

const props = defineProps<PropType>()

const state = reactive({
    imageExists: true
})

/*
===================================================================================
  Computed
===================================================================================
*/
const image = computed<string>(() => {
    if (props.transfer && props.transfer['contract'] && state.imageExists) {
        return `${configs.OPENSEA}/getImage?contract=${props.transfer['contract']}&tokenId=${getTokenID.value}`
    }
    return require('@/assets/icon-token.png')
})

const transferValue = computed<FormattedNumber>(() => {
    let n = new BigNumber(props.transfer['value']) || new BigNumber(0)

    // Must be a token transfer
    if (props.decimals) {
        n = n.div(new BigNumber(10).pow(props.decimals))
    }
    return formatFloatingPointValue(n)
})

const date = computed<Date>(() => {
    return new Date(props.transfer.transfer.timestamp * 1e3)
})

const symbolFormatted = computed<string | undefined>(() => {
    return props.symbol ? props.symbol.toUpperCase() : undefined
})

const transferValueTooltip = computed<string | undefined>(() => {
    const { tooltipText } = transferValue.value
    if (!tooltipText) {
        return undefined
    }
    return `${tooltipText} ${symbolFormatted.value}`
})

const isERC721 = computed<boolean>(() => {
    return props.transferType === TYPES[1]
})

const getTokenID = computed<string>(() => {
    return new BN(props.transfer['token']).toString()
})

/*
    ===================================================================================
     Methods
    ===================================================================================
    */
/**
 * Sets image exists to false
 */
const onImageLoadFail = (): void => {
    state.imageExists = false
}
</script>
<style scoped lang="css">
.table-row-mobile {
    border: 1px solid #b4bfd2;
}

.tx-hash {
    min-width: 3em;
}
</style>
