<template>
    <v-row :class="rowMargin">
        <v-col cols="12" lg="6" :class="columnPadding">
            <module-portfolio-total></module-portfolio-total>
        </v-col>
        <v-col cols="12" lg="6" :class="[columnPadding, 'order-first order-sm-2']">
            <v-card fluid class="pa-4 pa-sm-6" elevation="1" rounded="xl" height="100%">
                <v-row no-gutter justify="start">
                    <v-col cols="6" sm="4" lg="3">
                        <address-balance-totals title="Total Addresses" :is-loading="false" :balance="store.portfolioLength.toString()">
                        </address-balance-totals>
                    </v-col>
                    <v-spacer />
                    <v-col v-if="xs" class="flex-shrink-1 flex-grow-0">
                        <module-add-adress-to-porfolio />
                    </v-col>
                    <v-col cols="12" sm="8" md="8" lg="9" class="d-flex align-center pt-2 py-md-7">
                        <v-row class="flex-nowrap fill-height justify-start justify-sm-end ma-0" align="center">
                            <div v-for="(i, index) in store.portfolio" :key="i.hash" :class="['d-flex align-center', { 'ml-n4': index != 0 }]">
                                <app-address-blockie :address="i.hash" :size="!lgAndUp ? 9 : 8" class="identicon-icon"></app-address-blockie>
                            </div>
                            <module-add-adress-to-porfolio v-if="!xs" class="ml-4" />
                        </v-row>
                    </v-col>
                    <v-divider v-if="!xs" class="my-6 mt-md-0" />
                    <v-col v-if="!xs" cols="12">
                        <address-balance-totals
                            title="Token Balance"
                            :is-loading="!store.portfolioTokensIsLoaded()"
                            :subtext="`${tokensCount} total tokens`"
                            :balance="tokenBalanceFiat"
                        />
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
        <v-col v-if="xs" cols="12">
            <v-card elevation="1" rounded="xl" class="pa-4 pa-sm-6">
                <address-balance-totals
                    title="Token Balance"
                    :is-loading="!store.portfolioTokensIsLoaded()"
                    :subtext="`${tokensCount} total tokens`"
                    :balance="tokenBalanceFiat"
                />
            </v-card>
        </v-col>
        <v-col cols="12" :class="columnPadding" order="last">
            <v-card elevation="1" rounded="xl" class="pt-4 pt-sm-6">
                <app-tabs v-model="state.tab" :routes="routes" :tabs="tabs" class="mb-4 mb-sm-0"></app-tabs>
                <module-portfolio-list v-if="state.tab === routes[0]" />
                <module-portfolio-token-balance v-if="state.tab === routes[1]" :address-ref="state.addressRef" /> </v-card
        ></v-col>
    </v-row>
</template>

<script setup lang="ts">
import AddressBalanceTotals from '@/modules/address/components/AddressBalanceTotals.vue'
import ModuleAddAdressToPorfolio from '@module/address/ModulePorfolioHandleAdr.vue'
import ModulePortfolioTotal from '@/modules/address/ModulePortfolioTotal.vue'
import ModulePortfolioTokenBalance from '@/modules/address/ModulePortfolioTokenBalance.vue'
import ModulePortfolioList from '@module/address/ModulePortfolioList.vue'
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import AppTabs from '@/core/components/AppTabs.vue'
import { Tab } from '@core/components/props'
import { Q_PORTFOLIO } from '@core/router/routesNames'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { reactive, computed } from 'vue'
import { useStore } from '@/store'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { onBeforeRouteUpdate } from 'vue-router'
import { formatUsdValue, formatNumber } from '@core/helper/number-format-helper'

const { columnPadding, rowMargin } = useAppViewGrid()
const { xs, lgAndUp } = useDisplay()
const store = useStore()
const routes = Q_PORTFOLIO

const tabs: Tab[] = [
    {
        value: routes[0],
        title: 'Watchlist'
    },
    {
        value: routes[1],
        title: 'Balances'
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

onBeforeRouteUpdate(to => {
    if (to.query.t === Q_PORTFOLIO[0]) {
        state.addressRef = undefined
    } else {
        if (to.params.addressRef) {
            state.addressRef = to.params.addressRef as string
        }
    }
})

const tokenBalanceFiat = computed<string>(() => {
    return formatUsdValue(store.portfolioTokensFiatBN).value
})

const tokensCount = computed<string>(() => {
    return formatNumber(store.portfolioTokensRaw().length)
})
</script>
<style lang="scss">
.identicon-icon {
    border-radius: 50%;
    box-shadow: 0px 3px 5px rgba(24, 43, 75, 0.2);
    border: 1px solid rgba(255, 255, 255, 1);
}
</style>