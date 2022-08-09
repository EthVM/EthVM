<template>
    <div class="adr-core-background pb-6">
        <app-error v-if="hasError" :has-error="hasError" :message="state.error" />
        <app-message :messages="state.errorMessages" />
        <v-card class="px-2 px-sm-6 px-xl-auto" flat rounded="0" height="92px">
            <v-container class="pa-0 core-container">
                <p class="text-info">{{ props.addressRef }}</p>
            </v-container>
        </v-card>
        <v-tabs v-model="state.tab" background-color="primary" centered hide-slider>
            <v-tab
                v-for="i in tabs"
                :to="i.secondaryTab ? { name: i.routeName, query: { t: i.secondaryTab } } : { name: i.routeName }"
                :key="i.id"
                class="py-3 text-h5 text-capitalize rounded-b-xl"
                >{{ i.text }}</v-tab
            >
        </v-tabs>
        <v-window v-model="state.tab" class="pt-6">
            <v-window-item v-for="i in tabs" :key="i.id" :value="i.id" class="mx-2 mx-sm-6 mx-xl-auto">
                <v-container class="core-container pa-0" fluid>
                    <router-view :address-ref="addressRef" @tabChange="setLastViewedTab"></router-view>
                </v-container>
            </v-window-item>
        </v-window>
    </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import AppMessage from '@/core/components/AppMessage.vue'
import AppError from '@/core/components/AppError.vue'
import { eth } from '@/core/helper'
import { ErrorMessage } from '@module/address/models/ErrorMessageAddress'
import { useAppIsFluid } from '@/core/composables/AppIsFluid/useAppIsFluid.composable'
import { ROUTE_NAME, ADDRESS_ROUTE_QUERY } from '@core/router/routesNames'

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

const setLastViewedTab = (tab: string) => {
    if (tab === ADDRESS_ROUTE_QUERY.Q_TOKENS[0] || tab === ADDRESS_ROUTE_QUERY.Q_TOKENS[1]) {
        tabs[3].secondaryTab = tab
    } else {
        tabs[2].secondaryTab = tab
    }
}
/**
 * Track last viewable tab within the tokens view
 */

const props = defineProps({
    addressRef: String
})

interface ComponentState {
    errorMessages: ErrorMessage[]
    error: string
    tab: number
}

const state: ComponentState = reactive({
    errorMessages: [],
    error: '',
    tab: 0
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

/**
 * Sets error if any
 * @param hasError {Boolean}
 * @param message {ErrorMessageToken}
 */
// const setError = (hasError: boolean, message: ErrorMessage): void => {
//     if (hasError) {
//         if (!state.errorMessages.includes(message)) {
//             state.errorMessages.push(message)
//         }
//     } else {
//         if (state.errorMessages.length > 0) {
//             const index = state.errorMessages.indexOf(message)
//             if (index > -1) {
//                 state.errorMessages.splice(index, 1)
//             }
//         }
//     }
// }
/**------------------------
 * Grid Handling
 -------------------------*/
const { isFluidView } = useAppIsFluid()
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
</style>
