<template>
    <div>
        <app-error v-if="hasError" :has-error="hasError" :message="state.error" />
        <app-message :messages="state.errorMessages" />
        <!--
        =====================================================================================
          UNCLE DETAILS LIST
        =====================================================================================
        -->
        <v-row justify="start" :class="rowMargin">
            <v-col cols="12" :class="columnPadding">
                <uncle-details v-if="isValid && !hasError" :uncle-ref="props.uncleRef" @errorDetails="setError" />
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue'
import AppMessage from '@core/components/AppMessage.vue'
import AppError from '@core/components/AppError.vue'
import UncleDetails from '@module/uncles/ModuleUncleDetails.vue'
import { eth } from '@core/helper'
import { ErrorMessageUncle } from '@module/uncles/models/ErrorMessagesForUncle'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'

const { columnPadding, rowMargin } = useAppViewGrid()

interface ComponentState {
    errorMessages: ErrorMessageUncle[]
    error: string
}

const state: ComponentState = reactive({
    errorMessages: [],
    error: ''
})

const props = defineProps({
    uncleRef: String
})

const isValid = computed<boolean>(() => {
    return eth.isValidHash(props.uncleRef)
})

const hasError = computed<boolean>(() => {
    return state.error !== ''
})

onMounted(() => {
    if (!isValid.value) {
        state.error = 'This is not a valid uncle hash'
        return
    }
    window.scrollTo(0, 0)
})

/**
 * Sets error if any
 * @param hasError {Boolean}
 * @param message {ErrorMessageToken}
 */
const setError = (hasError: boolean, message: ErrorMessageUncle): void => {
    if (hasError) {
        if (message === ErrorMessageUncle.notFound) {
            state.error = 'This uncle does not exist.'
        } else {
            if (!state.errorMessages.includes(message)) {
                state.errorMessages.push(message)
            }
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
</script>
