<template>
    <div>
        <v-app-bar app flat color="primary" :class="['py-0 px-0 py-sm-2']" :height="xs ? '64' : '114'">
            <v-container class="mx-2 mx-sm-6 mx-md-auto mx-lg-6 mx-xl-auto px-0 text-white pt-lg-5 pb-lg-4">
                <v-row align="center" justify="start" class="mr-0 mx-0 flex-nowrap my-0 mr-lg-n3" style="min-height: 40px">
                    <div class="mr-4 logo-btn">
                        <a href="https://www.ethvm.com/"
                            ><v-img src="~/assets/logo.svg" height="35" :width="xs ? '80' : '100'" contain class="ml-3 ml-sm-0 mr-auto logo-dark"
                        /></a>
                    </div>
                    <v-spacer></v-spacer>
                    <template v-if="!showDrawerBtn">
                        <template v-for="(item, index) in navItems" :key="index">
                            <v-btn v-if="!item.links" rounded="pill" :active="false" :href="item.header.routerLink" class="text-subtitle-1 font-weight-light">
                                {{ item.header.text }}
                                <v-icon v-if="item.header.icon" class="ml-3">{{ item.header.icon }}</v-icon>
                            </v-btn>
                            <v-btn v-else class="text-subtitle-1 font-weight-light" rounded="pill">
                                {{ item.header.text }}
                                <v-icon class="ml-1">expand_more</v-icon>
                                <app-menu min-width="180" activator="parent" :items="item.links">
                                    <template v-for="(link, j) in item.links" :key="j">
                                        <v-list-item
                                            :href="link.routerLink"
                                            target="_self"
                                            :value="link.routerLink"
                                            :title="link.text"
                                            class="primary--text py-3"
                                            :subtitle="link.subtext"
                                            ><template v-if="link.img" #prepend>
                                                <v-avatar rounded="0"><v-img :src="link.img"></v-img></v-avatar>
                                            </template>
                                        </v-list-item>
                                    </template>
                                </app-menu>
                            </v-btn>
                        </template>
                    </template>
                    <v-app-bar-nav-icon v-if="showDrawerBtn" @click="appDrawer = !appDrawer" />
                </v-row>
                <div v-if="!xs" class="d-flex align-center justify-end mt-3 mr-2 mr-lg-1">
                    <v-spacer />
                    <app-change-network />
                </div>
            </v-container>
        </v-app-bar>
    </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { computed } from 'vue'

/* Vuetify BreakPoints */
const { name, xs } = useDisplay()
const appDrawer = useAppDrawer()

const showDrawerBtn = computed<boolean>(() => {
    return name.value === 'xs' || name.value === 'sm' || name.value === 'md'
})

/* Define Emit Events */
defineEmits(['openDrawer'])
const { navItems } = useAppNavigation()

/*
===================================================================================
  Price / Gas Price
===================================================================================
*/
// const { loading: loadingMarketInfo, ethMarketInfo } = useCoinData()

// const getPrice = computed<string>(() => {
//     if (supportsFiat.value && !loadingMarketInfo.value) {
//         return `${formatUsdValue(new BN(ethMarketInfo.value?.current_price || 0)).value}`
//     }
//     return `$0.00`
// })

// interface PercentChange {
//     color: string
//     change: string
// }
// const getPercentage = computed<PercentChange | undefined>(() => {
//     if (supportsFiat.value && !loadingMarketInfo.value) {
//         const _change = new BN(ethMarketInfo.value?.price_change_percentage_24h || 0)
//         const isPositive = _change.isGreaterThan(0)
//         const isNegative = _change.isLessThan(0)
//         const sign = isPositive ? '+ ' : ''
//         return {
//             change: `${sign}${formatPercentageValue(_change).value}%`,
//             color: isPositive ? 'text-success' : isNegative ? 'text-error' : ''
//         }
//     }
//     return undefined
// })

// const { result: blockInfo, loading } = useGetLatestBlockInfoQuery()
// const { newGasPrice } = useBlockSubscription()

// const gasPriceLoaded = computed<boolean>(() => {
//     return (!loading.value || !!newGasPrice.value) && gasPrice.value !== ''
// })

// const gasPrice = computed<string>(() => {
//     if (newGasPrice.value) {
//         return new BN(Web3Utils.fromWei(newGasPrice.value, 'Gwei')).toFixed(0).toString()
//     }
//     if (!loading.value && blockInfo.value?.getLatestBlockInfo.baseFeePerGas) {
//         return new BN(Web3Utils.fromWei(blockInfo.value?.getLatestBlockInfo.baseFeePerGas, 'Gwei')).toFixed(0).toString()
//     }
//     return ''
// })
</script>
<style scoped lang="scss">
.transparent-header {
    background: rgba(0, 0, 0, 0) !important;
}
.logo-btn {
    cursor: pointer;
}
</style>
