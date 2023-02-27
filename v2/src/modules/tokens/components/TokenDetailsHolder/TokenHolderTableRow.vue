<template>
    <div>
        <!--
            =====================================================================================
              Tablet/ Desktop (SM - XL)
            =====================================================================================
        -->
        <app-table-row class="d-none d-sm-flex" row-align="center">
            <!-- Column 1: Holders Address -->
            <v-col sm="3">
                <div class="d-flex align-center">
                    <app-address-blockie :address="props.holder.owner || ''" :size="8" class="mr-1 mr-sm-2" />
                    <app-transform-hash is-blue is-short :hash="eth.toCheckSum(props.holder.owner)" :link="holderLink" :show-name="false" />
                </div>
            </v-col>
            <!-- End Column 1 -->

            <!-- Column 2: Balance -->
            <v-col sm="3" lg="4">
                <p class="mb-0 ml-2">
                    {{ balance.value }}
                </p>
            </v-col>
            <!-- End Column 2 -->

            <!-- Column 3: USD Value (ERC20) -->
            <v-col sm="3" md="3">
                <p class="mb-0">{{ usdValue.value }}</p>
            </v-col>
            <!-- End Column 3 -->

            <!-- Column 4: Share (ERC20) -->
            <v-col sm="3" lg="2">
                <p class="mb-0 ml-2">{{ share.value }}%</p>
            </v-col>
            <!-- End Column 4 -->
        </app-table-row>
        <app-table-row class="d-sm-none">
            <v-col cols="6">
                <div class="d-flex align-center">
                    <app-address-blockie :address="eth.toCheckSum(props.holder.owner) || ''" :size="6" class="mr-1" />
                    <app-transform-hash is-blue is-short :hash="eth.toCheckSum(props.holder.owner)" :link="holderLink" :show-name="false" />
                </div>
            </v-col>
            <v-col cols="6" class="text-right">
                <p class="mb-2">
                    {{ balance.value }}
                </p>
                <div class="d-flex align-items-center justify-end">
                    <p class="mr-2">{{ balance.value }}%</p>
                    <p>{{ share.value }}%</p>
                </div>
            </v-col>
        </app-table-row>
    </div>
</template>

<script setup lang="ts">
import AppTransformHash from '@core/components/AppTransformHash.vue'
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import AppTableRow from '@core/components/AppTableRow.vue'
import BigNumber from 'bignumber.js'
import BN from 'bignumber.js'
import { computed } from 'vue'
import { formatFloatingPointValue, formatPercentageValue, FormattedNumber, formatUsdValue } from '@core/helper/number-format-helper'
import { eth } from '@core/helper'
import { Erc20TokenOwnerDetailsFragment as Erc20Owner } from '@module/tokens/apollo/TokenDetails/tokenDetails.generated'

interface PropType {
    holder: Erc20Owner
    decimals?: number
    tokenAddress: string
    price: BN
}

const props = defineProps<PropType>()

/*
===================================================================================
  Computed
===================================================================================
*/

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

const usdValue = computed(() => {
    if (props.holder.__typename === 'ERC20TokenBalance') {
        const balanceBN = props.decimals ? new BigNumber(props.holder.balance).div(new BN(10).pow(props.decimals)) : new BigNumber(props.holder.balance)
        return formatUsdValue(balanceBN.multipliedBy(props.price) || 0)
    }
    return formatUsdValue(new BN(0))
})
</script>
<style scoped lang="css">
.table-row-mobile {
    border: 1px solid #b4bfd2;
}

.tx-hash {
    min-width: 3em;
}
</style>
