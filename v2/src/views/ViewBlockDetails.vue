<template>
    <div>
        <app-error v-if="!isValid" :has-error="!isValid" message="This is not a valid block hash" />
        <app-message :messages="state.errorMessages" />
        <v-row :class="rowMargin">
            <!--
        =====================================================================================
          Block DETAILS LIST
        =====================================================================================
        -->
            <v-col cols="12" :class="columnPadding">
                <block-details
                    v-if="isValid"
                    :block-ref="props.blockRef"
                    :is-hash="isHash"
                    @errorDetails="setError"
                    @isMined="setIsMined"
                    @setBlockNumber="setBlockNumber"
                />
            </v-col>

            <!--
        =====================================================================================
          TX TABLE
        =====================================================================================
        -->
            <!-- TODO: Implement get block transfers by hash -->
            <v-col cols="12" :class="columnPadding">
                <block-txs
                    v-if="showBlockTxs"
                    :max-items="10"
                    :block-ref="state.blockNumber"
                    :is-hash="isHash"
                    :is-mined="state.isMined"
                    page-type="blockDetails"
                    @errorTxs="setError"
                />
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, watch } from 'vue'
import AppMessage from '@core/components/AppMessage.vue'
import AppError from '@core/components/AppError.vue'
import BlockTxs from '@module/txs/ModuleTxs.vue'
import BlockDetails from '@module/block/ModuleBlockDetails.vue'
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
    blockRef: String
})

const isValid = computed<boolean>(() => {
    return isHash.value || eth.isValidBlockNumber(props.blockRef)
})

const isHash = computed<boolean>(() => {
    return eth.isValidHash(props.blockRef)
})

const showBlockTxs = computed<boolean>(() => {
    return isValid.value && state.blockNumber !== ''
})

onMounted(() => {
    window.scrollTo(0, 0)
})

/**
 * Sets isMined to true
 */
const setIsMined = (): void => {
    state.isMined = true
}

/**
 * Set block Number
 * @param value {String}
 */
const setBlockNumber = (value: string): void => {
    state.blockNumber = value
}

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
