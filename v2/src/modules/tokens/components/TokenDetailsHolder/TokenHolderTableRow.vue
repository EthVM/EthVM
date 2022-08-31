<template>
    <div>
        <!--
    =====================================================================================
      Tablet/ Desktop (SM - XL)
    =====================================================================================
    -->
        <template v-if="!smAndDown">
            <v-row class="my-5 px-0 text-subtitle-2 font-weight-regular" align="center">
                <!-- Column 1: Holders Address -->
                <v-col sm="6" md="3">
                    <div class="d-flex align-center">
                        <app-address-blockie :address="eth.toCheckSum(props.holder.owner) || ''" :size="8" class="mr-2" />
                        <app-transform-hash is-blue start="5" end="5" :hash="eth.toCheckSum(props.holder.owner)" :link="holderLink" />
                    </div>
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

                <!-- Column 3: USD Value (ERC20) -->
                <v-col v-if="!isERC721" sm="3" md="3">
                    <p class="mb-0">
                        {{ share.value }}%
                        <app-tooltip v-if="share.tooltipText && !isERC721" :text="share.tooltipText" />
                    </p>
                </v-col>
                <!-- End Column 3 -->

                <!-- Column 3: USD Value (ERC721) -->
                <v-col v-if="isERC721" sm="3" md="3">
                    <v-img :src="image" align="center" justify="end" max-height="50px" max-width="50px" contain @error="onImageLoadFail" />
                </v-col>
                <!-- End Column 3 -->

                <!-- Column 4: Share (ERC20) -->
                <v-col v-if="!isERC721" sm="3" md="2">
                    <p class="mb-0 ml-2">
                        {{ share.value }}%
                        <app-tooltip v-if="share.tooltipText && !isERC721" :text="share.tooltipText" />
                    </p>
                </v-col>
                <!-- End Column 4 -->

                <!-- Column 3: Token Image (ERC721) -->
                <v-col v-if="isERC721" sm="3" md="2">
                    <v-img :src="image" align="center" justify="end" max-height="50px" max-width="50px" contain @error="onImageLoadFail" />
                </v-col>
                <!-- End Column 3 -->
            </v-row>
        </template>
    </div>
</template>

<script setup lang="ts">
import AppTransformHash from '@core/components/AppTransformHash.vue'
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import BigNumber from 'bignumber.js'
import AppTooltip from '@core/components/AppTooltip.vue'
import BN from 'bignumber.js'
import configs from '@/configs'
import { reactive, computed } from 'vue'
import { formatFloatingPointValue, formatPercentageValue, FormattedNumber } from '@core/helper/number-format-helper'
import { eth } from '@core/helper'
import { Erc20TokenOwnerDetailsFragment } from '@module/tokens/apollo/TokenDetails/tokenDetails.generated'
import { useDisplay } from 'vuetify'

const TYPES = ['ERC20', 'ERC721']
const { smAndDown } = useDisplay()

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
