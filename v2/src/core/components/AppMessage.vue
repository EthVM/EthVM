<template>
    <div>
        <v-snackbar v-model="showLarge" :bottom="true" :timeout="0" :auto-height="true" class="app-message" color="sync">
            <v-row align="center" justify="center" class="pa-1">
                <v-col shrink class="pl-2 pr-2">
                    <v-img :src="require('@/assets/icon-warning.png')" width="30px" height="30px" contain />
                </v-col>
                <v-col :class="[xs ? 'text-xs-center py-3' : '']" grow>
                    <p v-for="(message, i) in messages" :key="i" class="black--text font-italic">{{ message }}</p>
                </v-col>
                <v-col shrink>
                    <v-btn outline color="primary" class="text-capitalize px-4 py-2 ml-0" @click="debouncedSetSmall()">Got It</v-btn>
                </v-col>
            </v-row>
        </v-snackbar>
        <v-fab-transition>
            <v-btn
                v-show="state.isSmall && showErrors"
                color="transparent"
                fab
                icon
                absolute
                bottom
                right
                @click="debouncedSetLarge()"
                class="position-fixed mb-3 mr-3"
            >
                <v-img :src="require('@/assets/icon-warning-outline.png')" height="56px" max-width="56px" contain class="mb-2 mt-2"></v-img>
            </v-btn>
        </v-fab-transition>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'

const { xs } = useDisplay()

interface ComponentState {
    isLarge: boolean
    isSmall: boolean
}
const state: ComponentState = reactive({
    isLarge: false,
    isSmall: false
})

const props = defineProps({
    messages: Array
})

/*
===================================================================================
  Computed
===================================================================================
*/

const showErrors = computed<boolean>(() => {
    return props.messages && props.messages.length > 0
})

const showLarge = computed<boolean>(() => {
    return state.isLarge && showErrors.value
})

/*
===================================================================================
  Methods
===================================================================================
*/

const debounce = (handler, timer: number): any => {
    let debounceTimer
    return function () {
        const args = arguments
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => handler.apply(this, args), timer)
    }
}

/**
 * Sets isLarge as false and calls
 * debouncedSmall
 */
const debouncedSetSmall = (): void => {
    state.isLarge = false
    debouncedSmall()
}
/**
 * Sets isSmall as false and calls
 * debouncedLarge
 */
const debouncedSetLarge = (): void => {
    state.isSmall = false
    debouncedLarge()
}

/**
 * Sets isSmall as true
 */
const setIsSmall = (): void => {
    state.isSmall = true
}

/**
 * Sets isLarge as true
 */
const setIsLarge = (): void => {
    state.isLarge = true
}

/**
 * Sets isLarge as false
 * Sets isSmall as false
 */
const hideAll = (): void => {
    state.isLarge = false
    state.isSmall = false
}

const debouncedSmall = debounce(setIsSmall, 400)
const debouncedLarge = debounce(setIsLarge, 400)

watch(showErrors, (newVal, oldVal) => {
    if (newVal && newVal != oldVal) {
        debouncedSetSmall()
    }
    if (!newVal && newVal != oldVal) {
        hideAll()
    }
})
</script>

<style lang="scss">
.app-message {
    .v-snack__wrapper {
        min-width: 100%;
    }
}
</style>
