<template>
    <div>
        <v-system-bar v-if="xs" color="surface" class="font-weight-bold">
            <div v-if="supportsFiat">
                <v-scroll-y-reverse-transition hide-on-leave>
                    <p v-if="!loadingMarketInfo" key="price-transition">
                        <span class="text-info">{{ currencyName }}</span> {{ getPrice }}
                        <span v-if="getPercentage" :class="[getPercentage.color, 'mx-2']"> {{ getPercentage.change }}</span>
                    </p>
                </v-scroll-y-reverse-transition>
                <div v-if="loadingMarketInfo" style="height: 20px; width: 144px"></div>
            </div>
            <v-spacer />
            <v-scroll-y-reverse-transition hide-on-leave>
                <p v-if="gasPriceLoaded" key="gas-transition">
                    <span class="text-info">{{ $t('coreMenu.gas') }}</span> {{ gasPrice }} Gwei
                </p>
            </v-scroll-y-reverse-transition>
        </v-system-bar>
        <v-app-bar app flat :color="background" :class="['py-0 px-0 py-sm-2']" :height="xs ? '64' : '114'">
            <v-container class="mx-2 mx-sm-6 mx-md-auto mx-lg-6 mx-xl-auto px-0 text-white pt-lg-5 pb-lg-4">
                <v-row align="center" justify="start" class="mr-0 mx-0 flex-nowrap my-0 mr-lg-n3" style="min-height: 40px">
                    <div class="mr-4 logo-btn">
                        <v-img
                            :src="require('@/assets/logo.svg')"
                            height="35"
                            :width="xs ? '80' : '100'"
                            contain
                            class="ml-3 ml-sm-0 mr-auto logo-dark"
                            @click="goToHome"
                        />
                    </div>
                    <v-fade-transition hide-on-leave>
                        <module-search v-if="showSearchbar" class="justify-center mx-2 mx-sm-4" />
                    </v-fade-transition>
                    <v-spacer v-if="props.hideSearchBar && !showSearchbar"></v-spacer>

                    <template v-if="!showDrawerBtn">
                        <template v-for="(item, index) in navItems" :key="index">
                            <v-btn v-if="!item.links" rounded="pill" :active="false" :to="item.header.routerLink" class="text-subtitle-1 font-weight-light">
                                {{ item.header.text }}
                                <v-icon v-if="item.header.icon" class="ml-3">{{ item.header.icon }}</v-icon>
                            </v-btn>
                            <v-btn v-else class="text-subtitle-1 font-weight-light" rounded="pill">
                                {{ item.header.text }}
                                <v-icon class="ml-1">expand_more</v-icon>
                                <app-menu min-width="180" activator="parent" :items="item.links">
                                    <template v-for="(link, j) in item.links" :key="j">
                                        <v-list-item
                                            :to="link.isExternal ? undefined : link.routerLink"
                                            :href="link.isExternal ? link.routerLink : undefined"
                                            :target="link.isExternal ? '_blank' : '_self'"
                                            :value="link.routerLink"
                                            :title="link.text"
                                            class="primary--text py-3"
                                            :subtitle="link.subtext"
                                            ><template v-if="link.img" v-slot:prepend>
                                                <v-avatar rounded="0"><v-img :src="link.img"></v-img></v-avatar>
                                            </template>
                                        </v-list-item>
                                    </template>
                                </app-menu>
                            </v-btn>
                        </template>
                    </template>
                    <v-app-bar-nav-icon v-if="showDrawerBtn" @click="appStore.appDrawer = !appStore.appDrawer" />
                </v-row>
                <div v-if="!xs" class="d-flex align-center justify-end mt-3 mr-2 mr-lg-1">
                    <div v-if="supportsFiat">
                        <v-scroll-y-reverse-transition hide-on-leave>
                            <p v-if="!loadingMarketInfo" key="price-transition">
                                {{ currencyName }} {{ getPrice }}
                                <span v-if="getPercentage" :class="[getPercentage.color, 'mx-2']"> {{ getPercentage.change }}</span>
                            </p>
                        </v-scroll-y-reverse-transition>
                        <div v-if="loadingMarketInfo" style="height: 20px; width: 153px"></div>
                    </div>
                    <v-scroll-y-reverse-transition hide-on-leave>
                        <p v-if="gasPriceLoaded" key="gas-transition">{{ $t('coreMenu.gas') }} {{ gasPrice }} Gwei</p>
                    </v-scroll-y-reverse-transition>
                    <v-spacer />
                    <app-change-network />
                </div>
            </v-container>
        </v-app-bar>
    </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { computed, ref, onMounted, nextTick, watch } from 'vue'
