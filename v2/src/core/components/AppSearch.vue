<template>
    <v-row align="center" justify="end" class="my-0">
        <v-card class="rounded-s-pill rounded-e-0" width="380" id="search-options-activator">
            <v-text-field
                v-model="search.value"
                color="secondary"
                density="compact"
                variant="solo"
                placeholder="Search by address/transaction/token"
                hide-details
                clearable
                height="32px"
                class="text-caption"
                @click:clear="resetValues"
                @update:modelValue="onUserInput"
                @focus="search.focus = true"
                @blur="search.focus = false"
                @keyup.enter="onSearchEnter"
            >
                <template v-slot:prepend-inner>
                    <v-icon :color="search.value ? (props.hasError ? 'error' : 'secondary') : 'info'" icon="search" />
                </template>
            </v-text-field>
        </v-card>
        <v-btn variant="flat" color="secondary" height="40" width="130px" class="rounded-e-pill rounded-s-0 px-0" @click="onSearchEnter"> Search </v-btn>
        <v-menu location="bottom" activator="#search-options-activator">
            <v-card width="380" max-height="300px" rounded="xl" class="mt-1">
                <v-progress-linear v-if="isLoading" class="position-absolute" style="z-index: 1" color="secondary" height="5" indeterminate></v-progress-linear>
                <app-no-result v-if="props.hasError" :text="`We could not find anything mathching: ${search.value}`"></app-no-result>
                <slot v-else name="search-results"> </slot>
            </v-card>
        </v-menu>
    </v-row>
</template>

<script setup lang="ts">
import AppNoResult from './AppNoResult.vue'
import { PropType } from 'vue'
import { defineProps, defineEmits, reactive } from 'vue'
const props = defineProps({
    selectItems: {
        type: Array as PropType<string[]>,
        required: true
    },
    isLoading: {
        type: Boolean,
        default: true
    },
    hasError: {
        type: Boolean
    }
})

const emit = defineEmits<{
    (e: 'onUserInput', searchValue: string): void
    (e: 'onSearchEnter', searchValue: string): void
}>()

/*
  ===================================================================================
    Search
  ===================================================================================
  */
interface Search {
    focus: boolean
    timeout: number
    timeoutEnter: number
    value: string
    optionsTimeout: number
    isActive: boolean
}

const search: Search = reactive({ focus: false, timeout: 0, value: '', optionsTimeout: 0, isActive: true, timeoutEnter: 0 })
/**
 * Emits user input to parent with the timeout of 600
 */
const onUserInput = (): void => {
    clearTimeout(search.timeout)
    search.timeout = window.setTimeout(() => {
        emit('onUserInput', search.value)
    }, 600)
}
/**
 * Emits user pressed enter to parent with the timeout of 600
 */
const onSearchEnter = (): void => {
    clearTimeout(search.timeoutEnter)
    search.timeoutEnter = window.setTimeout(() => {
        emit('onSearchEnter', search.value)
    }, 600)
}

/**
 * Resets search
 */
const resetValues = (): void => {
    clearTimeout(search.timeout)
    clearTimeout(search.timeoutEnter)
    emit('onUserInput', search.value)
}
</script>
<style lang="scss">
.v-field.v-field--no-label.v-field--variant-solo {
    box-shadow: none !important;
}
input {
    font-size: 14px !important;
}
.v-field__prepend-inner > .v-icon {
    opacity: 1 !important;
}

.v-field__clearable {
    align-items: center !important;
    font-size: 14px !important;
    padding-top: 0px !important;
}
</style>
