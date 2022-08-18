<template>
    <v-menu close-delay="100" max-height="500" open-delay="60" :open-on-hover="openOnHover" transition="slide-y-transition" location="bottom">
        <template #activator="{ props }">
            <slot name="activator" v-bind="props" />
        </template>
        <v-list :bg-color="bgColor" class="py-2 rounded-xl" max-width="1000px">
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
    }
})
</script>
