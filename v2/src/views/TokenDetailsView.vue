<template>
    <div>
        <token-details
            v-if="!hasError"
            :address-ref="props.addressRef"
            :is-holder="state.isHolder"
            :holder-address="state.holderAddress"
            @errorDetails="setError"
        />
        <app-error v-else :has-error="hasError" :message="state.error" />
        <app-message :messages="state.errorMessages" />
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import TokenDetails from '@module/tokens/ModuleTokenDetails.vue'
import { ErrorMessageToken } from '@module/tokens/models/ErrorMessagesForTokens'
import AppMessage from '@core/components/AppMessage.vue'
import AppError from '@core/components/AppError.vue'
import { eth } from '@core/helper'
import { useRoute } from 'vue-router'

const props = defineProps({
    addressRef: {
        type: String,
        required: true
    }
})

interface ComponentState {
    errorMessages: ErrorMessageToken[]
    holderAddress?: string | undefined
    error: string
    isHolder: boolean
    hasErrorHandler: boolean
}
const route = useRoute()

const state: ComponentState = reactive({
    errorMessages: [],
    holderAddress: (route.query?.holder as string) || '',
    error: '',
    hasErrorHandler: false,
    isHolder: false
})

const isValid = computed<boolean>(() => {
    return eth.isValidAddress(props.addressRef)
})

const hasError = computed<boolean>(() => {
    return state.error !== ''
})

const query = route.query
if (query.holder) {
    state.isHolder = true
    state.holderAddress = query.holder as string
}

if (!isValid.value) {
    state.error = 'This is not a valid token address'
}

watch(route, () => {
    const query = route.query
    if (query.holder) {
        state.isHolder = true
        state.holderAddress = query.holder as string
    } else {
        state.isHolder = false
        state.holderAddress = undefined
    }
    window.scrollTo(0, 0)
})

/*
===================================================================================
  Methods
===================================================================================
*/
/**
 * Sets error if any
 * @param hasError {Boolean}
 * @param message {ErrorMessageToken}
 */
const setError = (hasError: boolean, message: ErrorMessageToken): void => {
    state.hasErrorHandler = hasError
    if (hasError) {
        if (message === ErrorMessageToken.invalid) {
            state.error = 'This is not a valid token address'
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
