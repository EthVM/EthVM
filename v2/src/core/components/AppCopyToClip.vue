<template>
    <div>
        <app-btn-icon icon="content_copy" :tooltip-text="props.tooltipText" @click="copy" />
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import clipboardCopy from 'clipboard-copy'
import AppBtnIcon from './AppBtnIcon.vue'
import { useStore } from '@/store'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
    valueToCopy: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: ''
    },
    customMessage: {
        type: String,
        default: ''
    },
    tooltipText: {
        type: String,
        default: ''
    }
})

interface ComponentState {
    message: string
}

const state: ComponentState = reactive({
    message: ''
})

const store = useStore()
/**
 * Copies string to clipboard
 */
const copy = async (): Promise<void> => {
    state.message = ''
    try {
        await clipboardCopy(props.valueToCopy)
        state.message = props.customMessage === '' ? t('notify.copied', { result: props.valueToCopy }) : `${props.customMessage}`
        store.notify(state.message)
    } catch (err) {
        state.message = 'Error in copy'
        store.notify(state.message)
    }
}
</script>
