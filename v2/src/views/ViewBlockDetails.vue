<template>
    <div>
        <app-error v-if="!isValid" :has-error="!isValid" message="This is not a valid block" :routeProp="props.blockRef" />
        <module-block-details v-if="isValid" :block-ref="props.blockRef" :is-hash="isHash" :tab="props.tab" />
    </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, watch } from 'vue'
import AppError from '@core/components/AppError.vue'
import ModuleBlockDetails from '@module/block/ModuleBlockDetails.vue'
import { eth } from '@core/helper'
import { ErrorMessageBlock } from '@module/block/models/ErrorMessagesForBlock'

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

watch(
    () => props.blockRef,
    () => {
        state.blockNumber = props.blockRef
    }
)
</script>
