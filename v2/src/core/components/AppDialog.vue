<template>
    <v-dialog v-model="state.open" @update:model-value="changeValue" :max-width="props.width" :height="props.height" scrollable :open-on-hover="false">
        <v-card rounded="xl">
            <v-card-actions v-if="props.title" class="px-6 pt-6 pb-5">
                <p class="text-h5 font-weight-bold">{{ props.title }}</p>
                <v-spacer />
                <app-btn-icon icon="close" @click="closeOnClick" />
            </v-card-actions>
            <v-card-actions v-if="$slots['no-scroll-content']" :class="{ 'px-6 pt-0 pb-5': props.title }">
                <slot name="no-scroll-content"></slot
            ></v-card-actions>
            <v-card-text class="pt-0" v-if="$slots['scroll-content']">
                <slot name="scroll-content"></slot>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { defineEmits, watch, reactive } from 'vue'
import AppBtnIcon from '@core/components/AppBtnIcon.vue'

interface PropType {
    modelValue: boolean
    width?: string
    height?: string
    title?: string
}
const props = withDefaults(defineProps<PropType>(), {
    width: '530',
    height: '480'
})

const emit = defineEmits<{
    (e: 'update:modelValue', dialog: boolean): void
}>()

const state = reactive({
    open: props.modelValue
})

/**
 * emits dialog state change to parent
 * @param {string} open
 */
const changeValue = (): void => {
    emit('update:modelValue', state.open)
}

/**
 * closes dialog and emits state change to parent
 */
const closeOnClick = (): void => {
    state.open = false
    changeValue()
}

/**
 * Watching changes from the parent
 */
watch(
    () => props.modelValue,
    newVal => {
        if (newVal !== state.open) {
            state.open = newVal
        }
    }
)
</script>
<style lang="scss" scoped></style>
