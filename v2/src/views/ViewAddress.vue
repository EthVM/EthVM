<template>
    <app-error v-if="hasError" :has-error="hasError" :message="state.error" />

    <div v-if="isValid" class="adr-core-background pb-6">
        <v-card class="px-2 px-sm-6 px-xl-auto" flat rounded="0" height="92px">
            <v-container class="pa-0">
                <p class="text-info">{{ props.addressRef }}</p>
            </v-container>
        </v-card>
        <v-tabs v-model="state.tab" background-color="primary" centered hide-slider>
            <v-tab
                v-for="i in tabs"
                @click="navigateTo(i.routeName, i.secondaryTab)"
                :value="i.routeName"
                :key="i.routeName"
                class="py-3 text-h5 text-capitalize rounded-b-xl"
                >{{ i.text }}</v-tab
            >
        </v-tabs>
        <div class="mx-2 mx-sm-6 mx-xl-auto mt-6">
            <router-view v-slot="{ Component }" :address-ref="addressRef" @tabChange="setLastViewedTab">
                <v-container class="pa-0">
                    <Transition name="fade" mode="out-in">
                        <component :is="Component" :key="route.name" />
                    </Transition>
                </v-container>
            </router-view>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue'
import AppError from '@/core/components/AppError.vue'
import { eth } from '@/core/helper'
import { ErrorMessage } from '@module/address/models/ErrorMessageAddress'
import { ROUTE_NAME, ADDRESS_ROUTE_QUERY } from '@core/router/routesNames'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'

const tabs = reactive([
    {
        id: 0,
        text: 'Overview',
        routeName: ROUTE_NAME.ADDRESS.NAME
    },
    {
        id: 1,
        text: 'ETH Balance',
        routeName: ROUTE_NAME.ADDRESS_BALANCE.NAME
    },
    {
        id: 2,
        text: 'NFTS',
        routeName: ROUTE_NAME.ADDRESS_NFTS.NAME,
        secondaryTab: ADDRESS_ROUTE_QUERY.Q_NFTS[0]
    },
    {
        id: 3,
        text: 'Tokens',
        routeName: ROUTE_NAME.ADDRESS_TOKENS.NAME,
        secondaryTab: ADDRESS_ROUTE_QUERY.Q_TOKENS[0]
    },
    {
        id: 4,
        text: 'Mining History',
        routeName: ROUTE_NAME.ADDRESS_MINER.NAME,
        secondaryTab: ADDRESS_ROUTE_QUERY.Q_MINER[0]
    }
])

const props = defineProps({
    addressRef: String
})

interface ComponentState {
    errorMessages: ErrorMessage[]
    error: string
    tab: string
}

const state: ComponentState = reactive({
    errorMessages: [],
    error: '',
    tab: ROUTE_NAME.ADDRESS.NAME
})

/**------------------------
 * Tab Handling
 -------------------------*/

const router = useRouter()
const route = useRoute()
/**
 * Check route and set appropriate tab and secondary tab
 */
onMounted(() => {
    if (route.name && route.name.toString() !== state.tab) {
        state.tab = route.name.toString()
    }
})
/**
 * Check if to.name not equal to the state.tab, in case when user goes back in history
 */
onBeforeRouteUpdate(to => {
    if (to.name && state.tab !== to.name) {
        state.tab = to.name.toString()
    }
})

/**
 * Reroutes appropriate tab
 * @param {string} _name - route name, use imported ROUTE_NAME variables
 * @param {string} _name - route query, use  imported ADDRESS_ROUTE_QUERY variables in the appropriate route names
 */
const navigateTo = async (_name: string, _query?: string) => {
    await router.push({
        name: _name,
        query: { t: _query }
    })
}

/**
 * Track last viewable tab within the token/nfts/miner views
 * @param {string} tab - route query, MUST BE FROM  imported ADDRESS_ROUTE_QUERY variables in the appropriate route names
 */
const setLastViewedTab = (tab: string) => {
    // ERC20 Tokens:
    if (tab === ADDRESS_ROUTE_QUERY.Q_TOKENS[0] || tab === ADDRESS_ROUTE_QUERY.Q_TOKENS[1]) {
        tabs[3].secondaryTab = tab
    } else if (tab === ADDRESS_ROUTE_QUERY.Q_MINER[0] || tab === ADDRESS_ROUTE_QUERY.Q_MINER[1]) {
        // Mining history:
        tabs[4].secondaryTab = tab
    } else {
        tabs[2].secondaryTab = tab
    }
}

/**------------------------
 * Error Handling
 -------------------------*/

const isValid = computed<boolean>(() => {
    return eth.isValidAddress(props.addressRef || '')
})

const hasError = computed<boolean>(() => {
    return state.error !== ''
})

if (!isValid.value) {
    state.error = 'This is not a valid address hash'
    window.scrollTo(0, 0)
}
</script>
<style lang="scss" scoped>
.v-tab {
    min-width: 180px;
}
.v-tab--selected {
    background-color: rgb(var(--v-theme-surface));
    color: rgb(var(--v-theme-on-surface-tabs));
}
.adr-core-background {
    background: linear-gradient(to bottom, rgb(var(--v-theme-primary)) 316px, rgb(var(--v-theme-background)) 316px, rgb(var(--v-theme-background)) 100%);
}
/* FADE TRANSITION */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
