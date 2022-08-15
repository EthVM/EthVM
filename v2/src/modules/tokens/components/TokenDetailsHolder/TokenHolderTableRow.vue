<template>
    <div pa-0 ma-0>
        <!--
    =====================================================================================
      Tablet/ Desktop (SM - XL)
    =====================================================================================
    -->
        <v-col v-if="!smAndDown">
            <v-row grid-list-xs row wrap align="center" justify="start" class="fill-height pl-3 pr-2 pt-2 pb-1 text-subtitle-2 font-weight-regular">
                <!-- Column 1: Holders Address -->
                <v-col sm="6" class="pr-4">
                    <app-transform-hash :hash="eth.toCheckSum(props.holder.owner)" :link="holderLink" />
                </v-col>
                <!-- End Column 1 -->

                <!-- Column 2: Balance -->
                <v-col sm="1" md="4">
                    <p class="mb-0 ml-2">
                        {{ isERC721 ? getTokenID : balance.value }}
                        <app-tooltip v-if="balance.tooltipText" :text="balance.tooltipText" />
                    </p>
                </v-col>
                <!-- End Column 2 -->

                <!-- Column 3: Share (ERC20) -->
                <v-col v-if="!isERC721" sm="3" md="2">
                    <p class="mb-0 ml-2">
                        {{ share.value }}%
                        <app-tooltip v-if="share.tooltipText && !isERC721" :text="share.tooltipText" />
                    </p>
                </v-col>
                <!-- End Column 3 -->

                <!-- Column 3: Token Image (ERC721) -->
                <v-col v-if="isERC721" sm="3" md="2">
                    <v-img :src="image" align="center" justify="end" max-height="50px" max-width="50px" contain @error="onImageLoadFail" />
                </v-col>
                <!-- End Column 3 -->
            </v-row>
            <v-divider class="mb-2 mt-2" />
        </v-col>
    </div>
</template>

<script setup lang="ts">
import AppTransformHash from '@core/components/AppTransformHash.vue'
import BigNumber from 'bignumber.js'
import AppTooltip from '@core/components/AppTooltip.vue'
import BN from 'bignumber.js'
import configs from '@/configs'
import { reactive, computed } from 'vue'
import { formatFloatingPointValue, formatPercentageValue, FormattedNumber } from '@core/helper/number-format-helper'
import { eth } from '@core/helper'
import { Erc20TokenOwnerDetailsFragment } from '@module/tokens/apollo/TokenDetails/tokenDetails.generated'
const TYPES = ['ERC20', 'ERC721']

interface PropType {
    holder: Erc20TokenOwnerDetailsFragment
    decimals?: number
    tokenAddress: string
    holderType: string
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
    if (props.holder && state.imageExists) {
        return `${configs.OPENSEA}/getImage?contract=${props.holder.tokenInfo.contract}&tokenId=${getTokenID.value}`
    }
    return require('@/assets/icon-token.png')
})

const holderLink = computed<string>(() => {
    return `/address/${props.holder.owner}`
})

/**
 * Calculate percentage share of totalSupply held by this holder
 * @return {FormattedNumber} - Share
 */
const share = computed<FormattedNumber>(() => {
    if (!(props.holder.tokenInfo.totalSupply && props.holder.balance)) {
        return { value: 'N/A' }
    }
    BigNumber.config({ DECIMAL_PLACES: 50 })
    const share = new BigNumber(props.holder.balance).times(100).dividedBy(props.holder.tokenInfo.totalSupply)
    return formatPercentageValue(share)
})

const balance = computed<FormattedNumber>(() => {
    const balanceBN = props.decimals ? new BigNumber(props.holder.balance).div(new BN(10).pow(props.decimals)) : new BigNumber(props.holder.balance)
    return formatFloatingPointValue(balanceBN)
})

const isERC721 = computed<boolean>(() => {
    return props.holderType === TYPES[1]
})

const getTokenID = computed<string>(() => {
    return new BN(props.holder['token']).toString()
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
