<template>
    <div>
        <app-btn-icon v-if="isCustom" icon="far fa-copy" :tooltip-text="tooltipText" :color="color" @click="copy" />
        <v-btn v-else icon small class="ma-0" @click="copy" flat>
            <v-icon color="primary">mdi-content-copy</v-icon>
        </v-btn>
        <v-snackbar v-model="state.showCopyMes" bottom right :color="state.mesColor" :absolute="isCustom" class="break-string" :timeout="20000">
            <v-row class="flex-nowrap">
                {{ state.message }}
                <v-btn color="white" variant="plain" flat icon my-1 @click="state.showCopyMes = false">
                    <v-icon small>mdi-close</v-icon>
                </v-btn>
            </v-row>
        </v-snackbar>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import clipboardCopy from 'clipboard-copy'
import AppBtnIcon from './AppBtnIcon.vue'

const props = defineProps({
    valueToCopy: String,
    color: {
        type: String,
        default: ''
    },
    customMessage: {
        type: String,
        default: ''
    },
    isCustom: {
        type: Boolean,
        default: false
    },
    tooltipText: String
})

interface ComponentState {
    showCopyMes: boolean
    message: string
    mesColor: string
}

const state: ComponentState = reactive({
    showCopyMes: false,
    message: '',
    mesColor: 'primary'
})

/**
 * Copies string to clipboard
 */
const copy = async (): Promise<void> => {
    state.message = ''
    try {
        await clipboardCopy(props.valueToCopy)
        state.message = props.customMessage === '' ? `Copied: ${props.valueToCopy}` : `${props.customMessage}`
        state.mesColor = 'primary'
    } catch (err) {
        state.message = err
        state.mesColor = 'error'
    }
    state.showCopyMes = true
}
</script>
<style>
.break-string {
    word-break: break-all;
}
</style>
