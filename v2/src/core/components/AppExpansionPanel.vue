<template>
    <v-row v-bind="$attrs" class="ml-6 mb-3 align-center justify-start">
        <!--
            Use title-content slot to insert image before title
        -->
        <slot name="title-content"></slot>
        <p class="text-h6 mr-4">{{ props.title }}</p>
        <app-btn-icon v-if="$slots['expand-content']" :icon="icon" size="default" @click="expandPanel"></app-btn-icon>
    </v-row>
    <v-divider></v-divider>
    <v-card fluid width="auto" flat class="mx-6">
        <!--
            Use visible-content slot to show items that a visible when expansion panel is closed
        -->
        <slot name="visible-content"></slot>
    </v-card>
    <v-expand-transition>
        <v-card fluid v-if="expand" width="auto" flat class="mx-6">
            <!--
                Use expand-content slot to show items that a visible when expansion panel is opened
            -->
            <slot name="expand-content"></slot>
        </v-card>
    </v-expand-transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AppBtnIcon from './AppBtnIcon.vue'
/**
 * title @string - title of the expansion panel
 */
const props = defineProps({
    title: {
        type: String
    }
})

const emit = defineEmits<{
    (e: 'expand', expanded: boolean): void
}>()

/**
 * Controls visibility fo the expnaded content
 */
const expand = ref(false)

/**
 * Returns icon based on the expand ref
 */
const icon = computed<string>(() => {
    return expand.value ? 'expand_less' : 'expand_more'
})

/**
 * Toggles expand ref and emits the expand event to the parent
 */
const expandPanel = (): void => {
    expand.value = !expand.value
    emit('expand', expand.value)
}
</script>

<style lang="scss" scoped></style>
