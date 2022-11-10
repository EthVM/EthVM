<template>
    <v-row :class="rowMargin">
        <v-col cols="12" md="6" lg="4" :class="columnPadding">
            <v-card fluid class="pa-4 pa-sm-6" elevation="1" rounded="xl" height="100%">
                <v-row no-gutter justify="center">
                    <v-col cols="6">
                        <address-balance-totals title="Total Addresses" :is-loading="false" :balance="store.portfolioLength.toString()">
                        </address-balance-totals>
                    </v-col>
                    <v-spacer />
                    <v-col class="flex-shrink-1 flex-grow-0">
                        <module-add-adress-to-porfolio />
                    </v-col>
                    <v-col cols="12" align-self="center">
                        <v-row class="flex-nowrap ml-4 fill-height mt-3 mt-md-16" justify="start" align="center">
                            <div v-for="i in store.portfolio" :key="i.hash" class="ml-n4">
                                <app-address-blockie :address="i.hash" :size="xs ? 10 : 11" class="identicon-icon"></app-address-blockie>
                            </div>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
        <v-col cols="12" md="6" lg="4" :class="columnPadding">
            <module-portfolio-total />
        </v-col>
        <v-col cols="12" md="6" lg="4" :class="columnPadding">
            <module-portfolio-balance />
        </v-col>
        <v-col cols="12">
            <v-card elevation="1" rounded="xl" class="pt-4 pt-sm-6">
                <app-tabs v-model="state.tab" :routes="routes" :tabs="tabs" class="mb-4 mb-sm-0"></app-tabs>
                <module-portfolio-list v-if="state.tab === routes[0]" />
                <module-portfolio-token-balance v-if="state.tab === routes[1]" /> </v-card
        ></v-col>
    </v-row>
</template>

<script setup lang="ts">
import AddressBalanceTotals from '@/modules/address/components/AddressBalanceTotals.vue'
import ModuleAddAdressToPorfolio from '@module/address/ModulePorfolioHandleAdr.vue'
import ModulePortfolioBalance from '@/modules/address/ModulePortfolioBalances.vue'
import ModulePortfolioTotal from '@/modules/address/ModulePortfolioTotal.vue'
import ModulePortfolioTokenBalance from '@/modules/address/ModulePortfolioTokenBalance.vue'
import ModulePortfolioList from '@module/address/ModulePortfolioList.vue'
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import AppTabs from '@/core/components/AppTabs.vue'
import { Tab } from '@core/components/props'
import { Q_PORTFOLIO } from '@core/router/routesNames'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { reactive } from 'vue'
import { useStore } from '@/store'
import { useDisplay } from 'vuetify/lib/framework.mjs'
const { columnPadding, rowMargin } = useAppViewGrid()
const { xs } = useDisplay()
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

const state = reactive({
    error: '',
    tab: props.tab
})
</script>
<style lang="scss">
.identicon-icon {
    border-radius: 50%;
    box-shadow: 0px 3px 5px rgba(24, 43, 75, 0.2);
    border: 1px solid rgba(255, 255, 255, 1);
}
</style>