import { useAppNavigation } from '../composables/AppNavigation/useAppNavigation.composable'
import { useStore } from '@/store'
import ModuleSearch from '@/modules/search/ModuleAppSearch.vue'
import AppMenu from './AppMenu.vue'
import AppChangeNetwork from './AppChangeNetwork.vue'
import BigNumber from 'bignumber.js'
import { useRouter } from 'vue-router'
import { ROUTE_NAME } from '@core/router/routesNames'
import { useNetwork } from '../composables/Network/useNetwork'
import { useCoinData } from '../composables/CoinData/coinData.composable'
import { formatUsdValue, formatPercentageValue } from '../helper/number-format-helper'
import { useGetLatestBlockInfoQuery } from '@module/block/apollo/BlockStats/blockStats.generated'
import { useBlockSubscription } from '@core/composables/NewBlock/newBlock.composable'
import BN from 'bignumber.js'
import Web3Utils from 'web3-utils'

/* Vuetify BreakPoints */
const { name, xs, lgAndUp } = useDisplay()
const { supportsFiat, currencyName } = useNetwork()

const props = defineProps({
    hideSearchBar: {
        default: true,
        type: Boolean
    },
    isTransparent: Boolean
})

const showDrawerBtn = computed<boolean>(() => {
    return name.value === 'xs' || name.value === 'sm' || name.value === 'md'
})

const appStore = useStore()

/*Define Emit Events */
defineEmits(['openDrawer'])
const { navItems } = useAppNavigation()

const router = useRouter()
const goToHome = async (): Promise<void> => {
    await router.push({
        name: ROUTE_NAME.HOME.NAME
    })
}

/*
===================================================================================
   Search Bar Handling
===================================================================================
*/

const offset = ref(0)

/**
 * Attaches event to the hide search bar prop on home page
 */
watch(
    () => props.hideSearchBar,
    newVal => {
        if (newVal) {
            window.addEventListener('scroll', onScroll)
        } else {
            window.addEventListener('scroll', onScroll)
        }
    }
)

watch(
    () => props.isTransparent,
    newVal => {
        if (newVal) {
            window.addEventListener('scroll', onScroll)
        } else {
            window.addEventListener('scroll', onScroll)
        }
    }
)

onMounted(() => {
    if (props.hideSearchBar || props.isTransparent) {
        window.addEventListener('scroll', onScroll)
    }
})

/**
 * Shows search bar whenever scroll threshhold is below 500
 */
const showSearchbar = computed<boolean>(() => {
    if (props.hideSearchBar) {
        const visibleAt = lgAndUp.value ? 352 : 440
        return offset.value > visibleAt
    }
    return true
})

const background = computed<string>(() => {
    if (props.isTransparent) {
        if (props.hideSearchBar) {
            if (offset.value < 131) {
                const transparency = new BigNumber(0.007634).multipliedBy(offset.value).toFixed()
                return `rgba(9,30,65, ${transparency})`
            }
        }
        if (offset.value < 120 && !props.hideSearchBar) {
            const transparency = new BigNumber(0.00833333333).multipliedBy(offset.value)
            return `rgba(9,30,65, ${transparency})`
        }
    }
    return 'primary'
})

const onScroll = () => {
    nextTick(() => {
        offset.value = window.scrollY
    })
}

/*
===================================================================================
  Price / Gas Price
===================================================================================
*/
const { loading: loadingMarketInfo, ethMarketInfo } = useCoinData()

const getPrice = computed<string>(() => {
    if (supportsFiat.value && !loadingMarketInfo.value) {
        return `${formatUsdValue(new BN(ethMarketInfo.value?.current_price || 0)).value}`
    }
    return `$0.00`
})

interface PercentChange {
    color: string
    change: string
}
const getPercentage = computed<PercentChange | undefined>(() => {
    if (supportsFiat.value && !loadingMarketInfo.value) {
        const _change = new BN(ethMarketInfo.value?.price_change_percentage_24h || 0)
        const isPositive = _change.isGreaterThan(0)
        const isNegative = _change.isLessThan(0)
        const sign = isPositive ? '+ ' : ''
        return {
            change: `${sign}${formatPercentageValue(_change).value}%`,
            color: isPositive ? 'text-success' : isNegative ? 'text-error' : ''
        }
    }
    return undefined
})

const { result: blockInfo, loading } = useGetLatestBlockInfoQuery()
const { newGasPrice } = useBlockSubscription()

const gasPriceLoaded = computed<boolean>(() => {
    return (!loading.value || !!newGasPrice.value) && gasPrice.value !== ''
})

const gasPrice = computed<string>(() => {
    if (newGasPrice.value) {
        return new BN(Web3Utils.fromWei(newGasPrice.value, 'Gwei')).toFixed(0).toString()
    }
    if (!loading.value && blockInfo.value?.getLatestBlockInfo.baseFeePerGas) {
        return new BN(Web3Utils.fromWei(blockInfo.value?.getLatestBlockInfo.baseFeePerGas, 'Gwei')).toFixed(0).toString()
    }
    return ''
})
</script>
<style scoped lang="scss">
.transparent-header {
    background: rgba(0, 0, 0, 0) !important;
}
.logo-btn {
    cursor: pointer;
}
</style>
