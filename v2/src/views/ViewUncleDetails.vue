<template>
    <div>
        <app-error v-if="hasError" :has-error="hasError" :message="state.error" :routeProp="props.uncleRef" />
        <!--
        =====================================================================================
          UNCLE DETAILS LIST
        =====================================================================================
        -->
        <v-row justify="start" :class="rowMargin">
            <v-col cols="12" :class="columnPadding">
                <app-ad-buttons-large />
            </v-col>
            <v-col cols="12" :class="columnPadding">
                <uncle-details v-if="isValid && !hasError" :uncle-ref="props.uncleRef" @errorDetails="setError" />
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, toRefs } from 'vue'
import AppError from '@core/components/AppError.vue'
import AppAdButtonsLarge from '@/core/components/AppAdButtonsLarge.vue'
import UncleDetails from '@module/uncles/ModuleUncleDetails.vue'
import { eth } from '@core/helper'
import { ErrorMessageUncle } from '@module/uncles/models/ErrorMessagesForUncle'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { useI18n } from 'vue-i18n'
import { VIEW_TAGS } from '@core/helper/tags'
import { usePageMeta } from '@core/composables/use-page-meta/use-page-meta.composable'

const { t } = useI18n()
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
    uncleRef: {
        type: String,
        required: true
    }
})
const { uncleRef } = toRefs(props)
usePageMeta(uncleRef, VIEW_TAGS.UNCLE)

const isValid = computed<boolean>(() => {
    return eth.isValidHash(props.uncleRef)
})

const hasError = computed<boolean>(() => {
    return state.error !== ''
})

onMounted(() => {
    if (!isValid.value) {
        state.error = t('uncle.error')
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
            state.error = t('uncle.errorExist')
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
