<template>
    <v-row :class="rowMargin">
        <v-col cols="12" lg="6" :class="columnPadding">
            <module-portfolio-total></module-portfolio-total>
        </v-col>
        <v-col cols="12" lg="6" :class="[columnPadding, 'order-first order-sm-2']">
            <v-card fluid class="pa-4 pa-sm-6" elevation="1" rounded="xl" height="100%">
                <v-row no-gutter justify="start">
                    <v-col v-if="xs" cols="12" class="mb-4">
                        <app-ad-buttons-small />
                    </v-col>
                    <v-col cols="6" sm="4" lg="3">
                        <address-balance-totals :title="$t('block.totalAddress')" :is-loading="false" :balance="store.portfolioLength.toString()">
                        </address-balance-totals>
                    </v-col>
                    <v-spacer />
                    <v-col v-if="xs" class="flex-shrink-1 flex-grow-0">
                        <module-add-adress-to-porfolio />
                    </v-col>
                    <v-col cols="12" sm="8" md="8" lg="9" class="d-flex align-center pt-2 py-md-7 pl-lg-0">
                        <v-row class="flex-nowrap fill-height justify-start justify-sm-end ma-0" align="center">
                            <div v-for="(i, index) in store.portfolio" :key="i.hash" :class="['d-flex align-center', { 'ml-n4': index != 0 }]">
                                <app-address-blockie :address="i.hash" :size="!lgAndUp ? 9 : 10" class="identicon-icon"></app-address-blockie>
                            </div>
                            <module-add-adress-to-porfolio v-if="!xs" class="ml-3" />
                        </v-row>
                    </v-col>
                    <v-divider v-if="!xs" class="my-6 mt-md-0" />
                    <v-col v-if="!xs" cols="12">
                        <div class="d-flex flex-nowrap align-center">
                            <address-balance-totals
                                :title="$t('block.tokenBalance')"
                                :is-loading="!store.portfolioTokensIsLoaded()"
                                :subtext="tokenCountSubtext"
                                :balance="tokenBalanceFiat.value"
                                :balance-tooltip="tokenBalanceFiat.tooltipText"
                            />
                            <app-token-icon-row v-if="store.portfolioTokensIsLoaded()" :tokens="tokenIcons" class="ml-5"></app-token-icon-row>
                        </div>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
        <v-col v-if="xs" cols="12">
            <v-card elevation="1" rounded="xl" class="pa-4 pa-sm-6">
                <address-balance-totals
                    :title="$t('block.tokenBalance')"
                    :is-loading="!store.portfolioTokensIsLoaded()"
                    :subtext="tokenCountSubtext"
                    :balance="tokenBalanceFiat.value"
                    :balance-tooltip="tokenBalanceFiat.tooltipText"
                />
                <app-token-icon-row v-if="store.portfolioTokensIsLoaded()" :tokens="tokenIcons" class="mt-3"></app-token-icon-row>
            </v-card>
        </v-col>
        <v-col cols="12" :class="columnPadding" order="3">
            <app-ad-buttons-large />
        </v-col>
        <v-col cols="12" :class="columnPadding" order="last">
            <v-card elevation="1" rounded="xl" class="pt-4 pt-sm-6">
                <v-row no-gutters>
                    <v-col cols="12" md="auto" lg="4" order="last" order-md="first">
                        <app-tabs v-model="state.tab" :routes="routes" :tabs="tabs" class="mx-n1 mt-n2 mb-4"></app-tabs>
                    </v-col>
                    <v-spacer />
                    <v-col v-if="!xs" cols="12" md="auto" lg="8" order="first" order-md="last" class="mb-8 pl-4 pl-sm-6 pr-md-6">
                        <app-ad-buttons-small />
                    </v-col>
                </v-row>
                <module-portfolio-list v-if="state.tab === routes[0]" />
                <module-portfolio-token-balance v-if="state.tab === routes[1]" :address-ref="state.addressRef" /> </v-card
        ></v-col>
    </v-row>
</template>

