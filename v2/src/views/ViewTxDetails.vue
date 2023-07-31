<template>
    <div>
        <app-error v-if="hasError" :has-error="hasError" :message="state.error" :routeProp="props.txRef" />
        <!--
        =====================================================================================
          TX DETAILS LIST
        =====================================================================================
        -->
        <tx-details v-if="isValid && !hasError" :tx-ref="props.txRef || ''" :tab="props.tab" @errorDetails="setError" />
    </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, toRefs } from 'vue'
import AppError from '@/core/components/AppError.vue'
import { eth } from '@/core/helper'
import TxDetails from '@/modules/txs/ModuleTxDetails.vue'
import { ErrorMessageTx } from '@/modules/txs/models/ErrorMessagesForTx'
import { onBeforeRouteUpdate } from 'vue-router'
import { tabViewRouteGuardOnUpdate } from '@/core/router/helpers'
import { Q_TXS_DETAILS } from '@/core/router/routesNames'
import { VIEW_TAGS } from '@core/helper/tags'
import { usePageMeta } from '@core/composables/use-page-meta/use-page-meta.composable'

onMounted(() => {
    window.scrollTo(0, 0)
})

interface ComponentState {
    errorMessages: ErrorMessageTx[]
    error: string
}

const state: ComponentState = reactive({
    errorMessages: [],
    error: ''
})

const props = defineProps({
    txRef: {
        type: String,
        required: true
    },
    tab: String
})

const { txRef } = toRefs(props)
usePageMeta(txRef, VIEW_TAGS.TX)

const isValid = computed<boolean>(() => {
    return eth.isValidHash(props.txRef || '')
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

onBeforeRouteUpdate(async (to, from, next) => {
    tabViewRouteGuardOnUpdate(Q_TXS_DETAILS[0], to, from, next)
})
</script>
