<template>
    <v-dialog v-model="state.open" @update:model-value="changeValue" :max-width="props.width" scrollable :open-on-hover="false">
        <v-card rounded="xl">
            <v-card-actions class="px-6 pt-6 pb-5">
                <p class="text-h5 font-weight-bold">{{ props.title }}</p>
                <v-spacer />
                <app-btn-icon icon="close" @click="closeOnClick" />
            </v-card-actions>
            <v-card-actions v-if="$slots['no-scroll-content']" class="px-6 pt-0 pb-5"> <slot name="no-scroll-content"></slot></v-card-actions>
            <v-card-text class="pt-0">
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
    title: string
}
const props = withDefaults(defineProps<PropType>(), {
    width: '530'
})

const emit = defineEmits<{
    (e: 'update:modelValue', dialog: boolean): void
}>()

// const activeTab = ref(props.modelValue)

const state = reactive({
    open: props.modelValue
})

/**
 * Sets active tab id to param
 * and update active tab and
 * emit tab id to parent
 *
 * @param {string} open
 */
const changeValue = (): void => {
    emit('update:modelValue', state.open)
}
const closeOnClick = (): void => {
    state.open = false
    changeValue()
}

/**
 * Watching changes from the parent
 * Used for manual router history manupulation
 */
watch(
    () => props.modelValue,
    newVal => {
        if (newVal !== state.open) {
            console.log(props.modelValue)
            state.open = newVal
        }
    }
)
</script>
