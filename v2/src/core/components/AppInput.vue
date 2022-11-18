<template>
    <v-card elevation="0" color="transparent" :max-width="props.width">
        <v-card rounded="pill" :max-width="props.width" elevation="0">
            <v-text-field
                v-model="state.value"
                :placeholder="props.placeHolder"
                variant="solo"
                density="comfortable"
                hide-details
                clearable
                @update:modelValue="onUserInput"
                @click:clear="resetValues"
                bg-color="greyCard"
                color="primary"
            >
                <template v-if="hasPreppendInner" #prepend-inner>
                    <slot name="prepend">
                        <v-icon :color="state.value ? (props.hasError ? 'error' : 'secondary') : 'greyInputText'" icon="search" />
                    </slot>
                </template>
                <template v-else #prepend-inner>
                    <div class="ml-6"></div>
                </template>
            </v-text-field>
        </v-card>
        <div v-if="props.showErrorMessage" class="input-error-messages">
            <v-scroll-x-transition>
                <p v-if="hasError && props.errorMessage" class="ml-11 text-error">{{ props.errorMessage }}</p>
            </v-scroll-x-transition>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, reactive, onBeforeUnmount, watch } from 'vue'

interface ComponentProps {
    isLoading?: boolean
    hasError?: boolean
    placeHolder?: string
    modelValue?: string
    width?: string
    hasPreppendInner?: boolean
    errorMessage?: string
    showErrorMessage?: boolean
}
const props = withDefaults(defineProps<ComponentProps>(), {
    isLoading: false,
    hasError: false,
    placeHolder: 'I am a placeholder',
    modelValue: '',
    width: '540',
    hasPreppendInner: true,
    showErrorMessage: false
})

const emit = defineEmits<{
    (e: 'onUserInput', searchValue: string): void
    (e: 'update:modelValue', searchValue: string): void
}>()

/*
  ===================================================================================
    Search
  ===================================================================================
  */
interface InputSate {
    timeout: number
    value: string
}

const state: InputSate = reactive({ timeout: 0, value: props.modelValue })

/**
 * Emits user input to parent with the timeout of 600
 */
const onUserInput = (): void => {
    // allows to use v-model on the app-input component
    emit('update:modelValue', state.value)
    clearTimeout(state.timeout)
    state.timeout = window.setTimeout(() => {
        emit('onUserInput', state.value)
    }, 600)
}

/**
 * Resets search
 */
const resetValues = (): void => {
    clearTimeout(state.timeout)
    emit('onUserInput', state.value)
}

/**
 * Clean up before destroy
 */
onBeforeUnmount(() => {
    resetValues()
})

/**
 * Watching changes from the parent
 */
watch(
    () => props.modelValue,
    newVal => {
        if (newVal !== state.value) {
            state.value = newVal
        }
    }
)
</script>
<style scoped lang="scss">
.input-error-messages {
    min-height: 16px;
    font-size: 10px !important;
    line-height: 16px;
}
</style>
