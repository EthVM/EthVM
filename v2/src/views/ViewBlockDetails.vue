<template>
    <div>
        <app-error v-if="!isValid" :has-error="!isValid" message="This is not a valid block hash" />
        <app-message :messages="state.errorMessages" />
        <v-row :class="rowMargin">
            <!--
                =====================================================================================
                  TX TABLE
                =====================================================================================
            -->
            <!-- TODO: Implement get block transfers by hash -->
            <v-col cols="12" :class="columnPadding">
                <module-block-details v-if="isValid" :block-ref="props.blockRef" :is-hash="isHash" :tab="props.tab" />
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, watch } from 'vue'
import AppMessage from '@core/components/AppMessage.vue'
import AppError from '@core/components/AppError.vue'
import ModuleBlockDetails from '@module/block/ModuleBlockDetails.vue'
import { eth } from '@core/helper'
import { ErrorMessageBlock } from '@module/block/models/ErrorMessagesForBlock'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
const { columnPadding, rowMargin } = useAppViewGrid()

interface ComponentState {
    errorMessages: ErrorMessageBlock[]
    blockNumber: string
    isMined: boolean
}

const state: ComponentState = reactive({
    errorMessages: [],
    blockNumber: '',
    isMined: true
})

const props = defineProps({
    blockRef: String,
    tab: String
})

const isValid = computed<boolean>(() => {
    return isHash.value || eth.isValidBlockNumber(props.blockRef)
})

const isHash = computed<boolean>(() => {
    return eth.isValidHash(props.blockRef)
})

onMounted(() => {
    window.scrollTo(0, 0)
})

/**
 * Sets error if any
 * @param hasError {Boolean}
 * @param message {ErrorMessageToken}
 */
const setError = (hasError: boolean, message: ErrorMessageBlock): void => {
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

watch(
    () => props.blockRef,
    () => {
        state.blockNumber = props.blockRef
    }
)
</script>
