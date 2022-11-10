<template>
    <v-row :class="rowMargin">
        <v-col cols="12" md="6" lg="4" :class="columnPadding">
            <module-portfolio-total />
        </v-col>
        <v-col cols="12" md="6" lg="4" :class="columnPadding">
            <module-portfolio-balance />
        </v-col>
        <!-- 
        <v-col cols="12" md="6" lg="4" :class="[columnPadding, 'd-none d-sm-block']">
            <module-address-token-balance :address-ref="props.addressRef" />
        </v-col> -->
        <v-col cols="12">
            <v-card elevation="1" rounded="xl" class="pt-4 pt-sm-6">
                <app-tabs v-model="state.tab" :routes="routes" :tabs="tabs" class="mb-4 mb-sm-0"></app-tabs>
                <module-portfolio-list v-if="state.tab === routes[0]" />
                <module-portfolio-token-balance v-if="state.tab === routes[1]" /> </v-card
        ></v-col>
    </v-row>
</template>

<script setup lang="ts">
// import ModuleAddressBalance from '@module/address/ModuleAddressBalance.vue'
import ModulePortfolioBalance from '@/modules/address/ModulePortfolioBalances.vue'
import ModulePortfolioTotal from '@/modules/address/ModulePortfolioTotal.vue'
import ModulePortfolioTokenBalance from '@/modules/address/ModulePortfolioTokenBalance.vue'
import ModulePortfolioList from '@module/address/ModulePortfolioList.vue'
import AppTabs from '@/core/components/AppTabs.vue'
import { Tab } from '@core/components/props'
import { Q_PORTFOLIO } from '@core/router/routesNames'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { reactive } from 'vue'
const { columnPadding, rowMargin } = useAppViewGrid()

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

// const { newMinedBlocks, resetCount, newErc20Transfer, newErc721Transfer } = useAddressUpdate(props.addressRef)
</script>