<script setup lang="ts">
import AppAdButtonsLarge from '@/core/components/AppAdButtonsLarge.vue'
import AppAdButtonsSmall from '@/core/components/AppAdButtonsSmall.vue'
import AddressBalanceTotals from '@/modules/address/components/AddressBalanceTotals.vue'
import ModuleAddAdressToPorfolio from '@module/address/ModulePorfolioHandleAdr.vue'
import ModulePortfolioTotal from '@/modules/address/ModulePortfolioTotal.vue'
import ModulePortfolioTokenBalance from '@/modules/address/ModulePortfolioTokenBalance.vue'
import ModulePortfolioList from '@module/address/ModulePortfolioList.vue'
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import AppTabs from '@/core/components/AppTabs.vue'
import AppTokenIconRow from '@/core/components/AppTokenIconRow.vue'
import { Tab } from '@core/components/props'
import { Q_PORTFOLIO } from '@core/router/routesNames'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { reactive, computed } from 'vue'
import { useStore } from '@/store'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { onBeforeRouteUpdate } from 'vue-router'
import { formatUsdValue, FormattedNumber } from '@core/helper/number-format-helper'
import { TokenSort, TOKEN_FILTER_VALUES } from '@module/address/models/TokenSort'
import { MarketDataFragment } from '@core/composables/CoinData/getLatestPrices.generated'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { tabViewRouteGuardOnUpdate } from '@/core/router/helpers'
import { VIEW_TAGS } from '@core/helper/tags'
import { usePageMeta } from '@core/composables/use-page-meta/use-page-meta.composable'

usePageMeta(null, VIEW_TAGS.PORTFOLIO)

const { t } = useI18n()

onMounted(() => {
    window.scrollTo(0, 0)
})

const { columnPadding, rowMargin } = useAppViewGrid()
const { xs, lgAndUp } = useDisplay()
const store = useStore()
const routes = Q_PORTFOLIO

const tabs: Tab[] = [
    {
        value: routes[0],
        title: t('block.header.watchList')
    },
    {
        value: routes[1],
        title: t('common.balance', 2)
    }
]

interface PropsInterface {
    tab: string
}

const props = defineProps<PropsInterface>()

interface StateType {
    error: string
    tab: string
    addressRef?: string
}
const state = reactive<StateType>({
    error: '',
    tab: props.tab
})

onBeforeRouteUpdate(async (to, from, next) => {
    if (to.query.t === Q_PORTFOLIO[0]) {
        state.addressRef = undefined
    } else {
        if (to.params.addressRef) {
            state.addressRef = to.params.addressRef as string
        }
    }
    tabViewRouteGuardOnUpdate(Q_PORTFOLIO[0], to, from, next)
})

const tokenBalanceFiat = computed<FormattedNumber>(() => {
    return formatUsdValue(store.portfolioTokensFiatBN)
})

const { getEthereumTokensMap } = useCoinData()

const tokenIcons = computed<string[]>(() => {
    if (store.portfolioTokensIsLoaded()) {
        //Token Sort:
        const contracts: string[] = []
        let tokenPrices: Map<string, MarketDataFragment> | false = false
        store.portfolioTokensRaw().forEach(token => {
            if (token) {
                contracts.push(token.tokenInfo.contract)
            }
        })
        if (contracts.length > 0) {
            tokenPrices = getEthereumTokensMap(contracts)
        }
        const tokens = new TokenSort(store.portfolioTokensRaw(), tokenPrices, true)
        const max = xs.value ? 10 : 16
        return tokens
            ?.getSortedTokens(TOKEN_FILTER_VALUES[5])
            .slice(0, max)
            .map(i => {
                return i.image
            })
            .reverse()
            .filter(i => i !== '')
    }
    return []
})

const tokenCountSubtext = computed<string>(() => {
    return store.portfolioTokensRaw().length === 1 ? t('token.tokenTotal') : t('token.tokenTotal', { n: store.portfolioTokensRaw().length })
})
</script>
<style lang="scss">
.identicon-icon {
    border-radius: 50%;
    box-shadow: 0px 3px 5px rgba(24, 43, 75, 0.2);
    border: 1px solid rgba(255, 255, 255, 1);
}
</style>
