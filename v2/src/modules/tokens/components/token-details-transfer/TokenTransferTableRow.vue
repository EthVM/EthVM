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
            <v-col :md="isNFT ? 1 : 2" :lg="isNFT ? 1 : 3">
                <p class="text-truncate">
                    <span v-if="isNFT">{{ getTokenID }}</span>
                    <span v-else>{{ transferValue.value }} {{ symbolFormatted }} </span>
                </p>
            </v-col>
            <!-- End Column 5 -->
            <!-- Column 6: ERC721 Image -->
            <v-col v-if="isNFT && tokenMeta" md="2">
                <token-nft-img :loading="false" :nft="tokenMeta" height="40" width="40" class="rounded-md"></token-nft-img>
            </v-col>
            <!-- End Column 6 -->
            <!-- Column 6: Age -->
            <v-col md="2" class="d-none d-md-block text-info">
                {{ timeAgo(date) }}
            </v-col>
            <!-- End Column 6 -->
        </app-table-row>
        <app-table-row
            row-justify="space-between"
            class="d-sm-none"
            :color="visibleDetails.has(props.transfer.transfer.transactionHash) ? 'lightGrey' : 'transparent'"
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
    TokenTransferFragment,
    Erc721TransferFragment,
    Erc1155TokenTransferFragment
} from '@module/tokens/apollo/token-details-transfer/tokenTransfers.generated'
import BN from 'bignumber.js'
import { computed, ref } from 'vue'
import { formatFloatingPointValue, FormattedNumber } from '@core/helper/number-format-helper'
import { useDisplay } from 'vuetify'
import { eth, timeAgo } from '@core/helper'
import { TransferType } from '@/apollo/types'
import { NftMetaFragment } from '@core/composables/NftMeta/nftMeta.generated'
import TokenNftImg from '@module/tokens/components/token-nft/TokenNftImg.vue'
import { NFTDetails } from '@module/tokens/components/token-nft/propModel'
import Web3Utils from 'web3-utils'

const { lgAndUp } = useDisplay()

interface PropType {
    transfer: TokenTransferFragment | Erc721TransferFragment | Erc1155TokenTransferFragment
    decimals?: number
    symbol?: string
    transferType: string
    nftMeta?: NftMetaFragment
}

const props = defineProps<PropType>()

/*
===================================================================================
  Computed
===================================================================================
*/

const tokenMeta = computed<NFTDetails | undefined>(() => {
    if (props.transfer.__typename === 'ERC1155Transfer' || props.transfer.__typename === 'ERC721Transfer') {
        return {
            type: props.transfer.transfer.type,
            contract: props.transfer.contract,
            id: Web3Utils.hexToNumberString(props.transfer.tokenId),
            meta: props.nftMeta
        }
    }
    return undefined
})

const transferValue = computed<FormattedNumber>(() => {
    let n: BigNumber
    if (props.transfer.__typename === 'ERC20Transfer') {
        n = new BigNumber(props.transfer.value)
        // Must be a token transfer
        if (props.decimals) {
            n = n.div(new BigNumber(10).pow(props.decimals))
        }
    } else {
        n = new BigNumber(0)
    }

    return formatFloatingPointValue(n)
})

const date = computed<Date>(() => {
    return new Date(props.transfer.transfer.timestamp * 1e3)
})

const symbolFormatted = computed<string | undefined>(() => {
    return props.symbol ? props.symbol.toUpperCase() : undefined
})

const isNFT = computed<boolean>(() => {
    return props.transferType !== TransferType.Erc20
})

const getTokenID = computed<string>(() => {
    if (props.transfer.__typename === 'ERC1155Transfer' || props.transfer.__typename === 'ERC721Transfer') {
        return new BN(props.transfer.tokenId).toString()
    }
    return ''
})

/*
    ===================================================================================
     Methods
    ===================================================================================
    */

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
