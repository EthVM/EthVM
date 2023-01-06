<template>
    <div>
        <!--
    =====================================================================================
      Tablet/ Desktop (SM - XL)
    =====================================================================================
    -->
        <app-table-row row-align="center" class="d-none d-sm-flex">
            <!-- Column 1: Tx Hash -->
            <v-col sm="3" :md="2">
                <app-transform-hash is-blue is-short :hash="props.transfer.transfer.transactionHash" :link="`/tx/${props.transfer.transfer.transactionHash}`" />
                <p class="text-info d-md-none">
                    {{ timeAgo(date) }}
                </p>
            </v-col>
            <!-- End Column 1 -->
            <!-- Column 2: From address -->
            <v-col sm="3" lg="2">
                <div class="d-flex align-center">
                    <app-address-blockie :address="props.transfer.transfer.from || ''" :size="8" class="mr-2" />
                    <app-transform-hash
                        is-blue
                        is-short
                        :hash="eth.toCheckSum(props.transfer.transfer.from)"
                        :link="`/address/${props.transfer.transfer.from}`"
                    />
                </div>
            </v-col>
            <!-- End Column 2 -->
            <!-- Column 3: Direction Arrow -->
            <v-col v-if="lgAndUp" md="1">
                <v-icon color="success">east</v-icon>
            </v-col>
            <!-- End Column 3 -->
            <!-- Column 4: To address -->
            <v-col sm="3" lg="2">
                <div class="d-flex align-center">
                    <app-address-blockie :address="props.transfer.transfer.to || ''" :size="8" class="mr-2" />
                    <app-transform-hash is-blue is-short :hash="eth.toCheckSum(props.transfer.transfer.to)" :link="`/address/${props.transfer.transfer.to}`" />
                </div>
            </v-col>
            <!-- End Column 4 -->
            <!-- Column 5: Quantity/ID -->
            <v-col :md="isERC721 ? 1 : 2" :lg="isERC721 ? 1 : 3">
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
            <v-col md="2" class="d-none d-md-block">
                {{ timeAgo(date) }}
            </v-col>
            <!-- End Column 6 -->
        </app-table-row>
        <app-table-row
            row-justify="space-between"
            class="d-sm-none"
            :color="visibleDetails.has(props.transfer.transfer.transactionHash) ? 'pillGrey' : 'transparent'"
            @click="toggleMoreDetails(props.transfer.transfer.transactionHash)"
        >
            <v-col cols="6" sm="5">
                <app-transform-hash is-blue is-short :hash="props.transfer.transfer.transactionHash" :link="`/tx/${props.transfer.transfer.transactionHash}`" />
                <p class="text-info">{{ timeAgo(date) }}</p>
            </v-col>
            <v-col cols="6" sm="3">
                <span>{{ transferValue.value }} {{ symbolFormatted }} </span>
            </v-col>
            <template #expandable>
                <v-col v-if="visibleDetails.has(props.transfer.transfer.transactionHash)">
                    <v-row justify="space-between" align="center" class="d-sm-none">
                        <v-col cols="5">
                            <div class="d-flex align-center">
                                <app-address-blockie :address="props.transfer.transfer.from || ''" :size="6" class="mr-2" />
                                <app-transform-hash
                                    is-blue
                                    is-short
                                    :hash="eth.toCheckSum(props.transfer.transfer.from)"
                                    :link="`/address/${props.transfer.transfer.from}`"
                                />
                            </div>
                        </v-col>
                        <v-icon color="success">east</v-icon>
                        <v-col cols="5">
                            <div class="d-flex align-center">
                                <app-address-blockie :address="props.transfer.transfer.to || ''" :size="6" class="mr-2" />
                                <app-transform-hash
                                    is-blue
                                    is-short
                                    :hash="eth.toCheckSum(props.transfer.transfer.to)"
                                    :link="`/address/${props.transfer.transfer.to}`"
                                />
                            </div>
                        </v-col>
                    </v-row>
                </v-col>
            </template>
        </app-table-row>
    </div>
</template>

<script setup lang="ts">
import AppTransformHash from '@core/components/AppTransformHash.vue'
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import AppTableRow from '@core/components/AppTableRow.vue'
import BigNumber from 'bignumber.js'
import {
    TokenTransferFragment as Erc20TokenTransferType,
    Erc721TransferFragment as Erc721TransferType
} from '@module/tokens/apollo/TokenDetailsTransfer/tokenTransfers.generated'
import BN from 'bignumber.js'
import configs from '@/configs'
import { reactive, computed, ref } from 'vue'
import { formatFloatingPointValue, FormattedNumber } from '@core/helper/number-format-helper'
import { useDisplay } from 'vuetify'
import { eth, timeAgo } from '@core/helper'

const TYPES = ['ERC20', 'ERC721']

const { lgAndUp } = useDisplay()

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
    return new BN(props.transfer['tokenId']).toString()
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

const visibleDetails = ref(new Set())
const toggleMoreDetails = (transfer: string): void => {
    if (visibleDetails.value.has(transfer)) {
        visibleDetails.value.delete(transfer)
    } else {
        visibleDetails.value.add(transfer)
    }
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
