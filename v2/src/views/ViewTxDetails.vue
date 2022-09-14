<template>
    <div>
        <app-error v-if="hasError" :has-error="hasError" :message="state.error" />
        <app-message :messages="state.errorMessages" />
        <!--
        =====================================================================================
          TX DETAILS LIST
        =====================================================================================
        -->
        <tx-details v-if="isValid && !hasError" :tx-ref="props.txRef" @errorDetails="setError" />
    </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import AppMessage from '@/core/components/AppMessage.vue'
import AppError from '@/core/components/AppError.vue'
import { eth } from '@/core/helper'
import TxDetails from '@/modules/txs/ModuleTxDetails.vue'
import { ErrorMessageTx } from '@/modules/txs/models/ErrorMessagesForTx'

interface ComponentState {
    errorMessages: ErrorMessageTx[]
    error: string
}

const state: ComponentState = reactive({
    errorMessages: [],
    error: ''
})

const props = defineProps({
    txRef: String
})

const isValid = computed<boolean>(() => {
    return eth.isValidHash(props.txRef)
})

const hasError = computed<boolean>(() => {
    return state.error !== ''
})

if (!isValid.value) {
    state.error = 'This is not a valid transaction hash'
    window.scrollTo(0, 0)
}

/**
 * Sets error if any
 * @param hasError {Boolean}
 * @param message {ErrorMessageToken}
 */
const setError = (hasError: boolean, message: ErrorMessageTx): void => {
    if (hasError) {
        if (message === ErrorMessageTx.notFound) {
            state.error = message.toString()
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
