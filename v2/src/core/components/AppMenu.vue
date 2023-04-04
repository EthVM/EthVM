<template>
    <v-menu
        close-delay="500"
        max-height="500"
        open-delay="60"
        :open-on-hover="openOnHover"
        :close-on-content-click="closeOnContentClick"
        scroll-strategy="close"
        location="bottom right"
    >
        <template #activator="{ props }">
            <slot name="activator" v-bind="props" />
        </template>
        <v-list :bg-color="bgColor" class="py-2 rounded-xl" :min-width="minWidth" max-width="1000px">
            <slot v-if="$slots.default" />
        </v-list>
    </v-menu>
</template>

<script setup lang="ts">
defineProps({
    openOnHover: {
        type: Boolean,
        defualt: true
    },
    bgColor: {
        type: String,
        default: 'surface'
    },
    closeOnContentClick: {
        type: Boolean,
        default: true
    },
    minWidth: {
        type: String,
        default: '180'
    }
})
</script>
