<template>
    <v-tooltip top color="white" content-class="tooltip-border">
        <template #activator="{ props }">
            <v-icon :class="iconClass" :color="componentProps.iconColor" dark small v-bind="props">{{ componentProps.iconType }}</v-icon>
        </template>
        <span class="black--text">{{ componentProps.text }}</span>
    </v-tooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const componentProps = defineProps({
    text: String,
    iconType: {
        type: String,
        default: 'help_outline'
    },
    iconColor: {
        type: String,
        default: 'info'
    },
    spin: {
        type: Boolean,
        default: false
    }
})

const iconClass = computed<string>(() => {
    const _class = componentProps.spin ? '--text fa-pulse' : '--text'
    return `${componentProps.iconColor}${_class} --text`
})
</script>

<style scoped lang="css">
.tooltip-border {
    border: 1px solid #b4bfd2 !important;
    padding: 5px 10px !important;
    opacity: 1 !important;
    box-shadow: none !important;
}

@keyframes pulse {
    to {
        transform: rotate(360deg);
    }
}
.fa-pulse {
    animation: pulse 1s linear infinite;
}
</style>
