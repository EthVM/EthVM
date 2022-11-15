<template>
    <v-chip class="chip justify-center text-button py-1 px-3" :class="chipClass" :size="props.size">
        <slot>{{ props.text }}</slot>
    </v-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
    text: {
        type: String,
        required: true
    },
    size: {
        type: String,
        default: 'small'
    },
    bg: {
        type: String,
        default: 'error'
    },
    color: {
        type: String,
        default: 'text-surface'
    },
    rounded: {
        type: String,
        default: 'sm'
    }
})

const chipClass = computed<string>(() => {
    return `bg-${props.bg} ${props.color} chip-${props.size} rounded-${props.rounded}`
})
</script>

<style lang="scss" scoped>
.chip {
    min-width: 56px;
    &.text-surface {
        color: rgb(var(--v-theme-surface)) !important;
    }
    &.v-chip.v-chip--size-x-small {
        --v-chip-height: 22px;
    }
    &.rounded-sm {
        border-radius: 4px !important;
    }
}
</style>
