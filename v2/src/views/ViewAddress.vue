<template>
    <app-error v-if="hasError" :has-error="hasError" :message="state.error" />

    <div v-if="isValid && props.addressRef" :class="[xs ? 'adr-core-background-mobile' : 'adr-core-background', 'pb-6']">
        <v-card class="px-xl-auto mx-0" flat rounded="0" :min-height="smAndDown ? '100%' : '92px'">
            <v-container class="core-container fill-height px-3 px-sm-6 pb-4 pb-sm-6 px-md-16 pt-4 pt-sm-10">
                <v-row align="center" justify="center" class="px-3 px-sm-0 px-md-16 flex-nowrap" no-gutters>
                    <app-address-blockie :address="props.addressRef || ''" :size="xs ? 9 : 10" />
                    <v-col cols="6" sm="8" :md="store.getAddressName(props.addressRef) ? '7' : 'auto'" lg="auto" class="pl-2 pl-sm-4 pr-sm-0">
                        <div v-if="store.getAddressName(props.addressRef)" class="text-h4 font-weight-bold">
                            {{ store.getAddressName(props.addressRef) }}
                        </div>
                        <div>
                            <app-transform-hash
                                v-if="(xs && store.getAddressName(props.addressRef)) || (smAndDown && !store.getAddressName(props.addressRef))"
                                :hash="props.addressRef"
                                :class="['font-weight-regular', { 'text-h4': !store.getAddressName(props.addressRef) }]"
                                :show-name="false"
                                :is-short="xs"
                            ></app-transform-hash>
                            <p v-else :class="[{ 'text-h4': !store.getAddressName(props.addressRef) }]">{{ props.addressRef }}</p>
                        </div>
                    </v-col>
                    <v-col cols="6" sm="auto" md="6" lg="auto" class="d-flex flex-grow-0 flex-shrink-1 ml-auto ml-md-6 ml-lg-16 justify-end">
                        <app-copy-to-clip :value-to-copy="props.addressRef || ''" />
                        <module-add-adress-to-porfolio :address="props.addressRef" :name="store.getAddressName(props.addressRef)" />
                        <app-btn-icon icon="qr_code"></app-btn-icon>
                        <app-btn-icon icon="edit" @click="openEditDialog(true)"></app-btn-icon>
                    </v-col>
                    <!-- <v-divider :vertical="!smAndDown" class="my-1 my-sm-3 mx-n1 mx-sm-n3 mx-md-none"></v-divider>
                    <v-col cols="12" md="4" lg="3" class="d-flex align-center"> </v-col> -->
                </v-row>
            </v-container>
        </v-card>
        <module-porfolio-handle-adr
            v-if="state.showEdit"
            is-edit-mode
            :address="props.addressRef"
            :name="store.getAddressName(props.addressRef)"
            @close-module="openEditDialog(false)"
        >
        </module-porfolio-handle-adr>
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
        <div class="mx-2 mx-sm-6 mx-xl-auto mt-2 mt-md-6">
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
import ModuleAddAdressToPorfolio from '@module/address/ModulePorfolioHandleAdr.vue'
import ModulePorfolioHandleAdr from '@module/address/ModulePorfolioHandleAdr.vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { useStore } from '@/store'

const { smAndDown, xs } = useDisplay()

const store = useStore()
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
    showEdit: boolean
}

const state: ComponentState = reactive({
    errorMessages: [],
    error: '',
    tab: ROUTE_NAME.ADDRESS.NAME,
    showEdit: false
})

const openEditDialog = (_value: boolean) => {
    state.showEdit = _value
}
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
