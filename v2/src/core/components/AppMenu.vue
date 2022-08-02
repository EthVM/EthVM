<template>
    <v-menu close-delay="100" max-height="500" open-delay="60" :open-on-hover="true" transition="slide-y-transition" location="bottom">
        <template #activator="{ props }">
            <slot name="activator" v-bind="{ props }" />
        </template>
        <v-list bg-color="surface" class="py-2 rounded-b-xl rounded-t-0">
            <slot v-if="$slots.default" />
        </v-list>
    </v-menu>
</template>

<script setup lang="ts"></script>
