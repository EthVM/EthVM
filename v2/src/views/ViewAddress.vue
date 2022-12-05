<template>
    <app-error v-if="hasError" :has-error="hasError" :message="state.error" />

    <div v-if="isValid && props.addressRef" :class="[xs ? 'adr-core-background-mobile' : 'adr-core-background', 'pb-6']">
        <v-card class="px-xl-auto mx-0" flat rounded="0" :min-height="smAndDown ? '100%' : '92px'">
            <v-container fluid class="core-container fill-height px-5 px-sm-6 pb-4 pb-sm-6 pt-4 pt-sm-10">
                <v-row align="center" justify="center" class="flex-nowrap px-0">
                    <app-address-blockie :address="props.addressRef || ''" :size="10" />
                    <app-transform-hash v-if="smAndDown" :hash="props.addressRef" class="text-h4 font-weight-regular px-2 px-sm-4"></app-transform-hash>
                    <p v-else class="mx-sm-4 text-h4">{{ props.addressRef }}</p>
                    <app-copy-to-clip :value-to-copy="props.addressRef || ''" class="ml-3" />
                    <app-btn-icon icon="favorite"></app-btn-icon>
                    <app-btn-icon icon="qr_code"></app-btn-icon>
                    <!-- <v-divider :vertical="!smAndDown" class="my-1 my-sm-3 mx-n1 mx-sm-n3 mx-md-none"></v-divider>
                    <v-col cols="12" md="4" lg="3" class="d-flex align-center"> </v-col> -->
                </v-row>
            </v-container>
        </v-card>
        <!--
            ========================
                Mobile Menu
            =========================
            -->
        <div v-if="smAndDown" class="d-flex justify-end">
            <v-btn flat color="primary" size="small" class="no-opacity text-subtitle-1 rounded-xl mx-3 mt-3 mb-2 v-btn--mobile-menu" id="address-core-menu">
                <p class="text-right font-weight-regular">{{ activeTabText }}</p>
                <v-icon class="ml-3">expand_more</v-icon>
            </v-btn>
            <v-menu activator="#address-core-menu" :items="tabs">
                <v-list bg-color="primary" class="rounded-xl">
                    <template v-for="(item, j) in tabs" :key="j">
                        <v-list-item @click="navigateTo(item.routeName, item.secondaryTab)" :value="item.routeName" :title="item.text" class="text-right">
                        </v-list-item>
                    </template>
                </v-list>
            </v-menu>
        </div>

        <!--
        ========================
            Desktop Menu
        =========================
        -->
        <v-tabs v-if="!smAndDown" v-model="state.tab" color="primary" centered hide-slider>
            <v-tab
                v-for="i in tabs"
                @click="navigateTo(i.routeName, i.secondaryTab)"
                :value="i.routeName"
                :key="i.routeName"
                class="py-3 text-h5 text-capitalize rounded-b-xl font-weight-light"
                color="primary"
                selected-class="bg-surface"
                ><p :class="activeTabText === i.text ? 'text-primary font-weight-regular' : 'text-white'">{{ i.text }}</p></v-tab
            >
        </v-tabs>
        <!--
        ========================
            Router View
        =========================
        -->
        <div class="mx-2 mx-sm-6 mx-xl-auto mt-2 mt-sm-6">
            <router-view v-slot="{ Component }" :address-ref="addressRef" :scroll-id="scrollId" @tabChange="setLastViewedTab">
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
import AppBtnIcon from '@/core/components/AppBtnIcon.vue'
import AppCopyToClip from '@/core/components/AppCopyToClip.vue'
import AppAddressBlockie from '@/core/components/AppAddressBlockie.vue'
import AppTransformHash from '@/core/components/AppTransformHash.vue'
import AppMenu from '@/core/components/AppMenu.vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'

const { smAndDown, xs } = useDisplay()

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
    }
])

const props = defineProps({
    addressRef: String,
    scrollId: {
        type: String,
        required: false
    }
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
const setLastViewedTab = (tab: string, isNFT: false) => {
    if (isNFT) {
        //NFT
        tabs[2].secondaryTab = tab
    } else if (tab === ADDRESS_ROUTE_QUERY.Q_TOKENS[0] || tab === ADDRESS_ROUTE_QUERY.Q_TOKENS[1]) {
        // ERC20 Tokens:
        tabs[3].secondaryTab = tab
    } else if (tab === ADDRESS_ROUTE_QUERY.Q_MINER[0] || tab === ADDRESS_ROUTE_QUERY.Q_MINER[1]) {
        // Mining history:
        tabs[4].secondaryTab = tab
    }
}

/**
 * Returns Active Tab text for the mobile menu
 */
const activeTabText = computed<string>(() => {
    const active = tabs.filter(i => i.routeName === state.tab)
    return active[0].text
})

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
.adr-core-background-mobile {
    background: linear-gradient(to bottom, rgb(var(--v-theme-primary)) 150px, rgb(var(--v-theme-background)) 150px, rgb(var(--v-theme-background)) 100%);
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

/* Mobile Menu content alignment-left */
.v-btn--mobile-menu {
    justify-content: end;
}
div.v-overlay__content {
    // left: 0px !important;
}
</style>
