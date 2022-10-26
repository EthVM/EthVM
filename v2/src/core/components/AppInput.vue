<template>
    <v-card rounded="pill" :width="props.width" elevation="0">
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
                <slot name="prepend-inner">
                    <v-icon :color="state.value ? (props.hasError ? 'error' : 'secondary') : 'greyInputText'" icon="search" />
                </slot>
            </template>
        </v-text-field>
    </v-card>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, reactive, onBeforeUnmount } from 'vue'

interface ComponentProps {
    isLoading?: boolean
    hasError?: boolean
    placeHolder?: string
    modelValue?: string
    width?: string
    hasPreppendInner?: boolean
}
const props = withDefaults(defineProps<ComponentProps>(), {
    isLoading: false,
    hasError: false,
    placeHolder: 'I am a placeholder',
    modelValue: '',
    width: '540px',
    hasPreppendInner: true
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
</script>
