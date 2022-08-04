<template>
    <div class="temp">
        <app-error v-if="hasError" :has-error="hasError" :message="state.error" />
        <app-message :messages="state.errorMessages" />
        <v-card class="px-2 px-sm-6 px-xl-auto" flat rounded="0" height="92px">
            <v-container class="pa-0 core-container">
                <p class="text-info">{{ props.addressRef }}</p>
            </v-container>
        </v-card>
        <v-tabs v-model="state.tab" background-color="primary" centered hide-slider>
            <v-tab href="#tab-1" class="py-3 text-h5 text-capitalize rounded-b-xl"> Overview </v-tab>
            <v-tab href="#tab-2" class="py-3 text-h5 text-capitalize rounded-b-xl">ETH Balance </v-tab>
            <v-tab href="#tab-3" class="py-3 text-h5 text-capitalize rounded-b-xl"> NFTs </v-tab>
            <v-tab href="#tab-3" class="py-3 text-h5 text-capitalize rounded-b-xl"> Tokens </v-tab>
        </v-tabs>
        <v-window v-model="state.tab" class="mt-6">
            <v-window-item v-for="i in 4" :key="i" :value="i - 1" class="mx-2 mx-sm-6 mx-xl-auto">
                <v-container class="core-container pa-0" fluid>
                    <v-row class="">
                        <v-col v-for="n in 3" :key="n" cols="12" md="6" lg="4">
                            <v-card rounded="xl" elevation="1" height="256"
                                ><p>{{ i }}</p></v-card
                            >
                        </v-col>
                    </v-row>
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

const props = defineProps({
    addressRef: String
})

interface ComponentState {
    errorMessages: ErrorMessage[]
    error: string
    tab: string | null
}

const state: ComponentState = reactive({
    errorMessages: [],
    error: '',
    tab: 'tab-1'
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
const setError = (hasError: boolean, message: ErrorMessage): void => {
    if (hasError) {
        if (!state.errorMessages.includes(message)) {
            state.errorMessages.push(message)
        }
    } else {
        if (state.errorMessages.length > 0) {
            const index = state.errorMessages.indexOf(message)
            if (index > -1) {
                state.errorMessages.splice(index, 1)
            }
        }
    }
}
/**------------------------
 * Grid Handling
 -------------------------*/
const { isFluidView } = useAppIsFluid()
</script>
<style lang="scss">
.v-tab {
    min-width: 180px;
}
.v-tab--selected {
    background-color: rgb(var(--v-theme-surface));
    color: rgb(var(--v-theme-on-surface-tabs));
}
.temp {
    background-color: rgb(var(--v-theme-primary));
    height: 316px;
}
</style>
