<template>
    <div>
        <!--
    =====================================================================================
      Tablet/ Desktop (SM - XL)
    =====================================================================================
    -->
        <template v-if="!smAndDown">
            <v-row class="my-5 px-0 text-subtitle-2 font-weight-regular" align="center">
                <!-- Column 1: Tx Hash -->
                <v-col :md="2">
                    <app-transform-hash
                        is-blue
                        start="5"
                        end="5"
                        :hash="props.transfer.transfer.transactionHash"
                        :link="`/tx/${props.transfer.transfer.transactionHash}`"
                    />
                </v-col>
                <!-- End Column 1 -->
                <!-- Column 2: From address -->
                <v-col md="2">
                    <div class="d-flex align-center">
                        <app-address-blockie :address="eth.toCheckSum(props.transfer.transfer.from) || ''" :size="8" class="mr-2" />
                        <app-transform-hash
                            is-blue
                            start="5"
                            end="5"
                            :hash="eth.toCheckSum(props.transfer.transfer.from)"
                            :link="`/address/${props.transfer.transfer.from}`"
                        />
                    </div>
                </v-col>
                <!-- End Column 2 -->
                <!-- Column 3: Direction Arrow -->
                <v-col md="1">
                    <v-icon color="success">east</v-icon>
                </v-col>
                <!-- End Column 3 -->
                <!-- Column 4: To address -->
                <v-col md="2">
                    <div class="d-flex align-center">
                        <app-address-blockie :address="eth.toCheckSum(props.transfer.transfer.to) || ''" :size="8" class="mr-2" />
                        <app-transform-hash
                            is-blue
                            start="5"
                            end="5"
                            :hash="eth.toCheckSum(props.transfer.transfer.to)"
                            :link="`/address/${props.transfer.transfer.to}`"
                        />
                    </div>
                </v-col>
                <!-- End Column 4 -->
                <!-- Column 5: Quantity/ID -->
                <v-col :md="isERC721 ? 1 : 3">
                    <p class="text-truncate">
                        <span v-if="isERC721">{{ getTokenID }}</span>
                        <span v-else>{{ transferValue.value }} {{ symbolFormatted }} </span>
                    </p>
                </v-col>
                <!-- End Column 5 -->
                <!-- Column 6: ERC721 Image -->
                <v-col v-if="isERC721" md="2">
                    <v-img :src="image" align="center" justify="end" max-height="50px" max-width="50px" contain @error="onImageLoadFail" />
                </v-col>
                <!-- End Column 6 -->
                <!-- Column 6: Age -->
                <v-col md="2">
                    {{ timeAgo(date) }}
                </v-col>
                <!-- End Column 6 -->
            </v-row>
        </template>
    </div>
</template>

<script setup lang="ts">
import AppTransformHash from '@core/components/AppTransformHash.vue'
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import BigNumber from 'bignumber.js'
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

const { smAndDown } = useDisplay()

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
